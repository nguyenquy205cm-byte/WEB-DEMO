import prisma from "../config/prisma";
import { BrandCreateDTO, BrandUpdateDTO } from "../types/brand";

export const getAllBrands = async () => prisma.brand.findMany();

export const getBrandById = async (id: number) => prisma.brand.findUnique({ where: { id } });

export const createBrand = async (dto: BrandCreateDTO) => prisma.brand.create({ data: dto as any });

export const updateBrand = async (id: number, dto: BrandUpdateDTO) => prisma.brand.update({ where: { id }, data: dto as any });

export const deleteBrand = async (id: number) => prisma.brand.delete({ where: { id } });
