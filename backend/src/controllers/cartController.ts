import { Request, Response, NextFunction } from "express";
import * as cartService from "../services/cartService";
import { success } from "../utils/apiResponse";
import { AuthRequest } from "../auth/types/auth";

export const addItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new Error("Unauthorized");
    const result = await cartService.addItem(req.user.id, req.body);
    return success(res, result, 201, "Item added to cart");
  } catch (err) {
    next(err);
  }
};

export const getCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new Error("Unauthorized");
    const result = await cartService.getCart(req.user.id);
    return success(res, result, 200, "Cart retrieved");
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new Error("Unauthorized");
    const itemId = Number(req.params.id);
    const result = await cartService.updateItem(req.user.id, itemId, req.body);
    return success(res, result, 200, "Cart item updated");
  } catch (err) {
    next(err);
  }
};

export const deleteItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new Error("Unauthorized");
    const itemId = Number(req.params.id);
    const result = await cartService.deleteItem(req.user.id, itemId);
    return success(res, result, 200, "Cart item deleted");
  } catch (err) {
    next(err);
  }
};

export const clearCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new Error("Unauthorized");
    const result = await cartService.clearCart(req.user.id);
    return success(res, result, 200, "Cart cleared");
  } catch (err) {
    next(err);
  }
};
