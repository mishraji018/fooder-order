import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ShoppingCart, Bell, Search as SearchIcon, X, Filter } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { foods } from "@/lib/foodar-data";
import { useCart } from "@/contexts/CartContext";
import { AIPanel, ARPanel } from "@/components/HomePanels";
import { FoodCard } from "@/components/FoodCard";

export const Route = createFileRoute("/home")({
  component: Home,
});

function Home() {
  const [activeCat, setActiveCat] = useState("All");
  const [query, setQuery] = useState("");
  const { cartCount, orderStatus, orderHistory, addToCart, loyaltyPoints, loyaltyTier } = useCart();

  const nextTierPts = loyaltyTier === "Bronze" ? 100 : loyaltyTier === "Silver" ? 300 : loyaltyTier === "Gold" ? 600 : 0;
  const progress = nextTierPts ? (loyaltyPoints / nextTierPts) * 100 : 100;

  const usuals = useMemo(() => {
    if (!orderHistory || orderHistory.length === 0) return [];
    const itemsMap = new Map();
    orderHistory.forEach(order => {
      order.items.forEach(item => {
        if (!itemsMap.has(item.name)) {
          const food = foods.find(f => f.id === item.foodId || f.name === item.name);
          if (food && food.available !== false) itemsMap.set(item.name, food);
        }
      });
    });
    return Array.from(itemsMap.values()).slice(0, 3);
  }, [orderHistory]);

  const filtered = useMemo(() => {
    let list = activeCat === "All" ? foods : foods.filter((f) => f.cat === activeCat);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (f) => f.name.toLowerCase().includes(q) || f.cat.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCat, query]);

  const showAR = orderStatus !== "idle";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
             <span className="text-primary">🍽️</span> Table No. 4 <span className="text-[10px]">▼</span>
          </div>
          <h1 className="text-[20px] font-black text-foreground mt-0.5 leading-tight">
            Order From Your Table <br/> served Fresh & Hot
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
             <Link to="/profile" className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden border-2 border-primary/20">
               <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" alt="Profile" />
             </Link>
             <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-background" />
          </div>
          <Link to="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-sm border border-border">
            <ShoppingCart size={18} className="text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Search Bar Navigation */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-3">
          <Link 
            to="/search" 
            className="flex flex-1 items-center gap-3 rounded-full bg-white px-5 py-3.5 shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-white cursor-pointer active:scale-[0.98] transition-transform"
          >
            <SearchIcon size={18} className="text-primary" />
            <span className="flex-1 text-[14px] font-medium text-muted-foreground/60">
              Search your craving...
            </span>
          </Link>
          <button className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20 transition-transform active:scale-90">
             <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Offer Banner */}
      <section className="px-4 pt-6">
        <div className="relative overflow-hidden rounded-[32px] bg-mint p-6 flex items-center justify-between min-h-[140px] border border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]">
           <div className="relative z-10 max-w-[60%]">
              <div className="text-[14px] font-bold text-[#1A1A1A]/80">Order a set With</div>
              <div className="text-[24px] font-black text-[#1A1A1A] mt-0.5 leading-none">40% discount</div>
              <button className="mt-4 rounded-full bg-[#1A1A1A] px-5 py-2 text-[11px] font-black text-white">
                 Order Now
              </button>
           </div>
           <div className="absolute right-[-10px] bottom-[-10px] w-[140px] h-[140px] flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-contain drop-shadow-2xl" alt="Hero" />
           </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 pt-6">
        <div className="flex items-center justify-between">
           <h3 className="text-base font-black text-foreground">Category</h3>
           <button className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors">See All</button>
        </div>
        <div className="mt-3 flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
           {[
             { name: "All", emoji: "🍽️", color: "bg-sky" },
             { name: "Burger", emoji: "🍔", color: "bg-mint" },
             { name: "Pizza", emoji: "🍕", color: "bg-sky" },
             { name: "Pasta", emoji: "🍝", color: "bg-beige" },
             { name: "Drinks", emoji: "🥤", color: "bg-mint" }
           ].map((c) => (
             <button
               key={c.name}
               onClick={() => setActiveCat(c.name)}
               className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold transition-all ${activeCat === c.name ? 'bg-primary text-white shadow-md' : 'bg-card border border-border text-foreground hover:bg-muted'}`}
             >
               <span className={`flex h-8 w-8 items-center justify-center rounded-full text-lg ${activeCat === c.name ? 'bg-white/20' : c.color}`}>{c.emoji}</span>
               {c.name}
             </button>
           ))}
        </div>
      </section>

      {/* Custom Meal Banner */}
      <section className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-[24px] bg-white border border-secondary/20 p-4 shadow-[0_0_25px_rgba(99,102,241,0.08)] flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-[14px] font-extrabold text-[#1A1A1A]">Make your own food 🧑‍🍳</h3>
            <p className="mt-1 text-xs text-[#1A1A1A]/70 leading-tight">From your taste & preference.<br/>Let AI build it for you!</p>
          </div>
          <Link to="/custom-builder" className="ml-3 rounded-xl bg-[#1A1A1A] px-4 py-2.5 text-xs font-bold text-white shadow-sm shrink-0 whitespace-nowrap">
            Start AI 🧑‍🍳
          </Link>
        </div>
      </section>

      {/* Food list - Popular Food */}
      <section className="px-4 pt-6 pb-[120px]">
        <div className="flex items-center justify-between">
           <h3 className="text-base font-black text-foreground">Popular Food</h3>
           <button className="text-[11px] font-bold text-muted-foreground">See All</button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
           {filtered.length === 0 ? (
             <div className="col-span-2 flex flex-col items-center justify-center gap-2 py-12 text-center">
               <div className="text-5xl">😕</div>
               <div className="text-sm font-bold text-foreground">No results found</div>
             </div>
           ) : (
             filtered.map((f) => (
               <FoodCard key={f.id} food={f} />
             ))
           )}
        </div>
      </section>


      {/* Floating bottom panel — sits above the bottom nav (60px) */}
      <div
        className="fixed left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2"
        style={{ bottom: "60px" }}
      >
        <AnimatePresence mode="wait">
          {showAR ? (
            <motion.div key="ar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ARPanel />
            </motion.div>
          ) : (
            <AIPanel />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
