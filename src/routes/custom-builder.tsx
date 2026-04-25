import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, X, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import type { Food } from "@/lib/foodar-data";

export const Route = createFileRoute("/custom-builder")({
  component: CustomBuilder,
});

const STEPS = ["Base", "Add", "Skip", "Taste", "Note", "Done"];

const BASES = [
  { name: "Burger", emoji: "🍔", price: 120 },
  { name: "Wrap", emoji: "🌯", price: 90 },
  { name: "Pizza", emoji: "🍕", price: 200 },
  { name: "Pasta", emoji: "🍝", price: 180 },
  { name: "Bowl", emoji: "🍱", price: 150 },
  { name: "Sandwich", emoji: "🥪", price: 100 },
];

const INGREDIENTS = {
  Proteins: [
    { name: "Chicken", emoji: "🍗", premium: true },
    { name: "Mutton", emoji: "🥩", premium: true },
    { name: "Egg", emoji: "🥚", premium: false },
    { name: "Paneer", emoji: "🫘", premium: true },
    { name: "Tuna", emoji: "🐟", premium: true },
    { name: "Rajma", emoji: "🫘", premium: false },
  ],
  Veggies: [
    { name: "Onion", emoji: "🧅" },
    { name: "Tomato", emoji: "🍅" },
    { name: "Lettuce", emoji: "🥬" },
    { name: "Corn", emoji: "🌽" },
    { name: "Capsicum", emoji: "🫑" },
    { name: "Avocado", emoji: "🥑", premium: true },
    { name: "Broccoli", emoji: "🥦" },
    { name: "Mushroom", emoji: "🍄" },
  ],
  Sauces: [
    { name: "Mayo", emoji: "🫙" },
    { name: "Hot Sauce", emoji: "🌶️" },
    { name: "Garlic Sauce", emoji: "🧄" },
    { name: "Honey Mustard", emoji: "🍯" },
    { name: "Olive Oil", emoji: "🫒" },
  ],
  Extras: [
    { name: "Cheese", emoji: "🧀", premium: true },
    { name: "Bacon bits", emoji: "🥓", premium: true },
    { name: "Pickles", emoji: "🫙" },
    { name: "Fresh Herbs", emoji: "🌿" },
    { name: "Peanuts", emoji: "🥜" },
  ],
};

const COMMON_EXCLUSIONS = ["No Onion", "No Garlic", "No Dairy", "No Gluten", "No Nuts", "No Spice"];

function CustomBuilder() {
  const navigate = useNavigate();
  const { addToCart, saveCustomFavorite } = useCart();
  
  const [step, setStep] = useState(1);
  const [base, setBase] = useState<typeof BASES[0] | null>(null);
  const [added, setAdded] = useState<string[]>([]);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [spice, setSpice] = useState("Medium");
  const [taste, setTaste] = useState("Balanced");
  const [portion, setPortion] = useState("Regular");
  const [freeNote, setFreeNote] = useState("");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Price Calculation
  const priceData = useMemo(() => {
    if (!base) return { base: 0, extras: 0, total: 0 };
    let extras = 0;
    
    // Premium Proteins/Extras
    added.forEach(itemName => {
      const all = Object.values(INGREDIENTS).flat();
      const item = all.find(i => i.name === itemName);
      if (item) {
        if (Object.keys(INGREDIENTS.Proteins).some(k => INGREDIENTS.Proteins[Number(k)]?.name === itemName)) {
           extras += 20; // Protein
        } else if (item.premium) {
           extras += 15; // Premium extra
        }
      }
    });

    if (portion === "Large") extras += 30;
    if (portion === "Small") extras -= 20;

    return {
      base: base.price,
      extras: Math.max(0, extras),
      total: base.price + Math.max(0, extras)
    };
  }, [base, added, portion]);

  // AI Generation Logic
  const generatedMeal = useMemo(() => {
    if (!base) return null;
    
    // Name Logic
    let adj = taste;
    if (spice === "Spicy" || spice === "Extra Hot") adj = "Fiery";
    else if (taste === "Creamy") adj = "Loaded";
    else if (taste === "Tangy") adj = "Zesty";
    else if (taste === "Bold & Smoky") adj = "Smoky";
    
    const mainProtein = added.find(a => INGREDIENTS.Proteins.some(p => p.name === a)) || "Veggie";
    const name = `${adj} ${mainProtein} ${base.name}`;
    
    // Chef's Note Logic
    let chefNote = "";
    if (spice === "Extra Hot" && taste === "Bold & Smoky") {
      chefNote = "Bilkul aag wala banega! 🔥 Aapka custom meal extra spicy aur smoky flavors ke saath prepare kiya jayega.";
    } else if (spice === "Mild" && taste === "Creamy") {
      chefNote = "Smooth aur creamy, perfect comfort food! 😌 Halka masaledar aur bohat saara swad.";
    } else if (taste === "Fresh") {
      chefNote = "Light aur nutritious — guilt-free khao! 🥗 Fresh ingredients aur healthy balance.";
    } else {
      chefNote = `Aapka ${base.name.toLowerCase()} bilkul aapki pasand ka banaya jayega, ${taste.toLowerCase()} flavors aur ${spice.toLowerCase()} spice level ke saath! 👨‍🍳`;
    }

    return {
      name,
      emoji: base.emoji,
      price: priceData.total,
      chefNote,
      time: "10 min"
    };
  }, [base, added, spice, taste, priceData]);

  const toggleAdd = (name: string) => {
    if (excluded.includes(name)) setExcluded(prev => prev.filter(n => n !== name));
    setAdded(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const toggleExclude = (name: string) => {
    if (added.includes(name)) setAdded(prev => prev.filter(n => n !== name));
    setExcluded(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowResult(true);
      setStep(6);
    }, 1500);
  };

  const handleAddToCart = () => {
    if (!generatedMeal) return;
    const customFood: Food = {
      id: Date.now(), // Generate a temp ID
      name: generatedMeal.name,
      emoji: generatedMeal.emoji,
      price: generatedMeal.price,
      cat: "Custom",
      rating: 5.0,
      reviews: 1,
      time: generatedMeal.time,
      desc: freeNote || "Custom crafted by you with AI assistance.",
      calories: 450,
      protein: "20g",
      carbs: "40g",
      isCustom: true,
      customNote: `${spice} Spice, ${taste} Taste. Includes: ${added.join(", ") || 'None'}. Excludes: ${excluded.join(", ") || 'None'}.`
    };
    addToCart(customFood);
    toast.success("Custom meal added! 🎉");
    navigate({ to: "/cart" });
  };

  const handleSave = () => {
    if (!generatedMeal) return;
    const customFood: Food = {
      id: Date.now(),
      name: generatedMeal.name,
      emoji: generatedMeal.emoji,
      price: generatedMeal.price,
      cat: "Custom",
      rating: 5.0,
      reviews: 1,
      time: generatedMeal.time,
      desc: freeNote || "Your signature recipe.",
      calories: 450,
      protein: "20g",
      carbs: "40g",
      isCustom: true,
      customNote: `${spice} Spice, ${taste} Taste.`
    };
    saveCustomFavorite(customFood);
    toast.success("Recipe saved to favorites! ❤️");
  };

  const nextStep = () => setStep(prev => Math.min(6, prev + 1));
  const prevStep = () => {
    if (showResult) {
      setShowResult(false);
      setStep(5);
    } else {
      setStep(prev => Math.max(1, prev - 1));
    }
  };

  if (isGenerating) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <div className="relative">
          <div className="text-[80px] animate-bounce">🧑‍🍳</div>
          <Loader2 className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-primary animate-spin" size={32} />
        </div>
        <h2 className="mt-8 text-xl font-bold text-foreground text-center">AI is crafting your meal...</h2>
        <p className="mt-2 text-sm text-muted-foreground animate-pulse">Mixing flavors, balancing spices...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-[100px]">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background px-4 pt-4 pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => step === 1 ? navigate({ to: "/home" }) : prevStep()} className="rounded-full bg-muted p-2">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-extrabold text-foreground">
            {showResult ? "Your AI Meal ✨" : "Build Your Meal 🧑‍🍳"}
          </h1>
        </div>
        {!showResult && (
           <Link to="/home" className="rounded-full bg-muted p-2">
             <X size={20} />
           </Link>
        )}
      </header>

      {/* Progress Bar */}
      {!showResult && (
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-1">
                <div className={`h-2.5 w-2.5 rounded-full transition-colors ${step > i + 1 ? 'bg-success' : step === i + 1 ? 'bg-primary' : 'bg-muted'}`} />
                <span className={`text-[10px] font-bold ${step === i + 1 ? 'text-primary' : 'text-muted-foreground'}`}>{s}</span>
              </div>
            ))}
          </div>
          <div className="relative mt-[-18px] px-2">
            <div className="h-[2px] w-full bg-muted" />
            <div 
              className="absolute top-0 left-2 h-[2px] bg-primary transition-all duration-300" 
              style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      )}

      <main className="flex-1 px-4 py-2">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-[16px] font-bold text-foreground">What do you want as base?</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {BASES.map(b => (
                <button
                  key={b.name}
                  onClick={() => { setBase(b); nextStep(); }}
                  className={`flex flex-col items-center gap-2 rounded-2xl p-4 border-2 transition ${base?.name === b.name ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}
                >
                  <span className="text-3xl">{b.emoji}</span>
                  <span className={`text-sm font-bold ${base?.name === b.name ? 'text-primary' : 'text-foreground'}`}>{b.name}</span>
                  <span className="text-[10px] text-muted-foreground">Base: ₹{b.price}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-[16px] font-bold text-foreground">What do you want IN it? ✅</h2>
            {Object.entries(INGREDIENTS).map(([cat, items]) => (
              <div key={cat} className="mt-5">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{cat}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {items.map(i => (
                    <button
                      key={i.name}
                      onClick={() => toggleAdd(i.name)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition ${added.includes(i.name) ? 'bg-success text-white border-success' : 'bg-card text-foreground border-border'}`}
                    >
                      <span>{i.emoji}</span>
                      <span>{i.name}</span>
                      {i.premium && <span className="text-[10px] opacity-80">+₹{cat === 'Proteins' ? 20 : 15}</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-foreground">What do you NOT want? ❌</h2>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Allergies? Dislikes? Tell us!</p>
            
            <div className="mt-4 flex flex-wrap gap-2">
               {COMMON_EXCLUSIONS.map(e => (
                 <button
                   key={e}
                   onClick={() => toggleExclude(e)}
                   className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition ${excluded.includes(e) ? 'bg-destructive text-white border-destructive' : 'bg-card text-foreground border-border'}`}
                 >
                   <span>{e}</span>
                 </button>
               ))}
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase">Specific Ingredients</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.values(INGREDIENTS).flat().map(i => (
                  <button
                    key={i.name}
                    onClick={() => toggleExclude(i.name)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition ${excluded.includes(i.name) ? 'bg-destructive text-white border-destructive' : 'bg-card text-foreground border-border'}`}
                  >
                    <span>{i.emoji}</span>
                    <span>{i.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
            <div>
              <h2 className="text-[16px] font-bold text-foreground">How spicy? 🌶️</h2>
              <div className="mt-4 px-2">
                <input 
                  type="range" min="0" max="3" step="1" 
                  value={["Mild", "Medium", "Spicy", "Extra Hot"].indexOf(spice)}
                  onChange={(e) => setSpice(["Mild", "Medium", "Spicy", "Extra Hot"][parseInt(e.target.value)])}
                  className="w-full accent-primary"
                />
                <div className="mt-2 flex justify-between text-[10px] font-bold text-muted-foreground">
                  <span>Mild</span>
                  <span>Medium</span>
                  <span>Spicy</span>
                  <span>Extra Hot</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-[16px] font-bold text-foreground">Taste preference?</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Balanced", "Tangy", "Creamy", "Fresh", "Bold & Smoky"].map(t => (
                  <button
                    key={t}
                    onClick={() => setTaste(t)}
                    className={`rounded-full px-4 py-2 text-xs font-bold border transition ${taste === t ? 'bg-primary text-white border-primary' : 'bg-card text-foreground border-border'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-[16px] font-bold text-foreground">Portion size?</h2>
              <div className="mt-3 flex gap-3">
                {["Small", "Regular", "Large"].map(p => (
                  <button
                    key={p}
                    onClick={() => setPortion(p)}
                    className={`flex-1 rounded-2xl py-3 text-xs font-bold border transition ${portion === p ? 'bg-primary text-white border-primary' : 'bg-card text-foreground border-border'}`}
                  >
                    {p === "Small" ? "🤏 " : p === "Regular" ? "👌 " : "💪 "}{p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-[16px] font-bold text-foreground">Kuch aur bolna hai? 💬</h2>
            <div className="mt-4 relative">
              <textarea
                value={freeNote}
                onChange={(e) => setFreeNote(e.target.value.slice(0, 200))}
                placeholder="e.g. Thoda crispy banana, zyada sauce daalna, cheese double karna, bilkul oil nahi chahiye..."
                className="w-full resize-none rounded-2xl border-2 border-border bg-card p-4 text-sm text-foreground outline-none focus:border-primary"
                rows={4}
              />
              <div className="absolute bottom-3 right-4 text-[10px] font-bold text-muted-foreground">{freeNote.length}/200</div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
               {[
                 {l: "Extra Crispy 🔥", v: "Make it extra crispy please!"},
                 {l: "Double Cheese 🧀", v: "Double cheese layering."},
                 {l: "Less Oil 🫙", v: "Use minimal oil."},
                 {l: "Extra Saucy 💦", v: "Load it with extra sauce."},
                 {l: "Well Done 👨‍🍳", v: "Cook it well done."},
                 {l: "Light & Healthy 🥗", v: "Keep it light and healthy."}
               ].map(q => (
                 <button
                   key={q.l}
                   onClick={() => setFreeNote(prev => (prev + " " + q.v).trim().slice(0, 200))}
                   className="rounded-xl border border-border bg-background px-3 py-2 text-[11px] font-semibold text-muted-foreground active:bg-muted"
                 >
                   {q.l}
                 </button>
               ))}
            </div>
          </div>
        )}

        {step === 6 && showResult && generatedMeal && (
          <div className="animate-in zoom-in-95 duration-300">
            <div className="rounded-3xl bg-card p-5 border-l-4 border-primary shadow-xl">
               <div className="flex items-center gap-2 text-xs font-bold text-primary">
                 <span>🤖</span> AI Created Your Custom Meal!
               </div>
               
               <div className="mt-4 flex items-center gap-4">
                 <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-4xl shadow-inner">
                   {generatedMeal.emoji}
                 </div>
                 <div>
                   <h2 className="text-xl font-black text-foreground">"{generatedMeal.name}"</h2>
                   <div className="mt-1 flex items-center gap-3">
                     <span className="text-sm font-bold text-primary">₹{generatedMeal.price}</span>
                     <span className="text-[11px] text-muted-foreground">⏱ ~{generatedMeal.time}</span>
                   </div>
                 </div>
               </div>

               <div className="mt-6 space-y-4">
                 {added.length > 0 && (
                   <div>
                     <div className="text-[11px] font-black text-foreground uppercase tracking-widest flex items-center gap-1">
                       <Check size={12} className="text-success" /> Includes
                     </div>
                     <div className="mt-1.5 flex flex-wrap gap-1.5">
                       {added.map(a => (
                         <span key={a} className="rounded-lg bg-muted px-2 py-1 text-[11px] font-bold text-foreground">
                           {INGREDIENTS.Proteins.find(p => p.name === a)?.emoji || 
                            INGREDIENTS.Veggies.find(v => v.name === a)?.emoji || 
                            INGREDIENTS.Sauces.find(s => s.name === a)?.emoji || 
                            INGREDIENTS.Extras.find(e => e.name === a)?.emoji || "✅"} {a}
                         </span>
                       ))}
                     </div>
                   </div>
                 )}

                 {excluded.length > 0 && (
                   <div>
                     <div className="text-[11px] font-black text-foreground uppercase tracking-widest flex items-center gap-1">
                       <X size={12} className="text-destructive" /> Excluded
                     </div>
                     <div className="mt-1.5 flex flex-wrap gap-1.5">
                       {excluded.map(e => (
                         <span key={e} className="rounded-lg bg-destructive/5 border border-destructive/10 px-2 py-1 text-[11px] font-bold text-destructive">
                           {e}
                         </span>
                       ))}
                     </div>
                   </div>
                 )}

                 <div className="flex gap-4 border-t border-border pt-4">
                   <div className="flex-1">
                     <div className="text-[10px] font-bold text-muted-foreground uppercase">Spice</div>
                     <div className="text-xs font-black text-foreground">{spice} 🌶️</div>
                   </div>
                   <div className="flex-1">
                     <div className="text-[10px] font-bold text-muted-foreground uppercase">Taste</div>
                     <div className="text-xs font-black text-foreground">{taste}</div>
                   </div>
                   <div className="flex-1">
                     <div className="text-[10px] font-bold text-muted-foreground uppercase">Portion</div>
                     <div className="text-xs font-black text-foreground">{portion}</div>
                   </div>
                 </div>

                 <div className="rounded-2xl bg-primary/5 p-3">
                   <div className="text-[11px] font-black text-primary uppercase flex items-center gap-1">
                     👨‍🍳 Chef's Note
                   </div>
                   <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-foreground italic">
                     "{generatedMeal.chefNote}"
                   </p>
                 </div>

                 <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                   <span>Base: ₹{priceData.base}</span>
                   <span>Extras: ₹{priceData.extras}</span>
                 </div>
               </div>
            </div>

            <button
              onClick={handleSave}
              className="mt-6 flex w-full items-center justify-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition"
            >
              ❤️ Save this recipe
            </button>
          </div>
        )}
      </main>

      {/* Footer Navigation */}
      <div className="fixed bottom-24 left-1/2 z-30 w-full max-w-[400px] -translate-x-1/2 p-4">
        {showResult ? (
          <div className="flex gap-3">
            <button
              onClick={() => { setShowResult(false); setStep(1); }}
              className="flex-1 rounded-xl bg-muted py-3.5 text-sm font-bold text-muted-foreground"
            >
              ✏️ Modify
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-[2] rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20"
            >
              🛒 Add to Cart
            </button>
          </div>
        ) : (
          <button
            onClick={() => step === 5 ? handleGenerate() : nextStep()}
            disabled={step === 1 && !base}
            className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-50 disabled:grayscale transition-all"
          >
            {step === 5 ? "🤖 Let AI Build My Meal →" : "Continue →"}
          </button>
        )}
      </div>
    </div>
  );
}
