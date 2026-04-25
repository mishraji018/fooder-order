import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { foods } from "@/lib/foodar-data";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const { orderStatus, orderedItems, orderHistory, addToCart } = useCart();
  const navigate = useNavigate();

  const activeOrderTotal = orderedItems.reduce(
    (s, c) => s + c.item.price * c.quantity,
    0
  );

  const handleReorder = (foodIds: number[]) => {
    foodIds.forEach((id) => {
      const f = foods.find((x) => x.id === id);
      if (f) addToCart(f, 1);
    });
    toast.success("Items added to cart! 🛒");
    navigate({ to: "/cart" });
  };

  const noActive = orderStatus === "idle";
  const noHistory = orderHistory.length === 0;

  if (noActive && noHistory) {
    return (
      <div className="flex min-h-screen flex-col bg-background pb-[80px]">
        <header className="px-4 pt-4 pb-2">
          <h1 className="text-[22px] font-extrabold text-foreground">My Orders 🧾</h1>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6">
          <div className="text-7xl">🧾</div>
          <div className="text-base font-bold text-foreground">No orders yet</div>
          <Link
            to="/home"
            className="mt-3 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
          >
            Start Ordering
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-[120px]">
      <header className="px-4 pt-6 pb-2 flex items-center justify-between">
        <button onClick={() => navigate({ to: "/home" })} className="flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border shadow-sm">
           <span className="text-lg">⟨</span>
        </button>
        <h1 className="text-[18px] font-black text-foreground">Orders</h1>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border shadow-sm">
           <span className="text-lg">⋮</span>
        </button>
      </header>

      <div className="space-y-6 px-4 pt-4">
        {!noActive && orderedItems.length > 0 && (
          <div className="overflow-hidden rounded-[32px] bg-mint shadow-xl">
             <div className="p-6">
                <div className="flex items-center justify-between">
                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl">
                      🍔
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-[13px] font-bold text-[#1A1A1A]/80">Active Order</span>
                      <span className="text-[16px] font-black text-[#1A1A1A]">₹{activeOrderTotal}</span>
                   </div>
                </div>
                
                <div className="mt-6 flex flex-col items-center">
                   <div className="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400" 
                        alt="Order" 
                        className="w-48 h-48 object-contain drop-shadow-2xl"
                      />
                      <div className="absolute top-0 left-0 -rotate-12 rounded bg-white px-2 py-1 text-[10px] font-black uppercase text-foreground shadow-sm">
                         40% OFF
                      </div>
                   </div>
                   <h2 className="mt-4 text-xl font-black text-[#1A1A1A]">Current Meal</h2>
                </div>
             </div>
             
          </div>
        )}

        {orderHistory.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-base font-black text-foreground">Order History</h3>
            {orderHistory.map((o, idx) => {
              const colors = ["bg-sky", "bg-beige", "bg-mint"];
              const color = colors[idx % colors.length];
              
              return (
                <div key={o.id} className={`overflow-hidden rounded-[32px] ${color} shadow-lg`}>
                   <div className="p-5">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-base">
                               {o.items[0]?.emoji || "📦"}
                            </span>
                            <span className="text-sm font-black text-[#1A1A1A] truncate max-w-[120px]">{o.items[0]?.name}</span>
                         </div>
                         <span className="text-sm font-black text-[#1A1A1A]">₹{o.total}</span>
                      </div>
                   </div>
                   
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
