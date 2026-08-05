import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../auth/types/auth";
import * as orderService from "../services/orderService";
import { success } from "../utils/apiResponse";

export const checkout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new Error("Unauthorized");
    const dto = req.body;
    const order = await orderService.checkout(req.user.id, dto);
    return success(res, order, 201, "Order created");
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new Error("Unauthorized");
    const orders = await orderService.getOrders(req.user.id);
    return success(res, orders, 200, "Orders retrieved");
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new Error("Unauthorized");
    const orderId = Number(req.params.id);
    const order = await orderService.getOrderById(req.user.id, orderId);
    return success(res, order, 200, "Order retrieved");
  } catch (err) {
    next(err);
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new Error("Unauthorized");
    const orderId = Number(req.params.id);
    const result = await orderService.cancelOrder(req.user.id, orderId);
    return success(res, result, 200, "Order cancelled");
  } catch (err) {
    next(err);
  }
};
