import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { X, RotateCw, Maximize2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { foods } from "@/lib/foodar-data";

export const Route = createFileRoute("/ar")({
  component: ARView,
});

function ARView() {
  const navigate = useNavigate();
  const { orderedItems } = useCart();

  const item = orderedItems[0]?.item ?? foods[0];

  return (
    <div className="relative flex min-h-screen flex-col bg-[oklch(0.15_0.01_260)] text-white">
      {/* Camera grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-4 pt-4">
        <button
          onClick={() => navigate({ to: orderedItems.length ? "/order-tracking" : "/home" })}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-md"
        >
          <X size={18} />
        </button>
        <div className="text-sm font-bold">AR Mode 🥽</div>
        <div className="rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
          • Live
        </div>
      </header>

      {/* Center floating object */}
      <div className="relative z-10 flex flex-1 items-center justify-center">
        <div className="relative flex flex-col items-center">
          <div
            className="absolute -inset-12 rounded-full bg-white/20 blur-3xl"
            aria-hidden
          />
          <div
            className="relative text-[110px] leading-none"
            style={{ animation: "var(--animate-float)", filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.4))" }}
          >
            {item.emoji}
          </div>
          <div className="relative mt-6 rounded-2xl bg-white/10 px-5 py-2.5 backdrop-blur-md">
            <div className="text-base font-bold">{item.name}</div>
          </div>
          {/* corner brackets */}
          <div className="absolute -inset-32 pointer-events-none">
            {[
              "top-0 left-0 border-t-2 border-l-2",
              "top-0 right-0 border-t-2 border-r-2",
              "bottom-0 left-0 border-b-2 border-l-2",
              "bottom-0 right-0 border-b-2 border-r-2",
            ].map((c, i) => (
              <div
                key={i}
                className={`absolute h-6 w-6 border-secondary ${c}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom panel */}
      <div className="relative z-10 rounded-t-[20px] bg-card px-4 pt-4 pb-5 text-foreground">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
        <div className="text-sm font-bold text-foreground">
          Viewing: {item.name} {item.emoji}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Your food is being prepared fresh!
        </p>

        <div className="mt-3 flex gap-2">
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-background py-2.5 text-xs font-bold text-foreground">
            <RotateCw size={14} /> Rotate
          </button>
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-background py-2.5 text-xs font-bold text-foreground">
            <Maximize2 size={14} /> Scale
          </button>
        </div>

        <button
          onClick={() => navigate({ to: orderedItems.length ? "/order-tracking" : "/home" })}
          className="mt-3 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground"
        >
          ← Back to Order
        </button>
      </div>
    </div>
  );
}
