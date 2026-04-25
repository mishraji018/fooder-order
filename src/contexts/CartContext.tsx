import { createContext, useContext, useState, ReactNode } from "react";
import type { Food } from "@/lib/foodar-data";

export type CartItem = { item: Food; quantity: number };
export type OrderStatus = "idle" | "placed" | "preparing" | "ready";

type CartContextValue = {
  cart: CartItem[];
  orderedItems: CartItem[];
  orderStatus: OrderStatus;
  addToCart: (food: Food, qty?: number) => void;
  updateQty: (id: number, qty: number) => void;
  removeFromCart: (id: number) => void;
  placeOrder: () => void;
  resetOrder: () => void;
  editOrder: () => void;
  cartCount: number;
  cartSubtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderedItems, setOrderedItems] = useState<CartItem[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("idle");

  const addToCart = (food: Food, qty: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === food.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === food.id ? { ...c, quantity: c.quantity + qty } : c
        );
      }
      return [...prev, { item: food, quantity: qty }];
    });
  };

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((c) => (c.item.id === id ? { ...c, quantity: qty } : c)));
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((c) => c.item.id !== id));
  };

  const placeOrder = () => {
    setOrderedItems(cart);
    setCart([]);
    setOrderStatus("placed");
    // simulate preparing after a moment
    setTimeout(() => setOrderStatus("preparing"), 1500);
  };

  const resetOrder = () => {
    setOrderedItems([]);
    setOrderStatus("idle");
  };

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);
  const cartSubtotal = cart.reduce((s, c) => s + c.item.price * c.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        orderedItems,
        orderStatus,
        addToCart,
        updateQty,
        removeFromCart,
        placeOrder,
        resetOrder,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
