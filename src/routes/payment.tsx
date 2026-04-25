import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export const Route = createFileRoute("/payment")({
  component: PaymentPage,
});

const OPTIONS = [
  {
    id: "cod",
    icon: "💵",
    title: "Cash on Delivery",
    desc: "Pay when food arrives",
    enabled: true,
  },
  {
    id: "upi",
    icon: "📱",
    title: "UPI / GPay",
    desc: "Scan & Pay instantly",
    enabled: false,
  },
  {
    id: "card",
    icon: "💳",
    title: "Credit / Debit Card",
    desc: "Visa, Mastercard, Rupay",
    enabled: false,
  },
  {
    id: "netbank",
    icon: "🏦",
    title: "Net Banking",
    desc: "All major banks supported",
    enabled: false,
  },
];

function PaymentPage() {
  const navigate = useNavigate();
  const { cart, cartSubtotal, promoDiscount, placeOrder } = useCart();
  const [selected] = useState("cod");
  const [loading, setLoading] = useState(false);

  const delivery = cart.length > 0 ? 20 : 0;
  const taxes = Math.round(cartSubtotal * 0.05);
  const baseTotal = cartSubtotal + delivery + taxes;
  const discountAmt = Math.round((baseTotal * promoDiscount) / 100);
  const total = baseTotal - discountAmt;

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      placeOrder();
      navigate({ to: "/order-success" });
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-28">
      <header className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button
          onClick={() => navigate({ to: "/cart" })}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-[20px] font-extrabold text-foreground">Payment 💳</h1>
      </header>

      <div className="px-4 pt-2">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.65_0.2_30)] p-4 text-primary-foreground">
          <div className="text-[11px] uppercase tracking-wider opacity-90">
            Total Amount
          </div>
          <div className="mt-1 text-[28px] font-black">₹{total}</div>
          {discountAmt > 0 && (
            <div className="mt-0.5 text-[11px] opacity-90">
              FOOD50 saved you ₹{discountAmt} 🎉
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pt-5">
        <div className="text-[13px] font-bold text-foreground">Choose payment method</div>
        <div className="mt-2 space-y-2">
          {OPTIONS.map((o) => {
            const active = selected === o.id;
            return (
              <div
                key={o.id}
                className={
                  "flex items-center gap-3 rounded-2xl border-[1.5px] bg-card p-3 " +
                  (o.enabled
                    ? active
                      ? "border-primary"
                      : "border-border"
                    : "border-border opacity-60")
                }
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-xl">
                  {o.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{o.title}</span>
                    {!o.enabled && (
                      <span className="rounded-full bg-primary-light px-1.5 py-0.5 text-[9px] font-bold uppercase text-primary">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{o.desc}</div>
                </div>
                <span
                  className={
                    "flex h-5 w-5 items-center justify-center rounded-full border-2 " +
                    (active ? "border-primary" : "border-border")
                  }
                >
                  {active && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] italic text-muted-foreground">
          Online payments will be available soon. Currently only COD is supported.
        </p>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-card p-4">
        <button
          onClick={handlePay}
          disabled={loading || cart.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Processing...
            </>
          ) : (
            <>Pay ₹{total} & Confirm →</>
          )}
        </button>
      </div>
    </div>
  );
}
