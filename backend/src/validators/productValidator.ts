import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import prisma from "../config/prisma";

const parseIdArray = (value: unknown): number[] => {
  if (Array.isArray(value)) {
    return value.map((id) => Number(id)).filter((id) => !Number.isNaN(id));
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }

  return [];
};

export const validateProductPayload = async (req: Request, _res: Response, next: NextFunction) => {
  const { name, price, stock, brandId, categoryIds } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    throw new ApiError("Product name is required", 400);
  }

  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice) || numericPrice <= 0) {
    throw new ApiError("Price must be a number greater than 0", 400);
  }

  const numericStock = Number(stock);
  if (Number.isNaN(numericStock) || numericStock < 0) {
    throw new ApiError("Stock must be a number greater than or equal to 0", 400);
  }

  if (!brandId || Number.isNaN(Number(brandId))) {
    throw new ApiError("brandId is required", 400);
  }

  const brand = await prisma.brand.findUnique({ where: { id: Number(brandId) } });
  if (!brand) {
    throw new ApiError("brandId is not valid", 400);
  }

  const categoryIdsNumbers = parseIdArray(categoryIds);
  if (categoryIdsNumbers.length === 0) {
    throw new ApiError("categoryIds must be a non-empty array", 400);
  }

  const categories = await prisma.category.findMany({ where: { id: { in: categoryIdsNumbers } } });
  if (categories.length !== categoryIdsNumbers.length) {
    throw new ApiError("One or more categoryIds are invalid", 400);
  }

  req.body.price = numericPrice;
  req.body.stock = numericStock;
  req.body.brandId = Number(brandId);
  req.body.categoryIds = categoryIdsNumbers;

  next();
};

export const validateProductUpdatePayload = async (req: Request, _res: Response, next: NextFunction) => {
  const { name, price, stock, brandId, categoryIds } = req.body;

  if (name !== undefined && (typeof name !== "string" || !name.trim())) {
    throw new ApiError("Product name must be a non-empty string", 400);
  }

  if (price !== undefined) {
    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      throw new ApiError("Price must be a number greater than 0", 400);
    }
    req.body.price = numericPrice;
  }

  if (stock !== undefined) {
    const numericStock = Number(stock);
    if (Number.isNaN(numericStock) || numericStock < 0) {
      throw new ApiError("Stock must be a number greater than or equal to 0", 400);
    }
    req.body.stock = numericStock;
  }

  if (brandId !== undefined) {
    if (Number.isNaN(Number(brandId))) {
      throw new ApiError("brandId must be a valid number", 400);
    }

    const brand = await prisma.brand.findUnique({ where: { id: Number(brandId) } });
    if (!brand) {
      throw new ApiError("brandId is not valid", 400);
    }
    req.body.brandId = Number(brandId);
  }

  if (categoryIds !== undefined) {
    const categoryIdsNumbers = parseIdArray(categoryIds);
    if (categoryIdsNumbers.length === 0) {
      throw new ApiError("categoryIds must be a non-empty array", 400);
    }

    const categories = await prisma.category.findMany({ where: { id: { in: categoryIdsNumbers } } });
    if (categories.length !== categoryIdsNumbers.length) {
      throw new ApiError("One or more categoryIds are invalid", 400);
    }
    req.body.categoryIds = categoryIdsNumbers;
  }

  next();
};
