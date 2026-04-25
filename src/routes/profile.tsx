import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  MapPin,
  Bell,
  Moon,
  Phone,
  Star,
  Info,
  ChevronRight,
  Pencil,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { darkMode, toggleDarkMode, favorites, orderHistory } = useCart();
  const [notif, setNotif] = useState(true);
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background pb-[80px]">
      <header className="px-4 pt-4 pb-2">
        <h1 className="text-[22px] font-extrabold text-foreground">Profile 👤</h1>
      </header>

      {/* User card */}
      <section className="px-4 pt-2">
        <div
          className="flex items-center gap-3 rounded-2xl bg-card p-4"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-base font-extrabold text-primary-foreground">
            RM
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-base font-extrabold text-foreground">Rahul Mishra</div>
            <div className="text-xs text-muted-foreground">+91 98765 XXXXX</div>
          </div>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-muted-foreground">
            <Pencil size={14} />
          </button>
        </div>
      </section>

      {/* Stats row */}
      <section className="mt-3 grid grid-cols-3 gap-2 px-4">
        <Stat icon="🛒" label="Orders" value={String(orderHistory.length + 3)} />
        <Stat icon="❤️" label="Saved" value={String(favorites.length)} />
        <Stat icon="⭐" label="Avg Rating" value="4.8" />
      </section>

      {/* Menu list */}
      <section className="mt-3 px-4">
        <div
          className="overflow-hidden rounded-2xl bg-card"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <Row
            icon={<MapPin size={16} className="text-primary" />}
            title="My Address"
            sub="Table No. 4 · Dine-In"
          />
          <Divider />
          <Row
            icon={<Bell size={16} className="text-warning" />}
            title="Notifications"
            right={<Toggle on={notif} onChange={() => setNotif((v) => !v)} />}
          />
          <Divider />
          <Row
            icon={<Moon size={16} className="text-secondary" />}
            title="Dark Mode"
            right={<Toggle on={darkMode} onChange={toggleDarkMode} />}
          />
          <Divider />
          <Row
            icon={<Phone size={16} className="text-success" />}
            title="Support"
            sub="Call us: +91 99999 00000"
          />
          <Divider />
          <Row
            icon={<Star size={16} className="text-warning" />}
            title="Rate the App"
            chevron
          />
          <Divider />
          <Row
            icon={<Info size={16} className="text-primary" />}
            title="About FoodAR"
            chevron
            onClick={() => setShowAbout((v) => !v)}
          />
          {showAbout && (
            <div className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              <div className="font-bold text-foreground">FoodAR v1.0.0</div>
              Built with ❤️ in India
              <br />© 2026 FoodAR Inc.
            </div>
          )}
        </div>
      </section>

      <p className="mt-4 px-4 text-center text-[11px] text-muted-foreground">
        Made for hungry foodies 🍴
      </p>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div
      className="rounded-2xl bg-card p-3 text-center"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="text-xl">{icon}</div>
      <div className="mt-1 text-base font-extrabold text-foreground">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

function Row({
  icon,
  title,
  sub,
  right,
  chevron,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  sub?: string;
  right?: React.ReactNode;
  chevron?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3 text-left"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-background">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold text-foreground">{title}</div>
        {sub && <div className="text-[11px] text-muted-foreground">{sub}</div>}
      </div>
      {right}
      {chevron && <ChevronRight size={16} className="text-muted-foreground" />}
    </button>
  );
}

function Divider() {
  return <div className="mx-4 h-px bg-border" />;
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={
        "relative h-6 w-11 rounded-full transition-colors " +
        (on ? "bg-primary" : "bg-border")
      }
      aria-pressed={on}
    >
      <span
        className={
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform " +
          (on ? "translate-x-[22px]" : "translate-x-0.5")
        }
      />
    </button>
  );
}
