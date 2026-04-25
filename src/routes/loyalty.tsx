import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Trophy, Users, Copy, CheckCircle2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/loyalty")({
  component: LoyaltyPage,
});

function LoyaltyPage() {
  const navigate = useNavigate();
  const { loyaltyPoints, loyaltyTier, loyaltyHistory } = useCart();

  const nextTierPts = loyaltyTier === "Bronze" ? 100 : loyaltyTier === "Silver" ? 300 : loyaltyTier === "Gold" ? 600 : 0;
  const progress = nextTierPts ? (loyaltyPoints / nextTierPts) * 100 : 100;

  const tiers = [
    { name: "Bronze", pts: "0-99", icon: "🥉", benefits: ["Base earning (1pt/₹10)"] },
    { name: "Silver", pts: "100-299", icon: "🥈", benefits: ["1.5x points", "Priority Serving"] },
    { name: "Gold", pts: "300-599", icon: "🥇", benefits: ["2x points", "10% discount"] },
    { name: "Platinum", pts: "600+", icon: "💎", benefits: ["3x points", "15% discount", "Priority orders"] },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText("RAHUL50");
    toast.success("Code copied! 📋");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-10">
      <header className="sticky top-0 z-20 flex items-center gap-3 bg-background px-4 pt-4 pb-2">
        <button onClick={() => window.history.back()} className="rounded-full bg-muted p-2">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-extrabold text-foreground">Loyalty Rewards 🏆</h1>
      </header>

      <main className="flex-1 px-4 py-4 space-y-6">
        {/* Tier Card */}
        <div className="rounded-3xl bg-gradient-to-br from-primary to-[oklch(0.65_0.2_30)] p-6 text-white shadow-xl">
           <div className="flex items-center justify-between">
             <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur-md">
               {loyaltyTier === "Bronze" ? "🥉" : loyaltyTier === "Silver" ? "🥈" : loyaltyTier === "Gold" ? "🥇" : "💎"}
             </div>
             <div className="text-right">
               <div className="text-3xl font-black">{loyaltyPoints}</div>
               <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Total Points Earned</div>
             </div>
           </div>
           
           <div className="mt-8">
             <div className="flex justify-between text-xs font-bold mb-2">
               <span>{loyaltyTier} Tier</span>
               {nextTierPts > 0 && <span>{loyaltyPoints} / {nextTierPts}</span>}
             </div>
             <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, progress)}%` }} className="h-full bg-white" />
             </div>
             {nextTierPts > loyaltyPoints && (
               <p className="mt-2 text-[10px] font-medium opacity-90 text-center">
                 Just {nextTierPts - loyaltyPoints} more points to reach {loyaltyTier === "Bronze" ? "Silver" : loyaltyTier === "Silver" ? "Gold" : "Platinum"}! 🚀
               </p>
             )}
           </div>
        </div>

        {/* Benefits Table */}
        <div className="space-y-3">
          <h2 className="text-sm font-black text-foreground uppercase tracking-widest px-1">Tier Benefits</h2>
          <div className="space-y-2">
            {tiers.map(t => {
              const isCurrent = t.name === loyaltyTier;
              return (
                <div key={t.name} className={`rounded-2xl border p-4 transition ${isCurrent ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-card opacity-60'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{t.icon}</span>
                      <span className={`font-black ${isCurrent ? 'text-primary' : 'text-foreground'}`}>{t.name}</span>
                    </div>
                    {isCurrent && <span className="rounded-full bg-primary px-2 py-0.5 text-[8px] font-black uppercase text-white">Current</span>}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {t.benefits.map(b => (
                      <span key={b} className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                        <CheckCircle2 size={10} className={isCurrent ? 'text-primary' : ''} /> {b}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* History */}
        <div className="space-y-3">
           <h2 className="text-sm font-black text-foreground uppercase tracking-widest px-1">Points History</h2>
           <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
             {loyaltyHistory.length === 0 ? (
               <div className="p-8 text-center text-xs text-muted-foreground italic">No points history yet</div>
             ) : (
               loyaltyHistory.map(h => (
                 <div key={h.id} className="flex items-center justify-between p-4">
                   <div className="flex flex-col">
                     <span className="text-xs font-bold text-foreground">{h.text}</span>
                     <span className="text-[10px] text-muted-foreground">{h.date}</span>
                   </div>
                   <div className={`text-sm font-black ${h.type === 'earn' ? 'text-success' : 'text-destructive'}`}>
                     {h.type === 'earn' ? '+' : ''}{h.pts} pts
                   </div>
                 </div>
               ))
             )}
           </div>
        </div>

        {/* Referral */}
        <div className="rounded-2xl bg-muted/40 p-5 border border-dashed border-border flex flex-col items-center text-center">
           <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
             <Users size={20} />
           </div>
           <h3 className="text-sm font-black text-foreground">Refer & Earn +50 pts</h3>
           <p className="mt-1 text-[11px] text-muted-foreground">Share your code with friends and get bonus points on their first order!</p>
           
           <div className="mt-4 flex w-full max-w-[200px] items-center justify-between rounded-xl border border-border bg-card p-1.5 pl-4">
             <span className="text-xs font-black tracking-widest text-foreground">RAHUL50</span>
             <button onClick={handleCopy} className="rounded-lg bg-primary p-2 text-white shadow-sm">
               <Copy size={14} />
             </button>
           </div>
        </div>
      </main>
    </div>
  );
}
