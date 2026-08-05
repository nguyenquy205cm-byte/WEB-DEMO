import { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService";
import { success } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";
import { AuthRequest } from "../types/auth";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body);
    return success(res, result, 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

export const profile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new ApiError("Unauthorized", 401);
    const result = await authService.getProfile(req.user);
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new ApiError("Unauthorized", 401);
    const result = await authService.changePassword(req.user, req.body);
    return success(res, result);
  } catch (err) {
    next(err);
  }
};
