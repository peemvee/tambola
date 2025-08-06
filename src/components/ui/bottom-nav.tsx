import { Trophy, Gift, Settings, Home } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Trophy, label: "Leaderboard", path: "/leaderboard" },
  { icon: Gift, label: "Rewards", path: "/rewards" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-lg border-t border-white/20"
    >
      <div className="flex items-center justify-around py-4 px-6 max-w-md mx-auto">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-white/60 hover:text-white/80"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <item.icon className={`w-6 h-6 ${isActive ? "animate-bounce-gentle" : ""}`} />
              <span className="text-xs">{item.label}</span>
              {isActive && (
                <motion.div
                  className="w-1 h-1 bg-primary rounded-full"
                  layoutId="activeIndicator"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};