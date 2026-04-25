import { Star } from "lucide-react";

export function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={size}
          className={i < full ? "fill-primary text-primary" : "fill-none text-border"}
        />
      ))}
      <span className="ml-1 text-[11px] font-medium text-muted-foreground">{rating}</span>
    </div>
  );
}
