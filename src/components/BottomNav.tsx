import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, Heart, ScrollText, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const TABS = [
  { to: "/home" as const, label: "Home", Icon: Home },
  { to: "/search" as const, label: "Search", Icon: Search },
  { to: "/saved" as const, label: "Saved", Icon: Heart },
  { to: "/orders" as const, label: "Orders", Icon: ScrollText },
  { to: "/profile" as const, label: "Profile", Icon: User },
];

const HIDDEN_PREFIXES = ["/", "/food/", "/payment", "/cart", "/ar", "/order-success"];

export function BottomNav() {
  const { pathname } = useLocation();
  const { orderStatus, favorites } = useCart();

  // hide on splash, food detail, payment, cart, ar, order-success
  const hide =
    pathname === "/" ||
    pathname.startsWith("/food/") ||
    pathname === "/payment" ||
    pathname === "/cart" ||
    pathname === "/ar" ||
    pathname === "/order-success";

  if (hide) return null;
  void HIDDEN_PREFIXES;

  const activeOrder = orderStatus === "placed" || orderStatus === "preparing";

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-card"
      style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
    >
      <div className="flex h-[60px] items-stretch">
        {TABS.map(({ to, label, Icon }) => {
          const isActive =
            to === "/home" ? pathname === "/home" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className="relative flex flex-1 flex-col items-center justify-center gap-0.5"
            >
              <div className="relative">
                <Icon
                  size={20}
                  className={isActive ? "text-primary" : "text-muted-foreground"}
                  fill={to === "/saved" && favorites.length > 0 && isActive ? "currentColor" : "none"}
                />
                {to === "/orders" && activeOrder && (
                  <span className="absolute -top-1 -right-1.5 h-2 w-2 rounded-full bg-primary" />
                )}
                {to === "/saved" && favorites.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                    {favorites.length}
                  </span>
                )}
              </div>
              <span
                className={
                  "text-[10px] font-semibold " +
                  (isActive ? "text-primary" : "text-muted-foreground")
                }
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
