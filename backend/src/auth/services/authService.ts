import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import prisma from "../../config/prisma";
import { ApiError } from "../../utils/apiError";
import { signJwt } from "../utils/jwt";
import { validateChangePasswordDTO, validateLoginDTO, validateRegisterDTO } from "../utils/validation";
import { AuthPayload, ChangePasswordDTO, LoginDTO, RegisterDTO } from "../types/auth";

const SALT_ROUNDS = 10;

const sanitizeUser = (user: { password?: string; [key: string]: any }) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

export const register = async (dto: RegisterDTO) => {
  validateRegisterDTO(dto);

  const existingUser = await prisma.user.findUnique({ where: { email: dto.email } });
  if (existingUser) {
    throw new ApiError("Email already registered", 409);
  }

  const password = await bcrypt.hash(dto.password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      email: dto.email,
      password,
      name: dto.name,
      role: Role.USER,
    },
  });

  return sanitizeUser(user);
};

export const login = async (dto: LoginDTO) => {
  validateLoginDTO(dto);

  const user = await prisma.user.findUnique({ where: { email: dto.email } });
  if (!user) {
    throw new ApiError("Invalid email or password", 401);
  }

  const passwordMatches = await bcrypt.compare(dto.password, user.password);
  if (!passwordMatches) {
    throw new ApiError("Invalid email or password", 401);
  }

  const payload: AuthPayload = { id: user.id, email: user.email, role: user.role };
  const token = signJwt(payload);

  return {
    token,
    user: sanitizeUser(user),
  };
};

export const getProfile = async (payload: AuthPayload) => {
  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) {
    throw new ApiError("User not found", 404);
  }
  return sanitizeUser(user);
};

export const changePassword = async (payload: AuthPayload, dto: ChangePasswordDTO) => {
  validateChangePasswordDTO(dto);

  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const passwordMatches = await bcrypt.compare(dto.currentPassword, user.password);
  if (!passwordMatches) {
    throw new ApiError("Current password is incorrect", 401);
  }

  const hashedPassword = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
  await prisma.user.update({ where: { id: payload.id }, data: { password: hashedPassword } });

  return { message: "Password changed successfully" };
};
