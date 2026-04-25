import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Send, Bot } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { foods, type Food } from "@/lib/foodar-data";
import { useCart } from "@/contexts/CartContext";

type Msg = { from: "ai" | "user"; text: string; foodIds?: number[] };

const QUICK_CHIPS = [
  { label: "Spicy 🌶️", key: "spicy" },
  { label: "Veg 🥦", key: "veg" },
  { label: "Fast ⚡", key: "fast" },
  { label: "Budget 💰", key: "cheap" },
];

function getReply(input: string): { text: string; foodIds: number[] } {
  const t = input.toLowerCase();
  if (t.includes("spicy")) return { text: "Try our Spicy Wings or Chicken Burger 🔥", foodIds: [4, 1] };
  if (t.includes("veg")) return { text: "Veg vibes! Try Veg Wrap or Margherita Pizza 🥦", foodIds: [3, 2] };
  if (t.includes("fast") || t.includes("quick")) return { text: "Chicken Burger — ready in just 5 min ⚡", foodIds: [1] };
  if (t.includes("cheap") || t.includes("budget")) return { text: "Veg Wrap at just ₹90 — best value 💰", foodIds: [3] };
  if (t.includes("pizza")) return { text: "Our Margherita Pizza is wood-fired perfection 🍕", foodIds: [2] };
  return { text: "Try our Spicy Wings 🍗 — crowd favourite!", foodIds: [4] };
}

export function AIPanel() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { from: "ai", text: "Hi! Kya khana chahiye aaj? 😊" },
  ]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const reply = getReply(text);
    setMessages((m) => [
      ...m,
      { from: "user", text },
      { from: "ai", text: reply.text, foodIds: reply.foodIds },
    ]);
    setInput("");
  };

  return (
    <div className="fixed bottom-24 right-4 z-[60] flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, originX: "100%", originY: "100%" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="pointer-events-auto mb-2 w-[320px] overflow-hidden rounded-[28px] bg-card shadow-2xl border border-border"
          >
            {/* Chat Header */}
            <div className="bg-primary p-4 flex items-center gap-3">
               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
                  <Bot size={20} />
               </div>
               <div>
                  <div className="text-sm font-bold text-white">FoodAR AI</div>
                  <div className="text-[10px] text-white/80">Online · Ask me anything!</div>
               </div>
               <button onClick={() => setOpen(false)} className="ml-auto text-white/80">
                  <ChevronDown size={20} />
               </button>
            </div>

            <div className="p-4 bg-background/50">
              <div className="h-[250px] overflow-y-auto pr-1 space-y-3 scrollbar-hide">
                {messages.map((m, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: m.from === "ai" ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className={m.from === "ai" ? "flex" : "flex justify-end"}
                  >
                    <div
                      className={
                        m.from === "ai"
                          ? "max-w-[85%] rounded-2xl rounded-tl-none bg-card px-3 py-2 text-[13px] text-foreground shadow-sm border border-border"
                          : "max-w-[85%] rounded-2xl rounded-tr-none bg-primary px-3 py-2 text-[13px] text-primary-foreground shadow-md"
                      }
                    >
                      <div>{m.text}</div>
                      {m.foodIds && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {m.foodIds.map((id) => {
                            const f = foods.find((x) => x.id === id) as Food;
                            return (
                              <Link
                                key={id}
                                to="/food/$id"
                                params={{ id: String(id) }}
                                className="inline-flex items-center gap-1 rounded-full bg-primary-light px-2.5 py-1 text-[11px] font-semibold text-primary border border-primary/20"
                              >
                                {f.emoji} {f.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Chips */}
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                {QUICK_CHIPS.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => send(c.key)}
                    className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-[10px] font-bold text-foreground hover:bg-muted"
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="mt-3 flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send(input)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-2xl border-none bg-muted/50 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60"
                />
                <button
                  onClick={() => send(input)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg active:scale-95 transition-transform"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-all hover:scale-105 active:scale-95 border border-white/20"
        style={{ boxShadow: "0 0 20px rgba(255, 112, 67, 0.4), 0 10px 40px rgba(255, 112, 67, 0.2)" }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <ChevronDown size={24} />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="relative">
              <Bot size={24} />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-primary" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}

export function ARPanel() {
  const { orderedItems } = useCart();
  const first = orderedItems[0];
  const totalTime = orderedItems.reduce((max, c) => {
    const m = parseInt(c.item.time);
    return Math.max(max, m);
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-t-[20px] bg-card px-4 pt-4 pb-4"
      style={{ boxShadow: "var(--shadow-panel)" }}
    >
      <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
            <span className="text-success">✅</span> Order Confirmed!
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">⏱ Ready in {totalTime || 10} min</div>
        </div>
      </div>

      {first && (
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-background p-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light text-2xl">
            {first.item.emoji}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-foreground">{first.item.name}</div>
            <div className="text-[11px] text-muted-foreground">Being prepared...</div>
          </div>
          {orderedItems.length > 1 && (
            <span className="rounded-full bg-primary-light px-2 py-0.5 text-[11px] font-bold text-primary">
              +{orderedItems.length - 1}
            </span>
          )}
        </div>
      )}

      <Link
        to="/ar"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-secondary to-[oklch(0.65_0.13_215)] px-4 py-3 text-sm font-bold text-white"
      >
        🥽 View in AR
      </Link>
    </motion.div>
  );
}
