import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Pencil, Check } from "lucide-react";
import type { CartItem } from "@/contexts/CartContext";

type Props = {
  open: boolean;
  items: CartItem[];
  subtotal: number;
  delivery: number;
  taxes: number;
  total: number;
  discount?: number;
  estimatedMinutes: number;
  onEdit: () => void;
  onConfirm: () => void;
};

export function ConfirmOrderModal({
  open,
  items,
  subtotal,
  delivery,
  taxes,
  total,
  estimatedMinutes,
  onEdit,
  onConfirm,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Overlay */}
          <motion.button
            type="button"
            aria-label="Dismiss"
            onClick={onEdit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/45"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10 w-full max-w-[430px] rounded-t-[20px] bg-card px-5 pt-4 pb-5"
            style={{ boxShadow: "var(--shadow-panel)" }}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />

            <div>
              <h2 className="text-[18px] font-extrabold text-foreground">
                Confirm Your Order 🛒
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Please review before placing
              </p>
            </div>

            {/* Items */}
            <div className="mt-4 max-h-[180px] space-y-2 overflow-y-auto pr-1">
              {items.map((c) => (
                <div
                  key={c.item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="min-w-0 flex-1 truncate text-foreground">
                    <span className="mr-1.5">{c.item.emoji}</span>
                    {c.item.name}{" "}
                    <span className="text-muted-foreground">× {c.quantity}</span>
                  </span>
                  <span className="ml-2 font-bold text-foreground">
                    ₹{c.item.price * c.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="my-3 border-t border-border" />

            {/* Totals */}
            <div className="space-y-1.5 text-sm">
              <Row label="Subtotal" value={`₹${subtotal}`} />
              <Row label="Delivery" value={`₹${delivery}`} />
              <Row label="Tax (5%)" value={`₹${taxes}`} />
            </div>

            <div className="my-3 border-t border-border" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">TOTAL</span>
              <span className="text-[20px] font-black text-primary">
                ₹{total}
              </span>
            </div>

            {/* Delivery info */}
            <div className="mt-4 space-y-2 rounded-xl bg-background p-3">
              <div className="flex items-center gap-2 text-xs text-foreground">
                <MapPin size={14} className="text-primary" />
                <span className="font-semibold">Table No. 4</span>
                <span className="text-muted-foreground">/ Dine-In</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground">
                <Clock size={14} className="text-secondary" />
                <span className="font-semibold">
                  Estimated: ~{estimatedMinutes} min
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2.5">
              <button
                onClick={onEdit}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-primary bg-card py-3 text-sm font-bold text-primary"
              >
                <Pencil size={14} />
                Edit Order
              </button>
              <button
                onClick={onConfirm}
                className="flex flex-[1.3] items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground"
              >
                <Check size={16} />
                Confirm & Place
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
