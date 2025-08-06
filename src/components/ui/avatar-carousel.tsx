import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const avatars = [
  { id: "boy1", name: "Alex", emoji: "👦", color: "bg-blue-500" },
  { id: "girl1", name: "Emma", emoji: "👧", color: "bg-pink-500" },
  { id: "robot", name: "Robo", emoji: "🤖", color: "bg-gray-500" },
  { id: "cat", name: "Kitty", emoji: "🐱", color: "bg-orange-500" },
  { id: "dog", name: "Buddy", emoji: "🐶", color: "bg-yellow-500" },
  { id: "unicorn", name: "Magic", emoji: "🦄", color: "bg-purple-500" },
  { id: "lion", name: "Leo", emoji: "🦁", color: "bg-amber-500" },
  { id: "panda", name: "Bamboo", emoji: "🐼", color: "bg-green-500" },
];

export const AvatarCarousel = ({ onSelect }: { onSelect?: (avatar: typeof avatars[0]) => void }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : avatars.length - 4));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < avatars.length - 4 ? prev + 1 : 0));
  };

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    onSelect?.(avatars[index]);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex-1 overflow-hidden mx-6 py-4">
          <motion.div
            className="flex gap-6 px-4"
            animate={{ x: -currentIndex * 88 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {avatars.map((avatar, index) => (
              <motion.div
                key={avatar.id}
                className={`flex-shrink-0 w-16 h-16 rounded-full cursor-pointer flex items-center justify-center text-2xl ${
                  selectedIndex === index
                    ? "ring-4 ring-yellow-400 bg-white/20 shadow-lg"
                    : "bg-white/10 hover:bg-white/20"
                } transition-all duration-200`}
                onClick={() => handleSelect(index)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={
                  selectedIndex === index
                    ? {
                        y: [0, -8, 0],
                      }
                    : {}
                }
                transition={{
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                {avatar.emoji}
              </motion.div>
            ))}
          </motion.div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-center mt-4">
        <p className="text-white/80">
          {avatars[selectedIndex].name}
        </p>
      </div>
    </div>
  );
};