import { ProductCreateDTO, ProductListQuery, ProductListResult, ProductResponse, ProductUpdateDTO } from "../types/product";
import prisma from "../config/prisma";
import { ApiError } from "../utils/apiError";
import { deleteImage, uploadImage } from "./azure/blob.service";
import * as redisService from "./redis.service";

const productSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  price: true,
  stock: true,
  sku: true,
  brand: { select: { id: true, name: true } },
  images: { select: { id: true, url: true, alt: true, blobName: true, isMain: true } },
  categories: { select: { category: { select: { id: true, name: true } } } },
  createdAt: true,
  updatedAt: true,
};

const mapProduct = (product: any): ProductResponse => ({
  ...product,
  categories: product.categories.map((item: any) => item.category),
});

const buildSort = (sort?: string) => {
  switch (sort) {
    case "priceAsc":
      return { price: "asc" as const };
    case "priceDesc":
      return { price: "desc" as const };
    case "name":
      return { name: "asc" as const };
    case "newest":
      return { createdAt: "desc" as const };
    default:
      return { createdAt: "desc" as const };
  }
};

export const getAllProducts = async (query: ProductListQuery): Promise<ProductListResult> => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.max(Number(query.limit) || 10, 1);
  const skip = (page - 1) * limit;

  const where: any = {};

  if (query.search) {
    where.name = { contains: query.search, mode: "insensitive" };
  }

  if (query.brandId && !Number.isNaN(Number(query.brandId))) {
    where.brandId = Number(query.brandId);
  }

  if (query.categoryId && !Number.isNaN(Number(query.categoryId))) {
    where.categories = { some: { categoryId: Number(query.categoryId) } };
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {};
    if (query.minPrice !== undefined && !Number.isNaN(Number(query.minPrice))) {
      where.price.gte = Number(query.minPrice);
    }
    if (query.maxPrice !== undefined && !Number.isNaN(Number(query.maxPrice))) {
      where.price.lte = Number(query.maxPrice);
    }
  }

  const cacheKey = `products:${JSON.stringify({ page, limit, search: query.search, brandId: query.brandId, categoryId: query.categoryId, minPrice: query.minPrice, maxPrice: query.maxPrice, sort: query.sort })}`;
  // Try cache
  try {
    const cached = await redisService.get(cacheKey);
    if (cached) return JSON.parse(cached) as ProductListResult;
  } catch (err) {
    // ignore cache errors
  }

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      take: limit,
      skip,
      orderBy: buildSort(query.sort),
      select: productSelect,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items: items.map(mapProduct),
    total,
    page,
    limit,
  };
};

// write-through cache in caller
const cacheProductsResult = async (key: string, value: ProductListResult) => {
  try {
    await redisService.set(key, JSON.stringify(value), 300);
  } catch (err) {
    // ignore
  }
};

export const getProductById = async (id: number) => {
  const cacheKey = `product:${id}`;
  try {
    const cached = await redisService.get(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (err) {
    // ignore
  }

  const product = await prisma.product.findUnique({
    where: { id },
    select: productSelect,
  });

  if (!product) return null;

  const mapped = mapProduct(product);
  try {
    await redisService.set(cacheKey, JSON.stringify(mapped), 300);
  } catch (err) {
    // ignore
  }
  return mapped;
};

const createProductImages = async (files: Express.Multer.File[] | undefined) => {
  const imageUploads = await Promise.all(
    (files || []).map(async (file, index) => {
      const uploadResult = await uploadImage(file);
      return {
        url: uploadResult.url,
        blobName: uploadResult.blobName,
        alt: file.originalname,
        isMain: index === 0,
      };
    }),
  );

  return imageUploads;
};

export const createProduct = async (dto: ProductCreateDTO, files?: Express.Multer.File[]) => {
  const images = await createProductImages(files);

  const product = await prisma.product.create({
    data: {
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      sku: dto.sku,
      brand: { connect: { id: dto.brandId } },
      categories: {
        create: dto.categoryIds.map((categoryId) => ({ category: { connect: { id: categoryId } } })),
      },
      images: {
        create: images,
      },
    },
    select: productSelect,
  });

  const mapped = mapProduct(product);
  // invalidate caches
  try {
    await redisService.deleteByPattern("products:*");
    await redisService.del(`dashboard`);
  } catch (err) {
    // ignore
  }

  return mapped;
};

export const updateProduct = async (id: number, dto: ProductUpdateDTO, files?: Express.Multer.File[]) => {
  const existing = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!existing) {
    throw new ApiError("Product not found", 404);
  }

  const updateData: any = {};
  if (dto.name !== undefined) updateData.name = dto.name;
  if (dto.slug !== undefined) updateData.slug = dto.slug;
  if (dto.description !== undefined) updateData.description = dto.description;
  if (dto.price !== undefined) updateData.price = dto.price;
  if (dto.stock !== undefined) updateData.stock = dto.stock;
  if (dto.sku !== undefined) updateData.sku = dto.sku;
  if (dto.brandId !== undefined) updateData.brand = { connect: { id: dto.brandId } };
  if (dto.categoryIds !== undefined) {
    updateData.categories = {
      deleteMany: {},
      create: dto.categoryIds.map((categoryId) => ({ category: { connect: { id: categoryId } } })),
    };
  }

  if (files && files.length > 0) {
    await Promise.all(existing.images.map((image) => deleteImage(image.blobName)));
    const images = await createProductImages(files);
    updateData.images = { deleteMany: {}, create: images };
  }

  const product = await prisma.product.update({
    where: { id },
    data: updateData,
    select: productSelect,
  });

  const mapped = mapProduct(product);
  // invalidate caches
  try {
    await redisService.deleteByPattern("products:*");
    await redisService.del(`product:${id}`);
    await redisService.del(`dashboard`);
  } catch (err) {
    // ignore
  }

  return mapped;
};

export const deleteProduct = async (id: number) => {
  const existing = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!existing) {
    throw new ApiError("Product not found", 404);
  }

  await Promise.all(existing.images.map((image) => deleteImage(image.blobName)));
  await prisma.product.delete({ where: { id } });
  try {
    await redisService.deleteByPattern("products:*");
    await redisService.del(`product:${id}`);
    await redisService.del(`dashboard`);
  } catch (err) {
    // ignore
  }
};
