import prisma from "../config/prisma";
import { ApiError } from "../utils/apiError";
import { AddCartItemDTO, CartResponse, UpdateCartItemDTO } from "../types/cart";

const calculateTotals = (items: any[]) => {
  const subtotal = items.reduce((s, it) => s + Number(it.unitPrice) * it.quantity, 0);
  const total = subtotal; // extendable for taxes/fees
  return { subtotal, total };
};

export const getOrCreateCartByUser = async (userId: number) => {
  let cart = await prisma.cart.findUnique({ where: { userId }, include: { items: true } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId }, include: { items: true } });
  }
  return cart;
};

export const getCart = async (userId: number): Promise<CartResponse> => {
  const cart = await prisma.cart.findUnique({ where: { userId }, include: { items: { include: { product: true } } } });
  if (!cart) return { id: 0, userId, items: [], subtotal: 0, total: 0 };

  const items = cart.items.map((it: any) => ({
    id: it.id,
    productId: it.productId,
    quantity: it.quantity,
    unitPrice: Number(it.unitPrice),
    product: {
      id: it.product.id,
      name: it.product.name,
      slug: it.product.slug,
      price: Number(it.product.price),
      stock: it.product.stock,
    },
  }));

  const totals = calculateTotals(items);
  return { id: cart.id, userId: cart.userId, items, subtotal: totals.subtotal, total: totals.total };
};

export const addItem = async (userId: number, dto: AddCartItemDTO) => {
  const product = await prisma.product.findUnique({ where: { id: dto.productId } });
  if (!product) throw new ApiError("Product not found", 404);
  if (product.stock < dto.quantity) throw new ApiError("Insufficient stock", 400);

  const cart = await getOrCreateCartByUser(userId);

  // cart is guaranteed by getOrCreateCartByUser
  const existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId: dto.productId } });
  if (existing) {
    const newQty = existing.quantity + dto.quantity;
    if (product.stock < newQty) throw new ApiError("Insufficient stock", 400);
    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: newQty } });
  } else {
    await prisma.cartItem.create({ data: { cartId: cart.id, productId: dto.productId, quantity: dto.quantity, unitPrice: Number(product.price) } });
  }

  return getCart(userId);
};

export const updateItem = async (userId: number, itemId: number, dto: UpdateCartItemDTO) => {
  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!item) throw new ApiError("Cart item not found", 404);
  const cart = await prisma.cart.findUnique({ where: { id: item.cartId } });
  if (!cart || cart.userId !== userId) throw new ApiError("Unauthorized", 403);

  if (dto.quantity === 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
    return getCart(userId);
  }

  const product = await prisma.product.findUnique({ where: { id: item.productId } });
  if (!product) throw new ApiError("Product not found", 404);
  if (product.stock < dto.quantity) throw new ApiError("Insufficient stock", 400);

  await prisma.cartItem.update({ where: { id: itemId }, data: { quantity: dto.quantity } });
  return getCart(userId);
};

export const deleteItem = async (userId: number, itemId: number) => {
  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!item) throw new ApiError("Cart item not found", 404);
  const cart = await prisma.cart.findUnique({ where: { id: item.cartId } });
  if (!cart || cart.userId !== userId) throw new ApiError("Unauthorized", 403);

  await prisma.cartItem.delete({ where: { id: itemId } });
  return getCart(userId);
};

export const clearCart = async (userId: number) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return { message: "Cart cleared" };
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  return { message: "Cart cleared" };
};
