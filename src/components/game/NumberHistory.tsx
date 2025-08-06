import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp } from "lucide-react";

interface NumberHistoryProps {
  calledNumbers: number[];
  currentNumber: number | null;
  showHistory?: boolean;
}

const NumberHistory = ({ calledNumbers, currentNumber, showHistory = true }: NumberHistoryProps) => {
  // Get numbers by range for better visualization
  const getNumbersByRange = () => {
    const ranges = {
      '1-18': { numbers: [], color: 'bg-red-100 text-red-800 border-red-200' },
      '19-36': { numbers: [], color: 'bg-blue-100 text-blue-800 border-blue-200' },
      '37-54': { numbers: [], color: 'bg-green-100 text-green-800 border-green-200' },
      '55-72': { numbers: [], color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      '73-90': { numbers: [], color: 'bg-purple-100 text-purple-800 border-purple-200' }
    };

    calledNumbers.forEach(num => {
      if (num <= 18) ranges['1-18'].numbers.push(num);
      else if (num <= 36) ranges['19-36'].numbers.push(num);
      else if (num <= 54) ranges['37-54'].numbers.push(num);
      else if (num <= 72) ranges['55-72'].numbers.push(num);
      else ranges['73-90'].numbers.push(num);
    });

    return ranges;
  };

  const getNumberStatus = (number: number) => {
    if (number === currentNumber) return 'current';
    if (calledNumbers.includes(number)) return 'called';
    return 'pending';
  };

  const renderNumberGrid = () => {
    return (
      <div className="grid grid-cols-9 gap-1 text-xs">
        {Array.from({length: 90}, (_, i) => i + 1).map(number => {
          const status = getNumberStatus(number);
          return (
            <motion.div
              key={number}
              className={`
                aspect-square flex items-center justify-center font-bold rounded text-xs border
                ${status === 'current' 
                  ? 'bg-yellow-400 text-yellow-900 border-yellow-500 animate-pulse scale-110 shadow-lg' 
                  : status === 'called'
                    ? 'bg-green-500 text-white border-green-600 shadow-sm'
                    : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200'
                }
              `}
              animate={{
                scale: status === 'current' ? [1, 1.1, 1] : 1,
                rotateZ: status === 'current' ? [0, 5, -5, 0] : 0,
              }}
              transition={{
                duration: 0.5,
                repeat: status === 'current' ? Infinity : 0,
              }}
              whileHover={{ scale: 1.05 }}
            >
              {number}
            </motion.div>
          );
        })}
      </div>
    );
  };

  const ranges = getNumbersByRange();
  const recentNumbers = calledNumbers.slice(-5).reverse();

  return (
    <div className="space-y-4">
      {/* Current Number Display */}
      <AnimatePresence mode="wait">
        {currentNumber && (
          <motion.div
            key={currentNumber}
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: -20 }}
            className="text-center"
          >
            <Card className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0 shadow-xl">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="text-4xl font-black mb-2"
              >
                {currentNumber}
              </motion.div>
              <div className="text-lg font-semibold opacity-90">
                Latest Number Called
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Numbers */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-gray-600" />
          <h3 className="font-semibold text-gray-800">Recent Numbers</h3>
        </div>
        <div className="flex gap-2 flex-wrap">
          {recentNumbers.map((number, index) => (
            <motion.div
              key={`recent-${number}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Badge 
                variant="secondary" 
                className={`text-sm font-bold ${
                  index === 0 ? 'bg-yellow-200 text-yellow-800 border border-yellow-300' : ''
                }`}
              >
                {number}
              </Badge>
            </motion.div>
          ))}
          {recentNumbers.length === 0 && (
            <div className="text-gray-500 text-sm">No numbers called yet</div>
          )}
        </div>
      </Card>


      {/* Full Number Grid */}
      {showHistory && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-gray-800">All Numbers (1-90)</h3>
          {renderNumberGrid()}
          <div className="flex justify-between text-xs text-gray-600 mt-3">
            <span>Called: {calledNumbers.length}/90</span>
            <span>Remaining: {90 - calledNumbers.length}</span>
          </div>
        </Card>
      )}
    </div>
  );
};

export default NumberHistory;
