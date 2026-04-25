import { useEffect, useState } from "react";

const BANNERS = [
  {
    bg: "linear-gradient(135deg, oklch(0.7 0.18 40), oklch(0.65 0.2 30))",
    title: "🔥 50% OFF first order",
    sub: "Use code: FOOD50",
  },
  {
    bg: "linear-gradient(135deg, oklch(0.72 0.13 215), oklch(0.62 0.13 230))",
    title: "🚀 Priority Serving",
    sub: "On orders above ₹200",
  },
  {
    bg: "linear-gradient(135deg, oklch(0.55 0.2 290), oklch(0.5 0.2 310))",
    title: "⭐ View food in AR",
    sub: "Before you order — new!",
  },
];

export function OfferBanners() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % BANNERS.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="px-4 pt-3">
      <div className="relative h-[80px] overflow-hidden rounded-[14px]">
        {BANNERS.map((b, i) => (
          <div
            key={i}
            className="absolute inset-0 flex flex-col justify-center px-4 text-white transition-opacity duration-500"
            style={{
              background: b.bg,
              opacity: i === idx ? 1 : 0,
            }}
          >
            <div className="text-[15px] font-extrabold leading-tight">{b.title}</div>
            <div className="mt-0.5 text-[12px] opacity-95">{b.sub}</div>
          </div>
        ))}
      </div>
      {/* dots */}
      <div className="mt-2 flex justify-center gap-1.5">
        {BANNERS.map((_, i) => (
          <span
            key={i}
            className={
              "h-1.5 rounded-full transition-all " +
              (i === idx ? "w-4 bg-primary" : "w-1.5 bg-border")
            }
          />
        ))}
      </div>
    </div>
  );
}
