import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Plus, Minus, Heart } from "lucide-react";
import { toast } from "sonner";
import { foods } from "@/lib/foodar-data";
import { useCart } from "@/contexts/CartContext";
import { StarRating } from "@/components/StarRating";

export const Route = createFileRoute("/food/$id")({
  component: FoodDetail,
});

function FoodDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { addToCart, isFavorite, toggleFavorite } = useCart();
  const [qty, setQty] = useState(1);
  const [instructions, setInstructions] = useState("");

  const quickChips = ["🌶️ Extra Spicy", "🧅 No Onions", "🧂 Less Salt", "🫙 Extra Sauce", "🥬 No Lettuce", "🌿 Extra Herbs"];

  const food = foods.find((f) => f.id === Number(id));

  if (!food) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6">
        <p className="text-foreground">Food not found.</p>
        <Link to="/home" className="text-sm font-semibold text-primary">
          Go to menu
        </Link>
      </div>
    );
  }

  const fav = isFavorite(food.id);
  const total = food.price * qty;
  const isAvailable = food.available !== false;

  const handleAdd = () => {
    if (!isAvailable) {
      toast.success("We'll notify you when it's back! ✅", { duration: 2000 });
      return;
    }
    addToCart(food, qty, instructions);
    toast.success("Added to cart ✅", { duration: 1500 });
    setTimeout(() => navigate({ to: "/home" }), 400);
  };

  const bgClasses = {
    mint: "bg-mint",
    sky: "bg-sky",
    beige: "bg-beige"
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-32">
      {/* Curved Header */}
      <div className={`relative h-[340px] w-full rounded-b-[48px] px-4 pt-6 ${bgClasses[food.bgColor || 'mint']}`}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/home" })}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-sm text-[#121212]"
          >
            <ChevronLeft size={20} />
          </button>
          <button
             className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-sm text-[#121212]"
          >
             <span className="text-lg">🔗</span>
          </button>
        </div>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-4 flex justify-center"
        >
          <img 
            src={food.image} 
            alt={food.name} 
            className="h-[220px] w-full object-contain drop-shadow-2xl"
          />
        </motion.div>
      </div>

      {/* Info Content */}
      <div className="relative -mt-10 rounded-t-[40px] bg-background px-6 pt-10">
        <div className="flex items-center justify-between">
           <div>
              <h1 className="text-[26px] font-black leading-tight text-foreground">
                {food.name}
              </h1>
              <p className="mt-1 text-sm font-medium text-muted-foreground italic">Pure joy in every bite</p>
           </div>
           <button
             onClick={() => toggleFavorite(food.id)}
             className="flex h-12 w-12 items-center justify-center rounded-full bg-card border border-border shadow-sm"
           >
             <Heart
               size={20}
               className={fav ? "text-destructive" : "text-muted-foreground"}
               fill={fav ? "currentColor" : "none"}
             />
           </button>
        </div>

        <div className="mt-6 flex items-center justify-between border-b border-border pb-6">
           <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-base font-black text-foreground">
                 <span className="text-warning">⭐</span> {food.rating}
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Rating</span>
           </div>
           <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-base font-black text-foreground">
                 <span className="text-primary">🕒</span> {food.time}
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Cooking</span>
           </div>
           <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-base font-black text-foreground">
                 <span className="text-success">🔥</span> {food.calories}
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Kcal</span>
           </div>
        </div>


        <div className="mt-8">
          <h3 className="text-lg font-black text-foreground">Description</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {food.desc}. Our chefs use only the freshest ingredients to ensure a premium taste experience. Perfect for a quick meal or a satisfying snack.
          </p>
        </div>

        {/* Special Instructions */}
        <div className="mt-8">
          <h3 className="text-base font-black text-foreground">Special Instructions 📝</h3>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value.slice(0, 100))}
            placeholder="e.g. No onions, Extra spicy..."
            className="mt-3 w-full resize-none rounded-2xl border border-border bg-muted/20 p-4 text-sm text-foreground outline-none focus:border-primary"
            rows={2}
          />
        </div>
      </div>

      {/* Bottom Sticky Action */}
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 bg-card/90 p-6 pt-4 backdrop-blur-xl border-t border-border flex items-center justify-between gap-6 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
         <div className="flex items-center gap-4 rounded-2xl bg-muted p-2">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border shadow-sm text-foreground transition-transform active:scale-90"
            >
              <Minus size={18} />
            </button>
            <span className="min-w-6 text-center text-lg font-black text-foreground">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg transition-transform active:scale-90"
            >
              <Plus size={18} />
            </button>
         </div>

         <button
           onClick={handleAdd}
           disabled={!isAvailable}
           className="h-[56px] flex-1 rounded-3xl bg-primary text-sm font-black text-primary-foreground shadow-[0_10px_25px_-5px_rgba(255,112,67,0.4)] transition-all active:scale-95 disabled:opacity-50"
         >
           Add to Cart
         </button>
      </div>
    </div>
  );
}
