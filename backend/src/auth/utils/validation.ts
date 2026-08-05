import { ApiError } from "../../utils/apiError";
import { ChangePasswordDTO, LoginDTO, RegisterDTO } from "../types/auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (email: string): boolean => emailRegex.test(email);
const isStrongPassword = (password: string): boolean => password.length >= 8;

export const validateRegisterDTO = (dto: RegisterDTO) => {
  if (!dto || typeof dto !== "object") throw new ApiError("Invalid request body", 400);
  if (!dto.email || !isValidEmail(dto.email)) throw new ApiError("Valid email is required", 400);
  if (!dto.password || !isStrongPassword(dto.password))
    throw new ApiError("Password must be at least 8 characters", 400);
  if (dto.name && typeof dto.name !== "string") throw new ApiError("Name must be a string", 400);
};

export const validateLoginDTO = (dto: LoginDTO) => {
  if (!dto || typeof dto !== "object") throw new ApiError("Invalid request body", 400);
  if (!dto.email || !isValidEmail(dto.email)) throw new ApiError("Valid email is required", 400);
  if (!dto.password || typeof dto.password !== "string") throw new ApiError("Password is required", 400);
};

export const validateChangePasswordDTO = (dto: ChangePasswordDTO) => {
  if (!dto || typeof dto !== "object") throw new ApiError("Invalid request body", 400);
  if (!dto.currentPassword || typeof dto.currentPassword !== "string")
    throw new ApiError("Current password is required", 400);
  if (!dto.newPassword || !isStrongPassword(dto.newPassword))
    throw new ApiError("New password must be at least 8 characters", 400);
  if (dto.newPassword === dto.currentPassword)
    throw new ApiError("New password cannot be the same as current password", 400);
};
