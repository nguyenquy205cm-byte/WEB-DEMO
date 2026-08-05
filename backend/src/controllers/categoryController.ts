import { Request, Response, NextFunction } from "express";
import * as categoryService from "../services/categoryService";
import { success, fail } from "../utils/apiResponse";

export const getAllCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await categoryService.getAllCategories();
    return success(res, items);
  } catch (err) {
    next(err);
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const item = await categoryService.getCategoryById(id);
    if (!item) return fail(res, "Category not found", 404);
    return success(res, item);
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = req.body;
    const item = await categoryService.createCategory(dto);
    return success(res, item, 201);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const dto = req.body;
    const item = await categoryService.updateCategory(id, dto);
    return success(res, item);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await categoryService.deleteCategory(id);
    return success(res, { message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
