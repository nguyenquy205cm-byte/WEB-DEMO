import { User } from "@prisma/client";

export interface AddCartItemDTO {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemDTO {
  quantity: number;
}

export interface CartItemResponse {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
  };
}

export interface CartResponse {
  id: number;
  userId: number;
  items: CartItemResponse[];
  subtotal: number;
  total: number;
}
