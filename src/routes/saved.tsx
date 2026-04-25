import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { foods } from "@/lib/foodar-data";
import { useCart } from "@/contexts/CartContext";
import { FoodCard } from "@/components/FoodCard";

export const Route = createFileRoute("/saved")({
  component: SavedPage,
});

function SavedPage() {
  const { favorites, customFavorites } = useCart();
  const regularItems = foods.filter((f) => favorites.includes(f.id));
  const items = [...regularItems, ...customFavorites];

  return (
    <div className="flex min-h-screen flex-col bg-background pb-[80px]">
      <header className="px-4 pt-4 pb-2">
        <h1 className="text-[22px] font-extrabold text-foreground">Saved Items ❤️</h1>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6">
          <div className="text-7xl">🤍</div>
          <div className="text-base font-bold text-foreground">Nothing saved yet</div>
          <p className="text-sm text-muted-foreground">Tap ❤️ on any dish to save it.</p>
          <Link
            to="/home"
            className="mt-3 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
          >
            Explore Menu
          </Link>
        </div>
      ) : (
        <div className="flex-1 space-y-3 px-4 pt-2">
          <AnimatePresence>
            {items.map((f) => (
              <FoodCard key={f.id} food={f} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
