import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, Heart, ScrollText, User, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const TABS = [
  { to: "/home" as const, label: "Home", Icon: Home },
  { to: "/search" as const, label: "Search", Icon: Search },
  { to: "/orders" as const, label: "Orders", Icon: ScrollText },
  { to: "/profile" as const, label: "Profile", Icon: User },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const { cartCount } = useCart();

  const hide =
    pathname === "/" ||
    pathname.startsWith("/food/") ||
    pathname === "/payment" ||
    pathname === "/ar" ||
    pathname === "/cart" ||
    pathname === "/custom-builder" ||
    pathname === "/order-tracking" ||
    pathname === "/order-success";

  if (hide) return null;

  return (
    <div className="fixed bottom-10 left-1/2 z-50 w-[92%] max-w-[400px] -translate-x-1/2">
      <nav className="flex h-16 items-center justify-between rounded-full bg-[#121212] px-3 shadow-2xl backdrop-blur-md">
        {TABS.map(({ to, label, Icon }) => {
          const isActive = to === "/home" ? pathname === "/home" : pathname.startsWith(to);
          
          return (
            <Link
              key={to}
              to={to}
              className={`group relative flex h-12 items-center gap-2 rounded-full px-4 transition-all duration-300 ${isActive ? 'bg-white w-auto' : 'w-12 justify-center'}`}
            >
              <div className="relative">
                <Icon
                  size={isActive ? 18 : 20}
                  className={isActive ? "text-[#121212]" : "text-white/60 group-hover:text-white"}
                  strokeWidth={isActive ? 2.5 : 2}
                  fill="none"
                />
                {to === "/cart" && cartCount > 0 && !isActive && (
                   <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
              
              {isActive && (
                <span className="whitespace-nowrap text-xs font-black text-[#121212]">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
