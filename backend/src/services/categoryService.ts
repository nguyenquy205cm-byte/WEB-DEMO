import prisma from "../config/prisma";
import { CategoryCreateDTO, CategoryUpdateDTO } from "../types/category";
import * as redisService from "./redis.service";

export const getAllCategories = async () => {
	const cacheKey = `categories`;
	try {
		const cached = await redisService.get(cacheKey);
		if (cached) return JSON.parse(cached);
	} catch (err) {
		// ignore cache errors
	}

	const items = await prisma.category.findMany();
	try {
		await redisService.set(cacheKey, JSON.stringify(items), 300);
	} catch (err) {
		// ignore
	}
	return items;
};

export const getCategoryById = async (id: number) => prisma.category.findUnique({ where: { id } });

export const createCategory = async (dto: CategoryCreateDTO) => {
	const cat = await prisma.category.create({ data: dto as any });
	try {
		await redisService.del("categories");
		await redisService.deleteByPattern("products:*");
		await redisService.del("dashboard");
	} catch (err) {
		// ignore
	}
	return cat;
};

export const updateCategory = async (id: number, dto: CategoryUpdateDTO) => {
	const cat = await prisma.category.update({ where: { id }, data: dto as any });
	try {
		await redisService.del("categories");
		await redisService.deleteByPattern("products:*");
		await redisService.del("dashboard");
	} catch (err) {
		// ignore
	}
	return cat;
};

export const deleteCategory = async (id: number) => {
	const cat = await prisma.category.delete({ where: { id } });
	try {
		await redisService.del("categories");
		await redisService.deleteByPattern("products:*");
		await redisService.del("dashboard");
	} catch (err) {
		// ignore
	}
	return cat;
};
