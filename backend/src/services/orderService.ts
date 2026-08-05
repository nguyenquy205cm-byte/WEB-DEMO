import prisma from "../config/prisma";
import { ApiError } from "../utils/apiError";
import { CheckoutDTO, OrderResponse } from "../types/order";

export const checkout = async (userId: number, dto: CheckoutDTO): Promise<OrderResponse> => {
  const cart = await prisma.cart.findUnique({ where: { userId }, include: { items: { include: { product: true } } } });
  if (!cart || cart.items.length === 0) throw new ApiError("Cart is empty", 400);

  // verify stock
  for (const it of cart.items) {
    if (it.product.stock < it.quantity) throw new ApiError(`Insufficient stock for product ${it.productId}`, 400);
  }

  const total = cart.items.reduce((s, it) => s + Number(it.unitPrice) * it.quantity, 0);

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId,
        total: total,
        status: "PENDING",
        paymentMethod: dto.paymentMethod as any,
        shippingAddress: dto.shippingAddress,
        items: {
          create: cart.items.map((it) => ({ productId: it.productId, quantity: it.quantity, unitPrice: it.unitPrice }))
        }
      },
      include: { items: { include: { product: true } } }
    });

    // decrement stock
    for (const it of cart.items) {
      await tx.product.update({ where: { id: it.productId }, data: { stock: { decrement: it.quantity } } as any });
    }

    // clear cart
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    await tx.cart.delete({ where: { id: cart.id } });

    return created;
  });

  // map to OrderResponse
  const response: OrderResponse = {
    id: order.id,
    userId: order.userId,
    total: Number(order.total),
    status: order.status,
    placedAt: order.placedAt,
    shippingAddress: order.shippingAddress,
    items: order.items.map((it: any) => ({ id: it.id, productId: it.productId, quantity: it.quantity, unitPrice: Number(it.unitPrice), product: it.product ? { id: it.product.id, name: it.product.name, slug: it.product.slug, price: Number(it.product.price) } : undefined }))
  };

  return response;
};

export const getOrders = async (userId: number): Promise<OrderResponse[]> => {
  const orders = await prisma.order.findMany({ where: { userId }, include: { items: { include: { product: true } } }, orderBy: { placedAt: "desc" } });
  return orders.map((o: any) => ({ id: o.id, userId: o.userId, total: Number(o.total), status: o.status, placedAt: o.placedAt, shippingAddress: o.shippingAddress, items: o.items.map((it: any) => ({ id: it.id, productId: it.productId, quantity: it.quantity, unitPrice: Number(it.unitPrice), product: it.product ? { id: it.product.id, name: it.product.name, slug: it.product.slug, price: Number(it.product.price) } : undefined })) }));
};

export const getOrderById = async (userId: number, orderId: number): Promise<OrderResponse> => {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: { include: { product: true } } } });
  if (!order) throw new ApiError("Order not found", 404);
  if (order.userId !== userId) throw new ApiError("Unauthorized", 403);
  return { id: order.id, userId: order.userId, total: Number(order.total), status: order.status, placedAt: order.placedAt, shippingAddress: order.shippingAddress, items: order.items.map((it: any) => ({ id: it.id, productId: it.productId, quantity: it.quantity, unitPrice: Number(it.unitPrice), product: it.product ? { id: it.product.id, name: it.product.name, slug: it.product.slug, price: Number(it.product.price) } : undefined })) };
};

export const cancelOrder = async (userId: number, orderId: number) => {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) throw new ApiError("Order not found", 404);
  if (order.userId !== userId) throw new ApiError("Unauthorized", 403);
  if (order.status !== "PENDING") throw new ApiError("Only pending orders can be cancelled", 400);

  await prisma.$transaction(async (tx) => {
    // restock
    for (const it of order.items) {
      await tx.product.update({ where: { id: it.productId }, data: { stock: { increment: it.quantity } } as any });
    }
    await tx.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
  });

  return { message: "Order cancelled" };
};
