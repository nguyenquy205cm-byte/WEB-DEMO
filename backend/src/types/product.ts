export interface ProductCreateDTO {
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  sku?: string;
  brandId: number;
  categoryIds: number[];
}

export interface ProductUpdateDTO {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  stock?: number;
  sku?: string;
  brandId?: number;
  categoryIds?: number[];
}

export interface ProductListQuery {
  page?: string;
  limit?: string;
  search?: string;
  brandId?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: "priceAsc" | "priceDesc" | "name" | "newest";
}

export interface ProductResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  sku?: string;
  brand: { id: number; name: string };
  categories: { id: number; name: string }[];
  images: { id: number; url: string; alt?: string; isMain: boolean }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductListResult {
  items: ProductResponse[];
  total: number;
  page: number;
  limit: number;
}
