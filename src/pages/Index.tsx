import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FloatingElements } from "@/components/ui/floating-elements";
import { AvatarCarousel } from "@/components/ui/avatar-carousel";
import { BottomNav } from "@/components/ui/bottom-nav";
import { UserCheck, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <FloatingElements />
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 pb-24">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            TambolaVerse
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-white/90"
          >
            Play Multiplayer Tambola with Friends!
          </motion.p>
        </motion.div>

        {/* Avatar Selection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-12 w-full px-8"
        >
          <h3 className="text-lg text-white/90 text-center mb-8">
            Choose Your Avatar
          </h3>
          <div className="py-6">
            <AvatarCarousel />
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="space-y-4 w-full max-w-sm"
        >
          <Button
            size="lg"
            onClick={() => navigate('/setup')}
            className="w-full bg-yellow-500 text-blue-900 hover:bg-yellow-400 font-semibold text-lg py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <UserCheck className="w-6 h-6 mr-3" />
            Play as Guest
          </Button>
          

        </motion.div>

        {/* Quick Stats or Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-8 flex justify-center gap-8 text-center"
        >
          <div className="text-white/70">
            <p className="text-2xl font-bold text-yellow-400">1000+</p>
            <p className="text-sm">Players</p>
          </div>
          <div className="text-white/70">
            <p className="text-2xl font-bold text-green-400">24/7</p>
            <p className="text-sm">Games</p>
          </div>
          <div className="text-white/70">
            <p className="text-2xl font-bold text-cyan-400">₹10K+</p>
            <p className="text-sm">Won Daily</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
