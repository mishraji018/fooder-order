import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export const Route = createFileRoute("/order-success")({
  component: OrderSuccess,
});

function OrderSuccess() {
  const { orderedItems } = useCart();
  const total = orderedItems.reduce((s, c) => s + c.item.price * c.quantity, 0);
  const maxTime = orderedItems.reduce(
    (m, c) => Math.max(m, parseInt(c.item.time) || 0),
    0
  );

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-5 pt-10 pb-8">
      <div
        className="flex h-24 w-24 items-center justify-center rounded-full bg-success text-white"
        style={{ animation: "var(--animate-check-in)" }}
      >
        <Check size={56} strokeWidth={3} />
      </div>
      <h1 className="mt-5 text-[24px] font-extrabold text-foreground">Order Placed! 🎉</h1>
      <p className="mt-1 text-sm text-muted-foreground">Your food is being prepared</p>

      <div
        className="mt-6 w-full rounded-2xl bg-card p-4"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex items-center justify-between text-[12px]">
          <span className="font-semibold text-muted-foreground">Order ID</span>
          <span className="font-bold text-foreground">#ORD-2847</span>
        </div>
        <div className="my-3 border-t border-border" />
        <div className="space-y-2">
          {orderedItems.map((c) => (
            <div key={c.item.id} className="flex items-center justify-between text-sm">
              <span className="text-foreground">
                <span className="mr-1.5">{c.item.emoji}</span>
                {c.item.name} × {c.quantity}
              </span>
              <span className="font-bold text-foreground">₹{c.item.price * c.quantity}</span>
            </div>
          ))}
        </div>
        <div className="my-3 border-t border-border" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground">Total</span>
          <span className="text-base font-black text-primary">₹{total}</span>
        </div>
        <div className="mt-3 space-y-2 rounded-xl bg-primary-light px-3 py-2 text-xs font-semibold text-primary">
          <div>⏱ Ready in ~{maxTime || 12} min</div>
          <div>💵 Pay at Table</div>
        </div>
      </div>

      <div className="mt-6 flex w-full flex-col gap-2.5">
        <Link
          to="/order-tracking"
          className="w-full rounded-xl bg-primary py-3.5 text-center text-sm font-bold text-primary-foreground"
        >
          🧾 Track Order →
        </Link>
        <Link
          to="/ar"
          className="w-full rounded-xl bg-gradient-to-r from-secondary to-[oklch(0.65_0.13_215)] py-3.5 text-center text-sm font-bold text-white"
        >
          🥽 View in AR
        </Link>
      </div>
    </div>
  );
}
