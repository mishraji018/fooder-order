import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ShoppingCart, Bell, Search as SearchIcon, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { foods, categories } from "@/lib/foodar-data";
import { useCart } from "@/contexts/CartContext";
import { AIPanel, ARPanel } from "@/components/HomePanels";
import { OfferBanners } from "@/components/OfferBanners";
import { FoodCard } from "@/components/FoodCard";

export const Route = createFileRoute("/home")({
  component: Home,
});

function Home() {
  const [activeCat, setActiveCat] = useState("All");
  const [query, setQuery] = useState("");
  const { cartCount, orderStatus } = useCart();

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
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-lg">
            🍽️
          </div>
          <span className="text-lg font-extrabold tracking-tight text-foreground">
            Food<span className="text-primary">AR</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-sm"
            aria-label="Notifications"
          >
            <Bell size={18} className="text-foreground" />
            <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-primary" />
          </button>
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-sm"
          >
            <ShoppingCart size={18} className="text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Search */}
      <div className="px-4 pt-2">
        <div className="flex items-center gap-2 rounded-xl border-[1.5px] border-border bg-card px-3 py-2.5">
          <SearchIcon size={16} className="text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search food..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear">
              <X size={14} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Offer banners */}
      <OfferBanners />

      {/* Hero */}
      <section className="px-4 pt-3">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.65_0.2_30)] p-5 text-primary-foreground">
          <div className="text-[11px] font-semibold uppercase tracking-wider opacity-90">
            Today's Special ✨
          </div>
          <h2 className="mt-1 text-[22px] font-extrabold leading-tight">Fresh & Hot</h2>
          <p className="mt-1 text-xs opacity-95">Taste the difference 🚀</p>
          <div className="absolute -right-2 -bottom-3 text-[80px] leading-none opacity-90">
            🍔
          </div>
        </div>
      </section>

      {/* Categories */}
      <div className="mt-4 flex gap-2 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => {
          const active = c === activeCat;
          return (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={
                "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition " +
                (active
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground")
              }
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Food list */}
      <main className="flex-1 px-4 pt-2 pb-[320px]">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <div className="text-5xl">😕</div>
            <div className="text-sm font-bold text-foreground">No results found</div>
            <p className="text-xs text-muted-foreground">Try something else</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((f) => (
              <FoodCard key={f.id} food={f} />
            ))}
          </div>
        )}
      </main>

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
            <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AIPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
