import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { foods, Food } from "@/lib/foodar-data";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export function SurpriseMe() {
  const { addToCart } = useCart();
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Food | null>(null);
  const [emojiIndex, setEmojiIndex] = useState(0);

  const emojis = ["🍔", "🍕", "🌯", "🍗", "🍝", "☕"];

  const handleSpin = () => {
    setIsSpinning(true);
    setResult(null);
    
    // Emoji cycling animation interval
    let count = 0;
    const interval = setInterval(() => {
      setEmojiIndex((prev) => (prev + 1) % emojis.length);
      count++;
      if (count > 15) {
        clearInterval(interval);
        pickResult();
      }
    }, 80);
  };

  const pickResult = () => {
    // Weighted random by rating
    const available = foods.filter(f => f.available !== false);
    const pool: Food[] = [];
    available.forEach(f => {
      const weight = Math.floor((f.rating - 4) * 10); // 4.9 -> 9 entries, 4.4 -> 4 entries
      for (let i = 0; i < weight; i++) pool.push(f);
    });
    
    const picked = pool[Math.floor(Math.random() * pool.length)];
    
    setTimeout(() => {
      setResult(picked);
      setIsSpinning(false);
    }, 300);
  };

  return (
    <div className="px-4 pt-4">
      {!result ? (
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className="relative w-full overflow-hidden rounded-2xl border-2 border-dashed border-primary/40 bg-card py-6 text-center shadow-sm transition active:scale-95"
        >
          {isSpinning ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
              className="text-4xl"
            >
              {emojis[emojiIndex]}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl animate-bounce">🎲</span>
              <span className="text-sm font-extrabold text-foreground">Can't decide? Surprise Me!</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Let AI pick for you →</span>
            </div>
          )}
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="rounded-2xl bg-card border-2 border-primary p-5 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-2 bg-primary/10 rounded-bl-xl text-[10px] font-black text-primary uppercase">
            AI Picked! 🎲
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-4xl shadow-inner">
              {result.emoji}
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">"{result.name}"</h3>
              <div className="mt-1 flex items-center gap-3">
                <span className="text-sm font-extrabold text-primary">₹{result.price}</span>
                <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
                  ⭐ {result.rating} • {result.time}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-muted p-3">
             <p className="text-[13px] font-medium leading-relaxed text-foreground italic">
               "Aaj try karo kuch naya! 🔥 Ye item aaj sabse popular hai! 😍"
             </p>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              onClick={handleSpin}
              className="flex-1 rounded-xl border border-border bg-background py-3 text-xs font-bold text-muted-foreground"
            >
              🔄 Spin Again
            </button>
            <button
              onClick={() => {
                addToCart(result);
                toast.success(`${result.name} added! 🛒`);
              }}
              className="flex-[2] rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              Add to Cart <Plus size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
