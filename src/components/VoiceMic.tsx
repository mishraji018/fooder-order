import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useCart } from "@/contexts/CartContext";
import { foods } from "@/lib/foodar-data";

export function VoiceMic() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();
  const { addToCart, setSearchQuery } = useCart();

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-IN";

    recognitionRef.current.onresult = (event: any) => {
      const text = event.results[0][0].transcript.toLowerCase();
      setTranscript(text);
      processCommand(text);
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech error", event.error);
      setIsListening(false);
      if (event.error === "no-speech") {
        toast.error("Couldn't hear you 😕", { description: "Try again or check mic settings." });
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
  }, []);

  const processCommand = (text: string) => {
    // 1. Navigation Commands
    if (text.includes("show cart") || text.includes("go to cart")) {
      toast.success("Opening cart... 🛒");
      navigate({ to: "/cart" });
      return;
    }
    if (text.includes("my order") || text.includes("track order")) {
      toast.success("Opening order tracking... 📍");
      navigate({ to: "/order-tracking" });
      return;
    }
    if (text.includes("cancel") || text.includes("go back")) {
      window.history.back();
      return;
    }
    if (text.startsWith("search")) {
      const q = text.replace("search", "").trim();
      setSearchQuery(q);
      navigate({ to: "/home" });
      return;
    }

    // 2. Food Matching
    const match = foods.find(f => 
      text.includes(f.name.toLowerCase()) || 
      (f.name.toLowerCase().includes("margherita") && text.includes("pizza")) ||
      (f.name.toLowerCase().includes("wings") && text.includes("wings")) ||
      (f.name.toLowerCase().includes("wrap") && text.includes("wrap")) ||
      (f.name.toLowerCase().includes("coffee") && text.includes("coffee")) ||
      (f.name.toLowerCase().includes("pasta") && text.includes("pasta"))
    );

    if (match) {
      addToCart(match);
      toast.success(`Heard: "${text}"`, { description: `${match.name} added to cart! ✅` });
    } else {
      toast.error(`Heard: "${text}"`, { description: "Hmm, we didn't catch that food item. 😅" });
    }
  };

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!isSupported) {
    return (
      <button disabled className="flex h-10 w-10 items-center justify-center rounded-full bg-muted opacity-50" title="Voice not supported on this browser">
        <MicOff size={18} className="text-muted-foreground" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={toggleMic}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${isListening ? 'bg-destructive shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-primary'}`}
      >
        <Mic size={18} className="text-primary-foreground" />
        {isListening && (
           <motion.div
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1.5, opacity: 0 }}
             transition={{ duration: 1, repeat: Infinity }}
             className="absolute inset-0 rounded-full bg-destructive"
           />
        )}
      </button>

      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed inset-x-0 top-[80px] z-50 flex flex-col items-center gap-3 px-4"
          >
            <div className="rounded-2xl bg-card p-4 shadow-xl border border-border flex flex-col items-center gap-3 min-w-[200px]">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 2, 1].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 20, 8] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1 rounded-full bg-primary"
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-foreground">Listening... 🎤</span>
              <p className="text-[10px] text-muted-foreground">Try: "Burger", "Pizza", "Show Cart"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
