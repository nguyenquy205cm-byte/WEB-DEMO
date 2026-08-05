import prisma from "../config/prisma";
import { UserCreateDTO, UserUpdateDTO } from "../types/user";

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
};

export const getAllUsers = async () => prisma.user.findMany({ select: userSelect });

export const getUserById = async (id: number) => prisma.user.findUnique({ where: { id }, select: userSelect });

export const createUser = async (dto: UserCreateDTO) =>
  prisma.user.create({ data: dto as any, select: userSelect });

export const updateUser = async (id: number, dto: UserUpdateDTO) =>
  prisma.user.update({ where: { id }, data: dto as any, select: userSelect });

export const deleteUser = async (id: number) => prisma.user.delete({ where: { id } });
