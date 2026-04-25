import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Food } from "@/lib/foodar-data";

export type CartItem = { item: Food; quantity: number; specialInstructions?: string };
export type OrderStatus = "idle" | "placed" | "preparing" | "ready";

export type HistoryItem = {
  id: string;
  items: { name: string; emoji: string; qty: number; price: number; foodId?: number }[];
  total: number;
  date: string;
  status: "Delivered" | "Cancelled";
  pointsEarned?: number;
  scheduledTime?: string;
};

export type LoyaltyHistory = {
  id: string;
  text: string;
  pts: number;
  date: string;
  type: "earn" | "redeem";
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
  cancelOrder: (reason: string) => void;
  editOrder: () => void;
  setOrderReady: () => void;
  cartCount: number;
  cartSubtotal: number;

  // order timing
  orderPlacedAt: number | null;

  // favorites
  favorites: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  
  // custom favorites
  customFavorites: Food[];
  saveCustomFavorite: (food: Food) => void;
  removeCustomFavorite: (id: number) => void;

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

  // loyalty
  loyaltyPoints: number;
  loyaltyTier: "Bronze" | "Silver" | "Gold" | "Platinum";
  loyaltyHistory: LoyaltyHistory[];
  useLoyaltyPoints: boolean;
  setUseLoyaltyPoints: (val: boolean) => void;
  redeemPoints: (pts: number, discount: number) => void;

  // mood
  lastMood: string | null;
  rememberMood: boolean;
  setMood: (mood: string | null) => void;
  setRememberMood: (val: boolean) => void;

  // advanced ordering
  scheduledTime: string | null;
  setScheduledTime: (val: string | null) => void;
  isGroupOrder: boolean;
  toggleGroupOrder: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderedItems, setOrderedItems] = useState<CartItem[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("idle");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [customFavorites, setCustomFavorites] = useState<Food[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [orderHistory, setOrderHistory] = useState<HistoryItem[]>(SEED_HISTORY);
  const [splashShown, setSplashShown] = useState(false);
  const [orderPlacedAt, setOrderPlacedAt] = useState<number | null>(null);

  // Loyalty
  const [loyaltyPoints, setLoyaltyPoints] = useState(240);
  const [loyaltyHistory, setLoyaltyHistory] = useState<LoyaltyHistory[]>([]);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);

  // Mood
  const [lastMood, setLastMood] = useState<string | null>(null);
  const [rememberMood, setRememberMood] = useState(false);

  // Advanced
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);
  const [isGroupOrder, setIsGroupOrder] = useState(false);

  // Persistence check after mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const savedDark = localStorage.getItem("foodar_dark_mode");
    if (savedDark === "true") setDarkMode(true);

    const savedFavs = localStorage.getItem("foodar_favorites");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    const savedCustom = localStorage.getItem("foodar_custom_favorites");
    if (savedCustom) setCustomFavorites(JSON.parse(savedCustom));

    const savedHistory = localStorage.getItem("foodar_history");
    if (savedHistory) setOrderHistory(JSON.parse(savedHistory));

    const savedPts = localStorage.getItem("foodar_pts");
    if (savedPts) setLoyaltyPoints(parseInt(savedPts));

    const savedPtsHist = localStorage.getItem("foodar_pts_history");
    if (savedPtsHist) setLoyaltyHistory(JSON.parse(savedPtsHist));
  }, []);

  const loyaltyTier = loyaltyPoints >= 600 ? "Platinum" : loyaltyPoints >= 300 ? "Gold" : loyaltyPoints >= 100 ? "Silver" : "Bronze";

  // Apply dark class to <html> for global theming
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("foodar_dark_mode", String(darkMode));
  }, [darkMode]);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("foodar_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("foodar_custom_favorites", JSON.stringify(customFavorites));
  }, [customFavorites]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("foodar_history", JSON.stringify(orderHistory));
  }, [orderHistory]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("foodar_pts", String(loyaltyPoints));
  }, [loyaltyPoints]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("foodar_pts_history", JSON.stringify(loyaltyHistory));
  }, [loyaltyHistory]);

  const addToCart = (food: Food, qty: number = 1, specialInstructions?: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === food.id && c.specialInstructions === specialInstructions);
      if (existing) {
        return prev.map((c) =>
          c.item.id === food.id && c.specialInstructions === specialInstructions ? { ...c, quantity: c.quantity + qty } : c
        );
      }
      return [...prev, { item: food, quantity: qty, specialInstructions }];
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
    const pts = Math.floor(cartSubtotal / 10);
    let finalPts = pts;
    if (loyaltyTier === "Silver") finalPts = Math.floor(pts * 1.5);
    else if (loyaltyTier === "Gold") finalPts = pts * 2;
    else if (loyaltyTier === "Platinum") finalPts = pts * 3;

    if (useLoyaltyPoints) {
      setLoyaltyPoints(prev => prev - 100);
      setLoyaltyHistory(prev => [{ id: Date.now().toString(), text: "Redeemed for order", pts: -100, date: "Today", type: "redeem" }, ...prev]);
    }

    setLoyaltyPoints(prev => prev + finalPts);
    setLoyaltyHistory(prev => [{ id: (Date.now() + 1).toString(), text: "Earned from order", pts: finalPts, date: "Today", type: "earn" }, ...prev]);

    const newOrder: HistoryItem = {
      id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      items: cart.map(c => ({ name: c.item.name, emoji: c.item.emoji, qty: c.quantity, price: c.item.price, foodId: c.item.id })),
      total: cartSubtotal,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: "Delivered",
      pointsEarned: finalPts,
      scheduledTime: scheduledTime || undefined
    };

    setOrderHistory(prev => [newOrder, ...prev]);
    setOrderedItems(cart);
    setCart([]);
    setOrderStatus("placed");
    setOrderPlacedAt(Date.now());
    clearPromo();
    setUseLoyaltyPoints(false);
    
    setTimeout(() => setOrderStatus("preparing"), 1500);
    setTimeout(() => setOrderStatus("ready"), 15000);
  };

  const resetOrder = () => {
    setOrderedItems([]);
    setOrderStatus("idle");
    setOrderPlacedAt(null);
  };

  const cancelOrder = (reason: string) => {
    setOrderedItems([]);
    setOrderStatus("idle");
    setOrderPlacedAt(null);
    // reason could be sent to backend here
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

  const saveCustomFavorite = (food: Food) => setCustomFavorites((prev) => [...prev, food]);
  const removeCustomFavorite = (id: number) => setCustomFavorites((prev) => prev.filter((f) => f.id !== id));

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
        cancelOrder,
        editOrder,
        setOrderReady,
        cartCount,
        cartSubtotal,
        favorites,
        toggleFavorite,
        isFavorite,
        customFavorites,
        saveCustomFavorite,
        removeCustomFavorite,
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
        orderPlacedAt,
        markSplashShown,
        loyaltyPoints,
        loyaltyTier,
        loyaltyHistory,
        useLoyaltyPoints,
        setUseLoyaltyPoints,
        redeemPoints: (pts, d) => {
          setLoyaltyPoints(prev => prev - pts);
          setLoyaltyHistory(prev => [{ id: Date.now().toString(), text: "Redeemed", pts: -pts, date: "Today", type: "redeem" }, ...prev]);
        },
        lastMood,
        rememberMood,
        setMood: (m) => setLastMood(m),
        setRememberMood: (v) => setRememberMood(v),
        scheduledTime,
        setScheduledTime,
        isGroupOrder,
        toggleGroupOrder: () => setIsGroupOrder(prev => !prev),
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
