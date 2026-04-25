import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import { X } from "lucide-react";

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  if (currentPath === "/" || currentPath === "/ar") {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl shadow-lg transition-transform active:scale-95"
      >
        💬
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4">
          <div className="w-full max-w-[430px] rounded-3xl bg-background p-5 shadow-xl animate-in slide-in-from-bottom-full border border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-foreground">Need Help? 🤝</h2>
              <button onClick={() => setOpen(false)} className="rounded-full bg-muted p-2">
                <X size={18} className="text-foreground" />
              </button>
            </div>
            
            <div className="mt-2 text-sm text-muted-foreground">Quick Actions:</div>

            <div className="mt-4 flex flex-col gap-3">
              <Link to="/order-tracking" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl bg-card p-3 border border-border">
                <div className="text-xl">📦</div>
                <div className="text-sm font-bold text-foreground">Where is my order?</div>
              </Link>
              <Link to="/order-tracking" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl bg-card p-3 border border-border">
                <div className="text-xl">❌</div>
                <div className="text-sm font-bold text-foreground">Cancel my order</div>
              </Link>
              <button onClick={() => { setOpen(false); toast.success("We're sorry! Our team will contact you in 2 minutes. ✅", { duration: 3000 }); }} className="flex items-center gap-3 rounded-xl bg-card p-3 border border-border text-left">
                <div className="text-xl">🔄</div>
                <div className="text-sm font-bold text-foreground">Wrong item delivered</div>
              </button>
              <button onClick={() => { setOpen(false); toast("No active refunds found for your account."); }} className="flex items-center gap-3 rounded-xl bg-card p-3 border border-border text-left">
                <div className="text-xl">💰</div>
                <div className="text-sm font-bold text-foreground">Refund status</div>
              </button>
              <div className="flex items-center gap-3 rounded-xl bg-card p-3 border border-border">
                <div className="text-xl">📞</div>
                <div>
                  <div className="text-sm font-bold text-foreground">Call Support</div>
                  <div className="text-[11px] text-muted-foreground">+91 99999 00000</div>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-border pt-4 text-center text-xs font-semibold text-primary">
              Avg response time: 2 min ⚡
            </div>
          </div>
        </div>
      )}
    </>
  );
}
