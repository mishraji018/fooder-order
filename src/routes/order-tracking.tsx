import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Check, Pencil, Home as HomeIcon, Star } from "lucide-react";
import { toast } from "sonner";
import { useCart, type OrderStatus } from "@/contexts/CartContext";

export const Route = createFileRoute("/order-tracking")({
  component: OrderTracking,
});

type Step = { label: string; time: string };
const STEP_DEFS: Step[] = [
  { label: "Order Confirmed", time: "2:30 PM" },
  { label: "Being Prepared", time: "Estimated 2:42 PM" },
  { label: "Ready for Pickup", time: "~10 min" },
  { label: "Delivered", time: "~12 min" },
];

function stepStateForIndex(i: number, status: OrderStatus): "done" | "active" | "pending" {
  // map status to active step index
  const map: Record<OrderStatus, number> = {
    idle: -1,
    placed: 1,
    preparing: 1,
    ready: 2,
  };
  const active = map[status];
  if (active === -1) return "pending";
  if (i < active) return "done";
  if (i === active) return "active";
  return "pending";
}

function OrderTracking() {
  const navigate = useNavigate();
  const { orderedItems, orderStatus, editOrder } = useCart();

  const orderTotal = orderedItems.reduce(
    (s, c) => s + c.item.price * c.quantity,
    0
  );

  const isReady = orderStatus === "ready";
  const canEdit = orderStatus === "placed" || orderStatus === "preparing";

  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [rated, setRated] = useState(false);

  const handleEdit = () => {
    editOrder();
    navigate({ to: "/cart" });
  };

  const handleSubmitRating = () => {
    if (stars === 0) return;
    toast.success("Thanks for rating! ⭐");
    setRated(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-[80px]">
      <header className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button
          onClick={() => navigate({ to: "/home" })}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-[20px] font-extrabold leading-tight text-foreground">Track Order</h1>
          <div className="text-[11px] text-muted-foreground">#ORD-2847</div>
        </div>
      </header>

      <div className="px-4">
        {isReady && (
          <div className="mb-3 rounded-2xl bg-success px-4 py-3 text-white">
            <div className="text-sm font-extrabold">🎉 Your food is ready!</div>
            <div className="text-[11px] opacity-95">Please collect from Counter 2</div>
          </div>
        )}

        {/* Stepper */}
        <div className="rounded-2xl bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="space-y-5">
            {STEP_DEFS.map((s, i) => {
              const st = stepStateForIndex(i, orderStatus);
              return (
                <div key={s.label} className="relative flex items-start gap-4">
                  {i < STEP_DEFS.length - 1 && (
                    <div
                      className={
                        "absolute left-[15px] top-8 h-10 w-0.5 " +
                        (st === "done" ? "bg-success" : "bg-border")
                      }
                    />
                  )}
                  <div
                    className={
                      "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold " +
                      (st === "done"
                        ? "bg-success text-white"
                        : st === "active"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground")
                    }
                  >
                    {st === "done" ? (
                      <Check size={14} strokeWidth={3} />
                    ) : st === "active" ? (
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
                        (st === "pending" ? "text-muted-foreground" : "text-foreground")
                      }
                    >
                      {s.label}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{s.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rating card */}
        {isReady && !rated && (
          <div
            className="mt-4 rounded-2xl bg-card p-4"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="text-[16px] font-bold text-foreground">How was your order? ⭐</div>
            <div className="mt-3 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setStars(n)}
                  aria-label={`Rate ${n} stars`}
                >
                  <Star
                    size={32}
                    className={n <= stars ? "text-warning" : "text-border"}
                    fill={n <= stars ? "currentColor" : "none"}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              placeholder="Tell us more... (optional)"
              className="mt-3 w-full resize-none rounded-[10px] border-[1.5px] border-border bg-background p-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
            <button
              onClick={handleSubmitRating}
              disabled={stars === 0}
              className="mt-3 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-50"
            >
              Submit Rating
            </button>
          </div>
        )}

        {/* Order items */}
        <div className="mt-4">
          <div className="text-[13px] font-bold text-foreground">Your Order</div>
          <div
            className="mt-2 rounded-2xl bg-card p-4"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            {orderedItems.length === 0 ? (
              <div className="py-2 text-center text-xs text-muted-foreground">
                No active order
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {orderedItems.map((c) => (
                    <div key={c.item.id} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">
                        <span className="mr-1.5">{c.item.emoji}</span>
                        {c.item.name}{" "}
                        <span className="text-muted-foreground">× {c.quantity}</span>
                      </span>
                      <span className="font-bold text-foreground">
                        ₹{c.item.price * c.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="my-3 border-t border-border" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">Total</span>
                  <span className="text-base font-black text-primary">₹{orderTotal}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex flex-col gap-2.5 pb-4">
          {canEdit && orderedItems.length > 0 && (
            <button
              onClick={handleEdit}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-primary bg-card py-3 text-sm font-bold text-primary"
            >
              <Pencil size={14} />
              Edit / Add Items
            </button>
          )}
          <Link
            to="/home"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-muted py-3 text-sm font-bold text-muted-foreground"
          >
            <HomeIcon size={14} />
            Back to Menu
          </Link>
          <Link
            to="/ar"
            className="block w-full rounded-xl bg-gradient-to-r from-secondary to-[oklch(0.65_0.13_215)] py-3 text-center text-sm font-bold text-white"
          >
            🥽 View in AR
          </Link>
        </div>
      </div>
    </div>
  );
}
