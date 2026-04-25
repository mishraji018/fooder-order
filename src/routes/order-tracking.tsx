import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export const Route = createFileRoute("/order-tracking")({
  component: OrderTracking,
});

const STEPS = [
  { label: "Order Confirmed", time: "Just now", state: "done" as const },
  { label: "Being Prepared", time: "~5 min", state: "active" as const },
  { label: "Ready for Pickup", time: "~10 min", state: "pending" as const },
  { label: "Delivered", time: "~12 min", state: "pending" as const },
];

function OrderTracking() {
  const navigate = useNavigate();
  const { orderedItems } = useCart();

  return (
    <div className="flex min-h-screen flex-col bg-background pb-28">
      <header className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button
          onClick={() => navigate({ to: "/order-success" })}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-[20px] font-extrabold text-foreground">Track Order</h1>
      </header>

      <div className="px-4">
        <div
          className="flex items-center justify-between rounded-2xl bg-card px-4 py-3"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="text-xs text-muted-foreground">Order ID</div>
          <div className="text-sm font-bold text-foreground">#ORD-2847</div>
        </div>

        <div className="mt-5 rounded-2xl bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="space-y-5">
            {STEPS.map((s, i) => (
              <div key={s.label} className="relative flex items-start gap-4">
                {i < STEPS.length - 1 && (
                  <div
                    className={
                      "absolute left-[15px] top-8 h-10 w-0.5 " +
                      (s.state === "done" ? "bg-success" : "bg-border")
                    }
                  />
                )}
                <div
                  className={
                    "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold " +
                    (s.state === "done"
                      ? "bg-success text-white"
                      : s.state === "active"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground")
                  }
                >
                  {s.state === "done" ? (
                    <Check size={14} strokeWidth={3} />
                  ) : s.state === "active" ? (
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-white"
                      style={{ animation: "var(--animate-pulse-dot)" }}
                    />
                  ) : (
                    i + 1
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <div
                    className={
                      "text-sm font-bold " +
                      (s.state === "pending" ? "text-muted-foreground" : "text-foreground")
                    }
                  >
                    {s.label}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{s.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="text-[13px] font-bold text-foreground">Your Order</div>
          <div
            className="mt-2 space-y-2 rounded-2xl bg-card p-3"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            {orderedItems.length === 0 ? (
              <div className="py-3 text-center text-xs text-muted-foreground">
                No active order
              </div>
            ) : (
              orderedItems.map((c) => (
                <div key={c.item.id} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light text-lg">
                    {c.item.emoji}
                  </div>
                  <div className="flex-1 text-sm font-semibold text-foreground">
                    {c.item.name}
                  </div>
                  <div className="text-xs font-bold text-muted-foreground">×{c.quantity}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-card p-4">
        <Link
          to="/ar"
          className="block w-full rounded-xl bg-gradient-to-r from-secondary to-[oklch(0.65_0.13_215)] py-3.5 text-center text-sm font-bold text-white"
        >
          View in AR 🥽
        </Link>
      </div>
    </div>
  );
}
