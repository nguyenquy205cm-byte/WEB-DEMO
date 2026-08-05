import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '../types/product';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setItems(current => {
      const exists = current.find(item => item.product.id === product.id);
      if (exists) {
        return current.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(current => current.filter(item => item.product.id !== productId));
  };

  const clearCart = () => setItems([]);

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
