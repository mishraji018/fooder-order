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
    <motion.div
      layout
      className="rounded-t-[20px] bg-card"
      style={{ boxShadow: "var(--shadow-panel)" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 pt-3 pb-3"
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-border absolute left-1/2 -translate-x-1/2 top-1.5" />
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-primary">
          <Bot size={18} />
        </div>
        <span className="flex-1 text-left text-sm font-medium text-foreground">
          {open ? "AI Assistant" : "Ask AI about food..."}
        </span>
        {open ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3">
              <div className="h-[180px] overflow-y-auto rounded-xl bg-background p-3 space-y-2">
                {messages.map((m, i) => (
                  <div key={i} className={m.from === "ai" ? "flex" : "flex justify-end"}>
                    <div
                      className={
                        m.from === "ai"
                          ? "max-w-[80%] rounded-2xl rounded-bl-sm bg-card px-3 py-2 text-[13px] text-foreground shadow-sm"
                          : "max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-[13px] text-primary-foreground"
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
                                className="inline-flex items-center gap-1 rounded-full bg-primary-light px-2.5 py-1 text-[11px] font-semibold text-primary"
                              >
                                {f.emoji} {f.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                {QUICK_CHIPS.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => send(c.key)}
                    className="shrink-0 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground"
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div className="mt-2 flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send(input)}
                  placeholder="Type your craving..."
                  className="flex-1 rounded-xl border-[1.5px] border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <button
                  onClick={() => send(input)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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
