import { Link } from "@tanstack/react-router";
import { Heart, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import type { Food } from "@/lib/foodar-data";
import { useCart } from "@/contexts/CartContext";
import { StarRating } from "./StarRating";

export function FoodCard({ food, onRemove }: { food: Food; onRemove?: () => void }) {
  const { cart, addToCart, updateQty, isFavorite, toggleFavorite } = useCart();
  const inCart = cart.find((c) => c.item.id === food.id);
  const fav = isFavorite(food.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.2 }}
      className="relative flex items-center gap-3 rounded-2xl bg-card p-3"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <Link
        to="/food/$id"
        params={{ id: String(food.id) }}
        className="flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-xl bg-primary-light text-3xl"
      >
        {food.emoji}
      </Link>
      <Link to="/food/$id" params={{ id: String(food.id) }} className="min-w-0 flex-1">
        <div className="truncate pr-7 text-[15px] font-bold text-foreground">{food.name}</div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Ready in {food.time}
        </div>
        <div className="mt-1">
          <StarRating rating={food.rating} />
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(food.id);
          if (fav) onRemove?.();
        }}
        className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-background"
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          size={14}
          className={fav ? "text-destructive" : "text-muted-foreground"}
          fill={fav ? "currentColor" : "none"}
        />
      </button>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <div className="text-[16px] font-black text-primary">₹{food.price}</div>
        {inCart ? (
          <div className="flex items-center gap-1.5 rounded-full bg-primary-light p-1">
            <button
              onClick={() => updateQty(food.id, inCart.quantity - 1)}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-card text-primary"
            >
              <Minus size={12} />
            </button>
            <span className="min-w-4 text-center text-xs font-bold text-primary">
              {inCart.quantity}
            </span>
            <button
              onClick={() => updateQty(food.id, inCart.quantity + 1)}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
              <Plus size={12} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => addToCart(food)}
            className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[12px] font-bold text-primary-foreground"
          >
            Add <Plus size={12} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
