import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";

export const Route = createFileRoute("/")({
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  const { splashShown, markSplashShown } = useCart();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (splashShown) {
      navigate({ to: "/home", replace: true });
      return;
    }
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / 2000) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        markSplashShown();
        navigate({ to: "/home", replace: true });
      }
    }, 30);
    return () => clearInterval(interval);
  }, [navigate, splashShown, markSplashShown]);

  if (splashShown) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-card px-6">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="relative flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-primary-light text-[56px] shadow-card">
            🍽️
          </div>
        </div>
        <h1 className="mt-6 text-[28px] font-extrabold tracking-tight text-foreground">
          Food<span className="text-primary">AR</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Order Smart. See in AR.</p>
      </motion.div>

      <div className="absolute bottom-20 w-56">
        <div className="h-1 w-full overflow-hidden rounded-full bg-primary-light">
          <div
            className="h-full bg-primary transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
