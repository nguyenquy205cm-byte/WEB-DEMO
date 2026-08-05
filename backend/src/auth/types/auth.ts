import { Request } from "express";
import { Role } from "@prisma/client";

export interface RegisterDTO {
  email: string;
  password: string;
  name?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface AuthPayload {
  id: number;
  email: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}
