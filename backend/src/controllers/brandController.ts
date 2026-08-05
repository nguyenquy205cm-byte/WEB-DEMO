import { Request, Response, NextFunction } from "express";
import * as brandService from "../services/brandService";
import { success, fail } from "../utils/apiResponse";

export const getAllBrands = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await brandService.getAllBrands();
    return success(res, items);
  } catch (err) {
    next(err);
  }
};

export const getBrandById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const item = await brandService.getBrandById(id);
    if (!item) return fail(res, "Brand not found", 404);
    return success(res, item);
  } catch (err) {
    next(err);
  }
};

export const createBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = req.body;
    const item = await brandService.createBrand(dto);
    return success(res, item, 201);
  } catch (err) {
    next(err);
  }
};

export const updateBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const dto = req.body;
    const item = await brandService.updateBrand(id, dto);
    return success(res, item);
  } catch (err) {
    next(err);
  }
};

export const deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await brandService.deleteBrand(id);
    return success(res, { message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
