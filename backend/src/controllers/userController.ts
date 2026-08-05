import { Request, Response, NextFunction } from "express";
import * as userService from "../services/userService";
import { success, fail } from "../utils/apiResponse";

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await userService.getAllUsers();
    return success(res, items);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const item = await userService.getUserById(id);
    if (!item) return fail(res, "User not found", 404);
    return success(res, item);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = req.body;
    const item = await userService.createUser(dto);
    return success(res, item, 201);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const dto = req.body;
    const item = await userService.updateUser(id, dto);
    return success(res, item);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await userService.deleteUser(id);
    return success(res, { message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
