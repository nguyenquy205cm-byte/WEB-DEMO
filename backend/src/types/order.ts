export interface CheckoutDTO {
  paymentMethod?: "CARD" | "PAYPAL" | "CASH";
  shippingAddress?: string;
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product?: {
    id: number;
    name: string;
    slug: string;
    price: number;
  };
}

export interface OrderResponse {
  id: number;
  userId: number;
  total: number;
  status: string;
  placedAt: Date;
  shippingAddress?: string | null;
  items: OrderItemResponse[];
}
