import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/auth";
import { ApiError } from "../../utils/apiError";
import { Role } from "@prisma/client";

export const roleMiddleware = (allowedRoles: Role[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError("Unauthorized", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError("Forbidden", 403);
    }

    next();
  };
};
