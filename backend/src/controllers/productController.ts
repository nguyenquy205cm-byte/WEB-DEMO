import { Request, Response, NextFunction } from "express";
import * as productService from "../services/productService";
import { success, fail } from "../utils/apiResponse";

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.getAllProducts(req.query as any);
    return success(res, result, 200, "Products retrieved successfully");
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const item = await productService.getProductById(id);
    if (!item) return fail(res, "Product not found", 404);
    return success(res, item, 200, "Product retrieved successfully");
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    const item = await productService.createProduct(req.body, files);
    return success(res, item, 201, "Product created successfully");
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const files = req.files as Express.Multer.File[] | undefined;
    const item = await productService.updateProduct(id, req.body, files);
    return success(res, item, 200, "Product updated successfully");
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await productService.deleteProduct(id);
    return success(res, { message: "Product deleted successfully" }, 200, "Product deleted successfully");
  } catch (err) {
    next(err);
  }
};
