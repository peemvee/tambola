import { motion } from "framer-motion";

const FloatingBall = ({ delay = 0, size = "w-8 h-8" }: { delay?: number; size?: string }) => (
  <motion.div
    className={`${size} bg-yellow-400 rounded-full opacity-20 absolute`}
    animate={{
      y: [-20, 20, -20],
      x: [-10, 10, -10],
    }}
    transition={{
      duration: 6,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    style={{
      left: `${Math.random() * 80 + 10}%`,
      top: `${Math.random() * 80 + 10}%`,
    }}
  />
);

const Sparkle = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="w-2 h-2 bg-cyan-400 rounded-full absolute"
    animate={{
      opacity: [0, 1, 0],
      scale: [0.5, 1, 0.5],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
  />
);

export const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating balls */}
      {[...Array(8)].map((_, i) => (
        <FloatingBall 
          key={`ball-${i}`} 
          delay={i * 0.8} 
          size={i % 2 === 0 ? "w-6 h-6" : "w-10 h-10"}
        />
      ))}
      
      {/* Sparkles */}
      {[...Array(12)].map((_, i) => (
        <Sparkle key={`sparkle-${i}`} delay={i * 0.5} />
      ))}
    </div>
  );
};