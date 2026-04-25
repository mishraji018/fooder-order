import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Food } from "@/lib/foodar-data";

export type CartItem = { item: Food; quantity: number };
export type OrderStatus = "idle" | "placed" | "preparing" | "ready";

export type HistoryItem = {
  id: string;
  items: { name: string; emoji: string; qty: number; price: number; foodId?: number }[];
  total: number;
  date: string;
  status: "Delivered" | "Cancelled";
};

const SEED_HISTORY: HistoryItem[] = [
  {
    id: "ORD-1001",
    items: [{ name: "Margherita Pizza", emoji: "🍕", qty: 1, price: 250, foodId: 2 }],
    total: 290,
    date: "22 Apr 2026",
    status: "Delivered",
  },
  {
    id: "ORD-1002",
    items: [{ name: "Chicken Burger", emoji: "🍔", qty: 2, price: 120, foodId: 1 }],
    total: 280,
    date: "20 Apr 2026",
    status: "Delivered",
  },
];

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
  setOrderReady: () => void;
  cartCount: number;
  cartSubtotal: number;

  // favorites
  favorites: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;

  // dark mode
  darkMode: boolean;
  toggleDarkMode: () => void;

  // search query (shared)
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // promo
  promoCode: string;
  promoDiscount: number; // percent (e.g. 50)
  applyPromo: (code: string) => { ok: boolean; message: string };
  clearPromo: () => void;

  // history
  orderHistory: HistoryItem[];

  // splash
  splashShown: boolean;
  markSplashShown: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderedItems, setOrderedItems] = useState<CartItem[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("idle");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [orderHistory, setOrderHistory] = useState<HistoryItem[]>(SEED_HISTORY);
  const [splashShown, setSplashShown] = useState(false);

  // Apply dark class to <html> for global theming
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

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
    clearPromo();
    setTimeout(() => setOrderStatus("preparing"), 1500);
    // simulate ready after a bit
    setTimeout(() => setOrderStatus("ready"), 15000);
  };

  const resetOrder = () => {
    setOrderedItems([]);
    setOrderStatus("idle");
  };

  const setOrderReady = () => setOrderStatus("ready");

  const editOrder = () => {
    setCart((prev) => {
      const merged = [...prev];
      orderedItems.forEach((oi) => {
        const existing = merged.find((c) => c.item.id === oi.item.id);
        if (existing) existing.quantity += oi.quantity;
        else merged.push({ ...oi });
      });
      return merged;
    });
    setOrderedItems([]);
    setOrderStatus("idle");
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const isFavorite = (id: number) => favorites.includes(id);

  const toggleDarkMode = () => setDarkMode((d) => !d);

  const applyPromo = (code: string) => {
    const c = code.trim().toUpperCase();
    if (c === "FOOD50") {
      setPromoCode(c);
      setPromoDiscount(50);
      return { ok: true, message: "50% OFF Applied! 🎉" };
    }
    setPromoCode("");
    setPromoDiscount(0);
    return { ok: false, message: "Invalid code ❌" };
  };
  const clearPromo = () => {
    setPromoCode("");
    setPromoDiscount(0);
  };

  const markSplashShown = () => setSplashShown(true);

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
        editOrder,
        setOrderReady,
        cartCount,
        cartSubtotal,
        favorites,
        toggleFavorite,
        isFavorite,
        darkMode,
        toggleDarkMode,
        searchQuery,
        setSearchQuery,
        promoCode,
        promoDiscount,
        applyPromo,
        clearPromo,
        orderHistory,
        splashShown,
        markSplashShown,
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
