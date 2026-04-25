import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Minus, Plus, X, Tag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { ConfirmOrderModal } from "@/components/ConfirmOrderModal";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const navigate = useNavigate();
  const {
    cart,
    updateQty,
    removeFromCart,
    cartSubtotal,
    promoCode,
    promoDiscount,
    applyPromo,
    clearPromo,
  } = useCart();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [promoInput, setPromoInput] = useState(promoCode);
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(
    promoCode ? { ok: true, text: "50% OFF Applied! 🎉" } : null
  );

  const delivery = cart.length > 0 ? 20 : 0;
  const taxes = Math.round(cartSubtotal * 0.05);
  const baseTotal = cartSubtotal + delivery + taxes;
  const discountAmt = Math.round((baseTotal * promoDiscount) / 100);
  const total = baseTotal - discountAmt;

  const estimatedMinutes =
    cart.reduce((m, c) => Math.max(m, parseInt(c.item.time) || 0), 0) || 12;

  const handleApplyPromo = () => {
    const res = applyPromo(promoInput);
    setPromoMsg({ ok: res.ok, text: res.message });
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    navigate({ to: "/payment" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-28">
      <header className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button
          onClick={() => navigate({ to: "/home" })}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-[20px] font-extrabold text-foreground">Your Cart 🛒</h1>
      </header>

      {cart.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6">
          <div className="text-7xl">🛒</div>
          <div className="text-base font-bold text-foreground">Your cart is empty</div>
          <p className="text-sm text-muted-foreground">Add something delicious to begin.</p>
          <Link
            to="/home"
            className="mt-3 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-2.5 px-4 pt-2">
            {cart.map((c) => (
              <div
                key={c.item.id}
                className="flex items-center gap-3 rounded-2xl bg-card p-3"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-2xl">
                  {c.item.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-foreground">{c.item.name}</div>
                  <div className="text-[11px] text-muted-foreground">₹{c.item.price} each</div>
                  <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-background p-1">
                    <button
                      onClick={() => updateQty(c.item.id, c.quantity - 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-card text-primary"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="min-w-4 text-center text-xs font-bold">{c.quantity}</span>
                    <button
                      onClick={() => updateQty(c.item.id, c.quantity + 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <div className="text-sm font-black text-primary">₹{c.item.price * c.quantity}</div>
                  <button
                    onClick={() => removeFromCart(c.item.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-background text-destructive"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Promo */}
          <div
            className="mx-4 mt-4 rounded-2xl bg-card p-4"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-center gap-2 text-[13px] font-bold text-foreground">
              <Tag size={14} className="text-primary" /> Promo Code
            </div>
            <div className="mt-2 flex gap-2">
              <input
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Enter promo code"
                className="flex-1 rounded-[10px] border-[1.5px] border-border bg-background px-3 py-2 text-sm uppercase text-foreground outline-none focus:border-primary"
              />
              {promoDiscount > 0 ? (
                <button
                  onClick={() => {
                    clearPromo();
                    setPromoInput("");
                    setPromoMsg(null);
                  }}
                  className="rounded-[10px] bg-background px-4 py-2 text-sm font-bold text-muted-foreground"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={handleApplyPromo}
                  className="rounded-[10px] bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
                >
                  Apply
                </button>
              )}
            </div>
            {promoMsg && (
              <div
                className={
                  "mt-2 text-xs font-semibold " +
                  (promoMsg.ok ? "text-success" : "text-destructive")
                }
              >
                {promoMsg.text}
              </div>
            )}
          </div>

          {/* Summary */}
          <div
            className="mx-4 mt-4 rounded-2xl bg-card p-4"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="text-[13px] font-bold text-foreground">Order Summary</div>
            <div className="mt-3 space-y-1.5 text-sm">
              <Row label="Subtotal" value={`₹${cartSubtotal}`} />
              <Row label="Delivery" value={`₹${delivery}`} />
              <Row label="Tax (5%)" value={`₹${taxes}`} />
              {discountAmt > 0 && (
                <Row label={`Promo (${promoDiscount}%)`} value={`−₹${discountAmt}`} good />
              )}
              <div className="my-2 border-t border-border" />
              <Row label="Total" value={`₹${total}`} bold />
            </div>
          </div>

          <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-card p-4">
            <button
              onClick={() => setConfirmOpen(true)}
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground"
            >
              Place Order — ₹{total}
            </button>
          </div>
        </>
      )}

      <ConfirmOrderModal
        open={confirmOpen}
        items={cart}
        subtotal={cartSubtotal}
        delivery={delivery}
        taxes={taxes}
        total={total}
        estimatedMinutes={estimatedMinutes}
        discount={discountAmt}
        onEdit={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  good,
}: {
  label: string;
  value: string;
  bold?: boolean;
  good?: boolean;
}) {
  return (
    <div
      className={
        "flex items-center justify-between " +
        (bold ? "text-base font-extrabold text-foreground" : "text-muted-foreground")
      }
    >
      <span>{label}</span>
      <span
        className={
          bold
            ? "text-primary"
            : good
              ? "font-bold text-success"
              : "font-semibold text-foreground"
        }
      >
        {value}
      </span>
    </div>
  );
}
