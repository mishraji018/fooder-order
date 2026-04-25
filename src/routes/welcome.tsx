import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { QrCode, Smartphone, Sparkles, Box, Users, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/welcome")({
  component: WelcomePage,
});

function WelcomePage() {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin)}`;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white overflow-hidden relative font-sans">
      {/* Animated Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen text-center">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 mb-6">
            <Sparkles size={16} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">The Future of Dining</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Food<span className="text-primary">AR</span> Premium <br/>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">Dine-In Experience</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Revolutionizing restaurants with AR visualization, AI-driven menus, and seamless table ordering.
          </p>
        </motion.div>

        {/* Main Interaction Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full mt-8">
          
          {/* Left: QR Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="relative group">
              {/* QR Glow Effect */}
              <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full group-hover:bg-primary/50 transition-all duration-500" />
              
              <div className="relative bg-white p-6 rounded-[40px] shadow-2xl transform transition-transform hover:scale-105 duration-500">
                <img 
                  src={qrUrl} 
                  alt="Scan QR" 
                  className="w-[200px] h-[200px] md:w-[280px] md:h-[280px]"
                />
                <div className="absolute -bottom-4 -right-4 bg-primary text-white p-4 rounded-2xl shadow-xl border-4 border-[#0D0D0D]">
                  <QrCode size={24} />
                </div>
              </div>
            </div>
            
            <div className="mt-10 flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 text-xl font-bold">
                <Smartphone className="text-primary animate-bounce" />
                <span>Scan with your Phone</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-[280px]">
                Open your camera and point it at the QR to start your premium journey.
              </p>
            </div>
          </motion.div>

          {/* Right: Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left"
          >
            <FeatureCard 
              icon={<Box size={24} className="text-primary" />}
              title="AR Visualization"
              desc="See your 3D dish right on your table before you order."
            />
            <FeatureCard 
              icon={<Users size={24} className="text-secondary" />}
              title="Group Ordering"
              desc="Real-time shared carts with effortless bill splitting."
            />
            <FeatureCard 
              icon={<Sparkles size={24} className="text-yellow-400" />}
              title="AI Chef"
              desc="Get personalized meal suggestions based on your taste."
            />
            <FeatureCard 
              icon={<Smartphone size={24} className="text-green-400" />}
              title="Table Ordering"
              desc="Fast, contactless ordering directly from your seat."
            />
          </motion.div>
        </div>

        {/* Footer Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 flex flex-col items-center gap-6"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <Link 
            to="/home" 
            className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <span className="text-sm font-bold uppercase tracking-widest">Continue on Web</span>
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
            Made by Mishra_ji
          </p>
        </motion.div>
      </div>

      {/* Decorative Floating Elements */}
      <FloatingEmoji emoji="🍕" top="15%" left="10%" delay={0} />
      <FloatingEmoji emoji="🍔" top="65%" left="5%" delay={2} />
      <FloatingEmoji emoji="🥤" top="20%" right="15%" delay={1} />
      <FloatingEmoji emoji="🥗" top="75%" right="10%" delay={3} />
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-extrabold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function FloatingEmoji({ emoji, top, left, right, delay }: any) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-20, 20, -20] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
      className="absolute text-4xl opacity-20 pointer-events-none select-none hidden md:block"
      style={{ top, left, right }}
    >
      {emoji}
    </motion.div>
  );
}
