import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import prisma from "../config/prisma";

export const validateAddCartItem = async (req: Request, _res: Response, next: NextFunction) => {
  const { productId, quantity } = req.body;
  if (!productId || Number.isNaN(Number(productId))) throw new ApiError("productId is required", 400);
  if (!quantity || Number.isNaN(Number(quantity)) || Number(quantity) <= 0) throw new ApiError("quantity must be a positive number", 400);

  const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
  if (!product) throw new ApiError("Product not found", 404);
  if (product.stock < Number(quantity)) throw new ApiError("Insufficient stock", 400);

  req.body.productId = Number(productId);
  req.body.quantity = Number(quantity);
  next();
};

export const validateUpdateCartItem = async (req: Request, _res: Response, next: NextFunction) => {
  const { quantity } = req.body;
  if (quantity === undefined || Number.isNaN(Number(quantity)) || Number(quantity) < 0) throw new ApiError("quantity must be a number >= 0", 400);
  req.body.quantity = Number(quantity);
  next();
};
