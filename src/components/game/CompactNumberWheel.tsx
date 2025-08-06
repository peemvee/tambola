import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface CompactNumberWheelProps {
  onNumberCalled: (number: number) => void;
  calledNumbers: number[];
  isGameActive: boolean;
  currentNumber: number | null;
}

const CompactNumberWheel = ({ onNumberCalled, calledNumbers, isGameActive, currentNumber }: CompactNumberWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);

  // Generate available numbers (1-90 that haven't been called)
  const availableNumbers = Array.from({length: 90}, (_, i) => i + 1)
    .filter(num => !calledNumbers.includes(num));

  const spinWheel = async () => {
    if (availableNumbers.length === 0 || isSpinning) return;

    setIsSpinning(true);
    
    // Multiple spin rotations for dramatic effect
    const baseRotations = 8; // At least 8 full rotations
    const extraRotation = Math.random() * 3; // Random additional 0-3 rotations
    const totalRotation = (baseRotations + extraRotation) * 360;
    
    setWheelRotation(prev => prev + totalRotation);

    // Stop spinning after animation and pick number
    setTimeout(() => {
      setIsSpinning(false);
      const finalNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
      onNumberCalled(finalNumber);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Compact Wheel */}
      <div className="relative" style={{ width: '120px', height: '120px' }}>
        {/* Wheel Background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-primary/40"></div>
        
        {/* Segments */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ rotate: wheelRotation }}
          transition={{ 
            duration: isSpinning ? 3 : 0, 
            ease: isSpinning ? [0.25, 0.46, 0.45, 0.94] : "linear"
          }}
        >
          {/* Create visual segments */}
          {Array.from({length: 12}, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-12 bg-primary/60 origin-bottom"
              style={{
                left: '50%',
                bottom: '50%',
                transform: `translateX(-50%) rotate(${i * 30}deg)`,
              }}
            />
          ))}
        </motion.div>
        
        {/* Center Hub */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center z-10">
          <div className="w-4 h-4 bg-background rounded-full"></div>
        </div>
        
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20">
          <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[16px] border-l-transparent border-r-transparent border-b-destructive"></div>
        </div>

        {/* Current Number Display */}
        {currentNumber && !isSpinning && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-lg font-bold z-20 border-2 border-accent-foreground/20"
          >
            {currentNumber}
          </motion.div>
        )}
      </div>

      {/* Spin Button */}
      <Button
        onClick={spinWheel}
        disabled={isSpinning || availableNumbers.length === 0}
        size="sm"
        className="flex items-center gap-2"
      >
        {isSpinning ? (
          <>
            <Pause className="w-4 h-4" />
            Spinning...
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Spin
          </>
        )}
      </Button>

      {/* Quick Stats */}
      <div className="text-xs text-center space-y-1">
        <div className="text-muted-foreground">
          {calledNumbers.length}/90 called
        </div>
        {availableNumbers.length === 0 && (
          <div className="text-primary font-semibold">Complete!</div>
        )}
      </div>
    </div>
  );
};

export default CompactNumberWheel;
