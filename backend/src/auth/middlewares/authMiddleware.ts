import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/auth";
import { verifyJwt } from "../utils/jwt";
import { ApiError } from "../../utils/apiError";

export const authMiddleware = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError("Authorization header missing or malformed", 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    req.user = verifyJwt(token);
    next();
  } catch (error) {
    throw new ApiError("Invalid or expired token", 401);
  }
};
