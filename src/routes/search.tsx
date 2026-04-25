import { createFileRoute } from "@tanstack/react-router";
import { Search as SearchIcon, X } from "lucide-react";
import { foods } from "@/lib/foodar-data";
import { useCart } from "@/contexts/CartContext";
import { FoodCard } from "@/components/FoodCard";

export const Route = createFileRoute("/search")({
  component: SearchPage,
});

const POPULAR = [
  { label: "Burger 🍔", q: "burger" },
  { label: "Pizza 🍕", q: "pizza" },
  { label: "Wings 🍗", q: "wings" },
  { label: "Veg 🥦", q: "veg" },
  { label: "Coffee ☕", q: "coffee" },
];

function SearchPage() {
  const { searchQuery, setSearchQuery } = useCart();
  const q = searchQuery.trim().toLowerCase();

  const results = q
    ? foods.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.cat.toLowerCase().includes(q) ||
          f.desc.toLowerCase().includes(q)
      )
    : [];

  return (
    <div className="flex min-h-screen flex-col bg-background pb-[80px]">
      <header className="px-4 pt-4 pb-2">
        <h1 className="text-[22px] font-extrabold text-foreground">Search</h1>
        <div className="mt-3 flex items-center gap-2 rounded-xl border-[1.5px] border-border bg-card px-3 py-2.5">
          <SearchIcon size={16} className="text-muted-foreground" />
          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} aria-label="Clear">
              <X size={14} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 px-4 pt-3">
        {!q ? (
          <>
            <div className="text-[13px] font-bold text-foreground">Popular Searches</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {POPULAR.map((p) => (
                <button
                  key={p.q}
                  onClick={() => setSearchQuery(p.q)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <div className="text-6xl">😕</div>
            <div className="text-sm font-bold text-foreground">No food found</div>
            <p className="text-xs text-muted-foreground">Try: Burger, Pizza, Wings</p>
          </div>
        ) : (
          <>
            <div className="text-xs text-muted-foreground">
              {results.length} result{results.length !== 1 ? "s" : ""} for "{searchQuery}"
            </div>
            <div className="mt-3 space-y-3">
              {results.map((f) => (
                <FoodCard key={f.id} food={f} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
