import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Minus, Plus, X, Tag } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { ConfirmOrderModal } from "@/components/ConfirmOrderModal";
import { foods } from "@/lib/foodar-data";
import { useMemo } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const navigate = useNavigate();
  const {
    cart,
    cartSubtotal,
    addToCart,
    removeFromCart,
    updateQty,
    loyaltyPoints,
    useLoyaltyPoints,
    setUseLoyaltyPoints,
    promoCode,
    promoDiscount,
    applyPromo,
    clearPromo,
    orderHistory,
    scheduledTime,
    setScheduledTime,
    isGroupOrder,
    toggleGroupOrder,
  } = useCart();

  const discountAmt = useMemo(() => {
    const serviceCharge = 0;
    const taxes = Math.round(cartSubtotal * 0.05);
    const baseTotal = cartSubtotal + serviceCharge + taxes;
    return Math.round((baseTotal * promoDiscount) / 100);
  }, [cartSubtotal, promoDiscount]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [promoInput, setPromoInput] = useState(promoCode);
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(
    promoCode ? { ok: true, text: "50% OFF Applied! 🎉" } : null
  );

  const popular = useMemo(() => foods.slice().sort((a, b) => b.rating - a.rating).slice(0, 3), []);
  const usuals = useMemo(() => {
    if (!orderHistory || orderHistory.length === 0) return [];
    const itemsMap = new Map();
    orderHistory.forEach(order => {
      order.items.forEach(item => {
        if (!itemsMap.has(item.name)) {
          const food = foods.find(f => f.id === item.foodId || f.name === item.name);
          if (food && food.available !== false) itemsMap.set(item.name, food);
        }
      });
    });
    return Array.from(itemsMap.values()).slice(0, 3);
  }, [orderHistory]);

  const hasUnavailable = cart.some(c => c.item.available === false);
  const unavailableNames = cart.filter(c => c.item.available === false).map(c => c.item.name).join(", ");

  const serviceCharge = 0;
  const taxes = Math.round(cartSubtotal * 0.05);
  const baseTotal = cartSubtotal + serviceCharge + taxes;
  const loyaltyDiscount = useLoyaltyPoints ? 30 : 0;
  const promoDiscountAmt = Math.round((baseTotal * promoDiscount) / 100);
  const total = Math.max(0, baseTotal - promoDiscountAmt - loyaltyDiscount);

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
        <button
          onClick={toggleGroupOrder}
          className="ml-auto rounded-full bg-card px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-secondary border border-secondary/20 shadow-[0_4px_12px_rgba(99,102,241,0.12)] active:scale-95 transition-all"
        >
          {isGroupOrder ? 'Group Mode 👥' : 'Start Group Order'}
        </button>
      </header>

      {cart.length === 0 ? (
        <div className="flex flex-1 flex-col pb-6 pt-4">
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-6 text-center">
            <div className="text-5xl">🛒</div>
            <div className="text-base font-bold text-foreground">Your cart is empty</div>
          </div>
          
          <div className="mt-2 px-4">
            <div className="text-[13px] font-bold text-foreground">Here's what's popular right now 🔥</div>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
              {popular.map((p: any) => (
                <div key={p.id} className="glow-card relative flex w-[140px] shrink-0 flex-col gap-2 rounded-[28px] p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-2xl">{p.emoji}</div>
                  <div className="truncate text-xs font-bold text-foreground">{p.name}</div>
                  <div className="flex items-center justify-between mt-auto pt-1">
                    <span className="text-[11px] font-black text-primary">₹{p.price}</span>
                    <button 
                      onClick={() => { addToCart(p); toast.success("Added to cart! 🛒", {duration: 1500}); }}
                      className="rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground"
                    >Add +</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {usuals.length > 0 && (
            <div className="mt-4 px-4">
              <div className="text-[13px] font-bold text-foreground">Your Usuals 🔄</div>
              <div className="mt-3 flex gap-3 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
                {usuals.map((u: any) => (
                  <div key={u.id} className="glow-card flex w-[200px] shrink-0 items-center gap-3 rounded-[24px] bg-card p-3 border border-border">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-xl">{u.emoji}</div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[11px] font-bold text-foreground">{u.name}</div>
                      <div className="text-[10px] font-black text-primary">₹{u.price}</div>
                    </div>
                    <button
                      onClick={() => { addToCart(u); toast.success("Added to cart! 🛒", { duration: 1500 }); }}
                      className="absolute inset-0"
                      aria-label="Reorder"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-2.5 px-4 pt-2">
            {cart.map((c) => (
              <div
                key={c.item.id}
                className="glow-card flex items-center gap-3 rounded-[28px] p-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-2xl">
                  {c.item.emoji}
                </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-foreground">
                      {c.item.name}
                      {c.item.isCustom && (
                        <span className="ml-2 inline-flex items-center rounded-md bg-purple-500 px-1.5 py-0.5 text-[8px] font-black uppercase text-white">
                          Custom 🧑‍🍳
                        </span>
                      )}
                    </div>
                    {c.specialInstructions && (
                      <div className="truncate text-[10px] italic text-muted-foreground mt-0.5">"{c.specialInstructions}"</div>
                    )}
                    <div className="text-[11px] text-muted-foreground mt-0.5">₹{c.item.price} each</div>
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

          {/* AI Pairing Suggestion in Cart */}
          {cart.length > 0 && !cart.some(c => c.item.id === 6) && (
            <div className="mx-4 mt-4 overflow-hidden rounded-2xl bg-primary/5 border border-primary/10">
               <div className="flex items-center justify-between p-3">
                 <div className="flex items-center gap-2">
                   <span className="text-xl">🤖</span>
                   <div className="flex flex-col">
                     <span className="text-[11px] font-bold text-foreground">Complete your meal?</span>
                     <span className="text-[9px] font-medium text-muted-foreground">Cold Coffee pairs perfectly with your order!</span>
                   </div>
                 </div>
                 <button
                   onClick={() => {
                     const coffee = foods.find(f => f.id === 6);
                     if (coffee) addToCart(coffee);
                     toast.success("Added Cold Coffee! ☕");
                   }}
                   className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-black text-white shadow-sm"
                 >
                   + Add ₹80
                 </button>
               </div>
            </div>
          )}

          {isGroupOrder && (
            <div className="glow-card mx-4 mt-4 flex flex-col gap-4 rounded-[24px] bg-card p-4">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                    💰 Split Bill Calculator
                  </h3>
                  <div className="flex -space-x-2">
                    {['Y', 'P', 'R'].map((initial, i) => (
                      <div key={i} className={`h-6 w-6 rounded-full border-2 border-card flex items-center justify-center text-[8px] font-black text-white ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-blue-500' : 'bg-green-500'}`}>{initial}</div>
                    ))}
                  </div>
               </div>
               <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                     <span className="text-muted-foreground font-medium"><span className="font-black text-primary">You</span> (Burger + Service split)</span>
                     <span className="font-black text-foreground">₹{Math.round(total / 3)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                     <span className="text-muted-foreground font-medium"><span className="font-black text-blue-500">Priya</span> (Pizza split)</span>
                     <span className="font-black text-foreground">₹{Math.round(total / 3)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                     <span className="text-muted-foreground font-medium"><span className="font-black text-green-500">Rahul</span> (Wings split)</span>
                     <span className="font-black text-foreground">₹{Math.round(total / 3)}</span>
                  </div>
               </div>
               <button 
                  onClick={() => toast.success("Split details copied! 📋")}
                  className="mt-4 w-full pill-button border border-border bg-background py-2 text-[10px] font-black uppercase text-muted-foreground"
               >
                 Share Split Details
               </button>
            </div>
          )}

          {hasUnavailable && (
            <div className="mx-4 mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
              ⚠️ <span className="font-bold">{unavailableNames}</span> is currently unavailable. Please remove it to continue.
            </div>
          )}

          {/* Serving Time Section */}
          <div className="mx-4 mt-4 rounded-2xl bg-card p-4 shadow-sm border border-border">
            <h3 className="text-[13px] font-bold text-foreground">🍽️ When should we serve?</h3>
            <div className="mt-3 flex gap-2">
               <button
                 onClick={() => setScheduledTime(null)}
                 className={`flex-1 pill-button rounded-xl py-2.5 text-xs font-bold border transition ${!scheduledTime ? 'bg-primary text-white border-primary shadow-sm' : 'bg-background text-muted-foreground border-border'}`}
               >
                 🔥 Serve Now
               </button>
               <button
                 onClick={() => setScheduledTime("1:30 PM")}
                 className={`flex-1 pill-button rounded-xl py-2.5 text-xs font-bold border transition ${scheduledTime ? 'bg-primary text-white border-primary shadow-sm' : 'bg-background text-muted-foreground border-border'}`}
               >
                 ⌛ Later
               </button>
            </div>
            {scheduledTime && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {["12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM"].map(time => (
                  <button
                    key={time}
                    onClick={() => setScheduledTime(time)}
                    className={`rounded-lg py-2 text-[10px] font-black border transition ${scheduledTime === time ? 'bg-primary text-white border-primary' : 'bg-background text-muted-foreground border-border'}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
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

          {/* Loyalty Redeem */}
          {loyaltyPoints >= 100 && (
            <div className="mx-4 mt-4 rounded-2xl bg-card p-4 shadow-sm border border-border flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center text-success text-xl">💰</div>
                  <div>
                    <h3 className="text-[13px] font-bold text-foreground">Redeem 100 pts?</h3>
                    <p className="text-[10px] font-medium text-muted-foreground">Get extra ₹30 discount on this order!</p>
                  </div>
               </div>
               <button
                 onClick={() => setUseLoyaltyPoints(!useLoyaltyPoints)}
                 className={`relative h-6 w-11 rounded-full transition-colors ${useLoyaltyPoints ? 'bg-success' : 'bg-muted'}`}
               >
                 <motion.div animate={{ x: useLoyaltyPoints ? 20 : 2 }} className="h-4 w-4 rounded-full bg-white shadow-sm mt-1" />
               </button>
            </div>
          )}

          {/* Summary */}
          <div
            className="mx-4 mt-4 rounded-2xl bg-card p-4"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="text-[13px] font-bold text-foreground">Order Summary</div>
            <div className="mt-3 space-y-1.5 text-sm">
              <Row label="Subtotal" value={`₹${cartSubtotal}`} />
              <Row label="Service Charge" value="FREE" good />
              <Row label="Tax (5%)" value={`₹${taxes}`} />
              {promoDiscountAmt > 0 && (
                <Row label={`Promo (${promoDiscount}%)`} value={`−₹${promoDiscountAmt}`} good />
              )}
              {loyaltyDiscount > 0 && (
                <Row label="Loyalty Redeem" value={`−₹${loyaltyDiscount}`} good />
              )}
              <div className="my-2 border-t border-border" />
              <Row label="Total" value={`₹${total}`} bold />
              <p className="mt-2 text-[10px] font-black text-primary uppercase text-center flex items-center justify-center gap-1">
                🏆 You'll earn {Math.floor(cartSubtotal / 10)} points on this order!
              </p>
            </div>
          </div>

          <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-card p-4">
            <button
              onClick={() => setConfirmOpen(true)}
              disabled={hasUnavailable}
              className={`w-full rounded-xl py-3.5 text-sm font-bold ${hasUnavailable ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary text-primary-foreground'}`}
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
        delivery={serviceCharge}
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
