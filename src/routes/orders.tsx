import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { foods } from "@/lib/foodar-data";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const { orderStatus, orderedItems, orderHistory, addToCart } = useCart();
  const navigate = useNavigate();

  const activeOrderTotal = orderedItems.reduce(
    (s, c) => s + c.item.price * c.quantity,
    0
  );

  const handleReorder = (foodIds: number[]) => {
    foodIds.forEach((id) => {
      const f = foods.find((x) => x.id === id);
      if (f) addToCart(f, 1);
    });
    toast.success("Items added to cart! 🛒");
    navigate({ to: "/cart" });
  };

  const noActive = orderStatus === "idle";
  const noHistory = orderHistory.length === 0;

  if (noActive && noHistory) {
    return (
      <div className="flex min-h-screen flex-col bg-background pb-[80px]">
        <header className="px-4 pt-4 pb-2">
          <h1 className="text-[22px] font-extrabold text-foreground">My Orders 🧾</h1>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6">
          <div className="text-7xl">🧾</div>
          <div className="text-base font-bold text-foreground">No orders yet</div>
          <Link
            to="/home"
            className="mt-3 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
          >
            Start Ordering
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-[80px]">
      <header className="px-4 pt-4 pb-2">
        <h1 className="text-[22px] font-extrabold text-foreground">My Orders 🧾</h1>
      </header>

      <div className="space-y-4 px-4 pt-2">
        {!noActive && orderedItems.length > 0 && (
          <div
            className="rounded-2xl bg-card p-4"
            style={{ boxShadow: "var(--shadow-card)", borderLeft: "4px solid var(--primary)" }}
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary-light px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                🔄 Active Order
              </span>
              <span className="text-xs font-bold text-foreground">#ORD-2847</span>
            </div>
            <div className="mt-3 space-y-1.5">
              {orderedItems.map((c) => (
                <div key={c.item.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">
                    <span className="mr-1.5">{c.item.emoji}</span>
                    {c.item.name} <span className="text-muted-foreground">× {c.quantity}</span>
                  </span>
                  <span className="font-bold text-foreground">
                    ₹{c.item.price * c.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm font-bold text-foreground">Total</span>
              <span className="text-base font-black text-primary">₹{activeOrderTotal}</span>
            </div>
            <Link
              to="/order-tracking"
              className="mt-3 block w-full rounded-xl bg-primary py-2.5 text-center text-sm font-bold text-primary-foreground"
            >
              Track →
            </Link>
          </div>
        )}

        {orderHistory.length > 0 && (
          <>
            <div className="text-[13px] font-bold text-foreground">Past Orders</div>
            {orderHistory.map((o) => (
              <div
                key={o.id}
                className="rounded-2xl bg-card p-4"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{o.id}</span>
                  <span className="text-[11px] text-muted-foreground">{o.date}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {o.items.map((it) => `${it.emoji} ${it.name} × ${it.qty}`).join(", ")}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">
                    {o.status}
                  </span>
                  <span className="text-base font-black text-primary">₹{o.total}</span>
                </div>
                <button
                  onClick={() =>
                    handleReorder(o.items.map((it) => it.foodId).filter((x): x is number => !!x))
                  }
                  className="mt-3 w-full rounded-xl border-[1.5px] border-primary bg-card py-2 text-xs font-bold text-primary"
                >
                  Reorder
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
