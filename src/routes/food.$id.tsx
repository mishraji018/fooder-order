import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
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

  const handleAdd = () => {
    addToCart(food, qty);
    toast.success("Added to cart ✅", { duration: 1500 });
    setTimeout(() => navigate({ to: "/home" }), 400);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-28">
      <div className="flex items-center justify-between px-4 pt-4">
        <button
          onClick={() => navigate({ to: "/home" })}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="truncate px-2 text-sm font-extrabold text-foreground">
          {food.name}
        </h2>
        <button
          onClick={() => toggleFavorite(food.id)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-sm"
          aria-label={fav ? "Remove favorite" : "Add favorite"}
        >
          <Heart
            size={18}
            className={fav ? "text-destructive" : "text-muted-foreground"}
            fill={fav ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="mx-4 mt-4 flex h-56 items-center justify-center rounded-3xl bg-primary-light text-[110px]">
        {food.emoji}
      </div>

      <div className="px-5 pt-5">
        <h1 className="text-[22px] font-extrabold leading-tight text-foreground">
          {food.name}
        </h1>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <StarRating rating={food.rating} />
          <span>·</span>
          <span>120 reviews</span>
          <span>·</span>
          <span>🕐 {food.time}</span>
        </div>
        <div className="mt-3 text-[24px] font-black text-primary">₹{food.price}</div>

        <h3 className="mt-5 text-[15px] font-bold text-foreground">About</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{food.desc}</p>

        <h3 className="mt-5 text-[15px] font-bold text-foreground">Nutrition Info</h3>
        <div className="mt-2 flex gap-2">
          {[
            { e: "🔥", v: `${food.calories} cal` },
            { e: "🥩", v: `${food.protein} protein` },
            { e: "🍞", v: `${food.carbs} carbs` },
          ].map((n) => (
            <div
              key={n.v}
              className="flex-1 rounded-xl bg-muted px-2 py-2.5 text-center text-[11px] font-medium text-foreground"
            >
              <div className="text-base">{n.e}</div>
              <div className="mt-0.5">{n.v}</div>
            </div>
          ))}
        </div>

        <h3 className="mt-5 text-[15px] font-bold text-foreground">Quantity</h3>
        <div className="mt-2 flex justify-center">
          <div
            className="inline-flex items-center gap-3 rounded-full bg-card p-1.5"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-primary"
            >
              <Minus size={14} />
            </button>
            <span className="min-w-6 text-center text-base font-bold">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-[430px] -translate-x-1/2 items-center gap-3 border-t border-border bg-card px-4 py-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Total
          </div>
          <div className="text-lg font-black text-foreground">₹{total}</div>
        </div>
        <button
          onClick={handleAdd}
          className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground"
        >
          Add to Cart →
        </button>
      </div>
    </div>
  );
}
