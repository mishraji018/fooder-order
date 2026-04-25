import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { foods, categories } from "@/lib/foodar-data";
import { useCart } from "@/contexts/CartContext";
import { StarRating } from "@/components/StarRating";
import { AIPanel, ARPanel } from "@/components/HomePanels";

export const Route = createFileRoute("/home")({
  component: Home,
});

function Home() {
  const [activeCat, setActiveCat] = useState("All");
  const { cart, cartCount, addToCart, updateQty, orderStatus } = useCart();

  const filtered = activeCat === "All" ? foods : foods.filter((f) => f.cat === activeCat);

  const showAR = orderStatus !== "idle";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-lg">
            🍽️
          </div>
          <span className="text-lg font-extrabold tracking-tight text-foreground">
            Food<span className="text-primary">AR</span>
          </span>
        </div>
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
      </header>

      {/* Hero */}
      <section className="px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.65_0.2_30)] p-5 text-primary-foreground">
          <div className="text-[11px] font-semibold uppercase tracking-wider opacity-90">
            Today's Special ✨
          </div>
          <h2 className="mt-1 text-[22px] font-extrabold leading-tight">Fresh & Hot</h2>
          <p className="mt-1 text-xs opacity-95">Order now, taste the difference 🚀</p>
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
      <main className="flex-1 px-4 pt-2 pb-[260px]">
        <div className="space-y-3">
          {filtered.map((f) => {
            const inCart = cart.find((c) => c.item.id === f.id);
            return (
              <div
                key={f.id}
                className="flex items-center gap-3 rounded-2xl bg-card p-3"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <Link
                  to="/food/$id"
                  params={{ id: String(f.id) }}
                  className="flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-xl bg-primary-light text-3xl"
                >
                  {f.emoji}
                </Link>
                <Link to="/food/$id" params={{ id: String(f.id) }} className="min-w-0 flex-1">
                  <div className="truncate text-[15px] font-bold text-foreground">{f.name}</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    Ready in {f.time}
                  </div>
                  <div className="mt-1">
                    <StarRating rating={f.rating} />
                  </div>
                </Link>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <div className="text-[16px] font-black text-primary">₹{f.price}</div>
                  {inCart ? (
                    <div className="flex items-center gap-1.5 rounded-full bg-primary-light p-1">
                      <button
                        onClick={() => updateQty(f.id, inCart.quantity - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-card text-primary"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="min-w-4 text-center text-xs font-bold text-primary">
                        {inCart.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(f.id, inCart.quantity + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(f)}
                      className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[12px] font-bold text-primary-foreground"
                    >
                      Add <Plus size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating bottom panel */}
      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2">
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
