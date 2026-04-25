import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Check, Pencil, Home as HomeIcon } from "lucide-react";
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
  const { orderedItems, orderStatus, editOrder } = useCart();

  const orderTotal = orderedItems.reduce(
    (s, c) => s + c.item.price * c.quantity,
    0
  );

  const isReady = orderStatus === "ready";
  const canEdit = orderStatus === "placed" || orderStatus === "preparing";

  const handleEdit = () => {
    editOrder();
    navigate({ to: "/cart" });
  };

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

        {/* Add more items section */}
        <div className="mt-5">
          <div className="text-[13px] font-bold text-foreground">
            Want to add more items?
          </div>
          <div
            className="mt-2 rounded-2xl bg-card p-4"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              🍔 Your Current Order
            </div>
            <div className="mt-3 space-y-2">
              {orderedItems.length === 0 ? (
                <div className="py-2 text-center text-xs text-muted-foreground">
                  No active order
                </div>
              ) : (
                orderedItems.map((c) => (
                  <div
                    key={c.item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-foreground">
                      <span className="mr-1.5">{c.item.emoji}</span>
                      {c.item.name}{" "}
                      <span className="text-muted-foreground">× {c.quantity}</span>
                    </span>
                    <span className="font-bold text-foreground">
                      ₹{c.item.price * c.quantity}
                    </span>
                  </div>
                ))
              )}
            </div>
            {orderedItems.length > 0 && (
              <>
                <div className="my-3 border-t border-border" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">Total</span>
                  <span className="text-base font-black text-primary">
                    ₹{orderTotal}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="mt-3 flex flex-col gap-2.5">
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
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-card p-4">
        {isReady ? (
          <button className="block w-full rounded-xl bg-success py-3.5 text-center text-sm font-bold text-white">
            Collect Now 🎉
          </button>
        ) : (
          <Link
            to="/ar"
            className="block w-full rounded-xl bg-gradient-to-r from-secondary to-[oklch(0.65_0.13_215)] py-3.5 text-center text-sm font-bold text-white"
          >
            View in AR 🥽
          </Link>
        )}
      </div>
    </div>
  );
}
