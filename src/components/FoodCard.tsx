import { Link } from "@tanstack/react-router";
import { Heart, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Food } from "@/lib/foodar-data";
import { useCart } from "@/contexts/CartContext";
import { StarRating } from "./StarRating";

export function FoodCard({ food, onRemove }: { food: Food; onRemove?: () => void }) {
  const { cart, addToCart, updateQty, isFavorite, toggleFavorite, customFavorites, saveCustomFavorite, removeCustomFavorite } = useCart();
  const inCart = cart.find((c) => c.item.id === food.id);
  
  const isFav = food.isCustom 
    ? customFavorites.some(f => f.id === food.id)
    : isFavorite(food.id);

  const isAvailable = food.available !== false;
  const waitMins = parseInt(food.time) || 0;
  
  let WaitIndicator = null;
  if (waitMins <= 7) {
    WaitIndicator = <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-success" />Ready in {food.time}</div>;
  } else if (waitMins <= 12) {
    WaitIndicator = <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-warning"><span className="h-1.5 w-1.5 rounded-full bg-warning" />Busy • {food.time} wait</div>;
  } else {
    WaitIndicator = <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-destructive"><span className="h-1.5 w-1.5 rounded-full bg-destructive" />High demand • {food.time} wait <span className="ml-1 rounded bg-destructive/10 px-1 text-[9px] font-bold text-destructive">🔥 Popular</span></div>;
  }

  const handleCardClick = (e: React.MouseEvent) => {
    if (!isAvailable) {
      e.preventDefault();
      toast("Currently unavailable 😕");
    }
  };

  const bgClasses = {
    mint: "bg-mint",
    sky: "bg-sky",
    beige: "bg-beige"
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`group glow-card relative flex flex-col overflow-hidden rounded-[24px] bg-card pb-3 ${!isAvailable ? 'opacity-60 grayscale-[0.5]' : ''}`}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (food.isCustom) {
            if (isFav) removeCustomFavorite(food.id);
            else saveCustomFavorite(food);
          } else {
            toggleFavorite(food.id);
          }
          if (isFav) onRemove?.();
        }}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-sm"
      >
        <Heart
          size={16}
          className={isFav ? "text-destructive" : "text-[#121212]/40"}
          fill={isFav ? "currentColor" : "none"}
        />
      </button>

      {/* Image Block */}
      <Link
        to={food.isCustom ? "/custom-builder" : "/food/$id"}
        params={food.isCustom ? {} : { id: String(food.id) }}
        className={`relative aspect-[4/3] w-full p-6 transition-transform group-hover:scale-105 ${bgClasses[food.bgColor || 'mint']}`}
      >
        <img
          src={food.image}
          alt={food.name}
          className="h-full w-full object-contain drop-shadow-xl"
        />
        
        {/* Add to Cart Overlay */}
        <div className="absolute -bottom-4 right-4">
          {inCart ? (
            <div className="flex items-center gap-1.5 rounded-full bg-[#121212] p-1 shadow-lg">
               <button
                 onClick={(e) => { e.preventDefault(); updateQty(food.id, inCart.quantity - 1); }}
                 className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white"
               >
                 <Minus size={14} />
               </button>
               <span className="min-w-4 text-center text-xs font-black text-white">{inCart.quantity}</span>
               <button
                 onClick={(e) => { e.preventDefault(); updateQty(food.id, inCart.quantity + 1); }}
                 className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#121212]"
               >
                 <Plus size={14} />
               </button>
            </div>
          ) : (
            <button
              onClick={(e) => { e.preventDefault(); addToCart(food); }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#121212] text-white shadow-lg transition-transform active:scale-90"
            >
              <Plus size={20} />
            </button>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="px-3 pt-6">
        <Link
          to={food.isCustom ? "/custom-builder" : "/food/$id"}
          params={food.isCustom ? {} : { id: String(food.id) }}
          className="block truncate text-[14px] font-black text-foreground"
        >
          {food.name}
        </Link>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
           <span className="text-warning">⭐</span> {food.rating}
        </div>
        <div className="mt-2 text-[15px] font-black text-foreground">₹{food.price}</div>
      </div>
    </motion.div>
  );
}
