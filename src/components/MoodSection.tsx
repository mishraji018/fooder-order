import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { foods } from "@/lib/foodar-data";
import { toast } from "sonner";

const MOODS = [
  { emoji: "😄", label: "Happy", key: "happy" },
  { emoji: "😔", label: "Sad", key: "sad" },
  { emoji: "😤", label: "Angry", key: "angry" },
  { emoji: "😴", label: "Lazy", key: "lazy" },
  { emoji: "🤒", label: "Sick", key: "sick" },
  { emoji: "🥳", label: "Party", key: "party" },
  { emoji: "😰", label: "Stressed", key: "stressed" },
];

const MOOD_MAP: Record<string, any> = {
  happy: {
    note: "Celebrate karo! 🎉 Party vibes ke liye something fun!",
    items: [6, 4], // Coffee + Wings
  },
  sad: {
    note: "Comfort food time 🤗 Ek achi cheez khao — sab theek ho jayega 💙",
    items: [5, 6], // Pasta + Coffee
  },
  angry: {
    note: "Spicy food = best therapy 🔥 Iss gusse ko spice se nikalo! 🌶️",
    items: [4, 1], // Wings + Burger
  },
  lazy: {
    note: "Quick & easy 😴 7 min mein ready — uthna bhi nahi padega! 😂",
    items: [3], // Wrap
  },
  sick: {
    note: "Light & healthy only 🏥 Get well soon! Light khao, jaldi theek ho 💊",
    items: [3], // Wrap
  },
  party: {
    note: "Go all out! 🎊 Party pack banao sab ke liye! 🎉",
    items: [2, 4, 6], // Pizza + Wings + Coffee
  },
  stressed: {
    note: "Soul food incoming 🫂 Ek slice sab theek kar deta hai. Trust us. 🍕❤️",
    items: [2], // Pizza
  }
};

export function MoodSection() {
  const { setMood, lastMood, addToCart, rememberMood, setRememberMood } = useCart();
  const [selectedMood, setSelectedMood] = useState<string | null>(lastMood);
  const [showResult, setShowResult] = useState(!!lastMood);

  const handleMoodSelect = (key: string) => {
    setSelectedMood(key);
    setMood(key);
    setShowResult(true);
  };

  const currentMoodData = selectedMood ? MOOD_MAP[selectedMood] : null;
  const moodInfo = selectedMood ? MOODS.find(m => m.key === selectedMood) : null;
  const suggestedItems = currentMoodData ? foods.filter(f => currentMoodData.items.includes(f.id)) : [];

  const handleOrderAll = () => {
    suggestedItems.forEach(item => addToCart(item));
    toast.success("Mood items added! 🛒");
  };

  return (
    <section className="px-4 pt-4">
      <div className="rounded-2xl bg-card border border-border p-5 shadow-sm">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                😊 "How are you feeling right now?"
              </h3>
              <div className="mt-4 flex justify-between gap-1 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                {MOODS.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => handleMoodSelect(m.key)}
                    className="flex flex-col items-center gap-1 shrink-0"
                  >
                    <span className="text-2xl hover:scale-125 transition-transform">{m.emoji}</span>
                    <span className="text-[10px] font-bold text-muted-foreground">{m.label}</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[11px] font-bold text-primary">"Let AI pick food for your mood →"</p>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{moodInfo?.emoji}</span>
                  <div>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase">Your Mood</h3>
                    <p className="text-lg font-black text-foreground">{moodInfo?.label}</p>
                  </div>
                </div>
                <button 
                   onClick={() => setShowResult(false)}
                   className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full"
                >
                  🔄 Change
                </button>
              </div>

              <div className="rounded-2xl border-l-4 border-primary bg-background p-3 shadow-inner">
                <h4 className="text-[11px] font-black text-primary uppercase">Based on your mood 😊</h4>
                <div className="mt-3 space-y-2">
                  {suggestedItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-2">
                      <span className="text-xl">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-foreground truncate">{item.name}</div>
                        <div className="text-[10px] font-black text-primary">₹{item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[13px] italic text-muted-foreground leading-relaxed">
                  "{currentMoodData?.note}"
                </p>
              </div>

              <div className="flex items-center justify-between">
                 <label className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                   <input 
                     type="checkbox" 
                     checked={rememberMood} 
                     onChange={(e) => setRememberMood(e.target.checked)}
                     className="accent-primary" 
                   />
                   Remember my preference
                 </label>
                 <button
                   onClick={handleOrderAll}
                   className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20"
                 >
                   {selectedMood === 'party' ? 'Add All 3 to Cart 🛒' : 'Order This! 🛒'}
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
