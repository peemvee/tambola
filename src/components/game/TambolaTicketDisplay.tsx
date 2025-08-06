import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TambolaTicket } from "@/utils/tambolaTicketGenerator";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Trophy } from "lucide-react";

interface TambolaTicketDisplayProps {
  ticket: TambolaTicket;
  ticketIndex: number;
  calledNumbers: number[];
  onCellClick?: (row: number, col: number, number: number | null) => void;
  isActive?: boolean;
  autoMark?: boolean;
  showAnimations?: boolean;
}

interface WinPattern {
  type: 'early-five' | 'top-line' | 'middle-line' | 'bottom-line' | 'full-house';
  name: string;
  description: string;
  cells: [number, number][];
  prize?: string;
}

const TambolaTicketDisplay = ({
  ticket,
  ticketIndex,
  calledNumbers,
  onCellClick,
  isActive = true,
  autoMark = false,
  showAnimations = true
}: TambolaTicketDisplayProps) => {
  const [markedCells, setMarkedCells] = useState<boolean[][]>(
    Array(3).fill(null).map(() => Array(9).fill(false))
  );
  const [completedPatterns, setCompletedPatterns] = useState<WinPattern[]>([]);
  const [recentlyMarked, setRecentlyMarked] = useState<[number, number] | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Auto-mark numbers when they're called
  useEffect(() => {
    if (autoMark && calledNumbers.length > 0) {
      const lastCalledNumber = calledNumbers[calledNumbers.length - 1];
      
      // Find and mark the number in the ticket
      ticket.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell === lastCalledNumber && !markedCells[rowIndex][colIndex]) {
            setMarkedCells(prev => {
              const newMarked = [...prev];
              newMarked[rowIndex][colIndex] = true;
              return newMarked;
            });
            setRecentlyMarked([rowIndex, colIndex]);
            
            // Clear recently marked after animation
            setTimeout(() => setRecentlyMarked(null), 1000);
          }
        });
      });
    }
  }, [calledNumbers, ticket, autoMark, markedCells]);

  // Check for winning patterns
  useEffect(() => {
    const patterns = checkWinningPatterns();
    const newCompletions = patterns.filter(p => 
      !completedPatterns.some(cp => cp.type === p.type)
    );
    
    if (newCompletions.length > 0) {
      setCompletedPatterns(prev => [...prev, ...newCompletions]);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [markedCells]);

  const handleCellClick = (row: number, col: number) => {
    const cellValue = ticket[row][col];
    if (!cellValue || !isActive) return;
    
    // Only allow marking if number has been called
    if (!calledNumbers.includes(cellValue)) return;
    
    const newMarked = [...markedCells];
    newMarked[row][col] = !newMarked[row][col];
    setMarkedCells(newMarked);
    
    if (onCellClick) {
      onCellClick(row, col, cellValue);
    }
  };

  const checkWinningPatterns = (): WinPattern[] => {
    const patterns: WinPattern[] = [];
    
    // Early Five - first 5 numbers called
    const markedNumbers = getMarkedNumbers();
    if (markedNumbers.length >= 5) {
      const earlyFiveCells = markedNumbers.slice(0, 5).map(num => {
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 9; c++) {
            if (ticket[r][c] === num && markedCells[r][c]) {
              return [r, c] as [number, number];
            }
          }
        }
        return [0, 0] as [number, number];
      });
      
      if (earlyFiveCells.length === 5) {
        patterns.push({
          type: 'early-five',
          name: 'Early Five',
          description: 'First 5 numbers marked',
          cells: earlyFiveCells,
          prize: '₹500'
        });
      }
    }
    
    // Line patterns
    for (let row = 0; row < 3; row++) {
      const rowCells: [number, number][] = [];
      let isLineComplete = true;
      
      for (let col = 0; col < 9; col++) {
        if (ticket[row][col] !== null) {
          if (markedCells[row][col]) {
            rowCells.push([row, col]);
          } else {
            isLineComplete = false;
          }
        }
      }
      
      if (isLineComplete && rowCells.length > 0) {
        const lineTypes = ['top-line', 'middle-line', 'bottom-line'] as const;
        const lineNames = ['Top Line', 'Middle Line', 'Bottom Line'];
        
        patterns.push({
          type: lineTypes[row],
          name: lineNames[row],
          description: `Complete ${lineNames[row].toLowerCase()}`,
          cells: rowCells,
          prize: '₹800'
        });
      }
    }
    
    // Full House
    const allNumberCells: [number, number][] = [];
    let isFullHouse = true;
    
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 9; col++) {
        if (ticket[row][col] !== null) {
          if (markedCells[row][col]) {
            allNumberCells.push([row, col]);
          } else {
            isFullHouse = false;
          }
        }
      }
    }
    
    if (isFullHouse && allNumberCells.length > 0) {
      patterns.push({
        type: 'full-house',
        name: 'Full House',
        description: 'All numbers marked',
        cells: allNumberCells,
        prize: '₹2,500'
      });
    }
    
    return patterns;
  };

  const getMarkedNumbers = (): number[] => {
    const marked: number[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 9; col++) {
        if (ticket[row][col] !== null && markedCells[row][col]) {
          marked.push(ticket[row][col] as number);
        }
      }
    }
    return marked.sort((a, b) => 
      calledNumbers.indexOf(a) - calledNumbers.indexOf(b)
    );
  };

  const isCellInWinningPattern = (row: number, col: number): string | null => {
    for (const pattern of completedPatterns) {
      if (pattern.cells.some(([r, c]) => r === row && c === col)) {
        return pattern.type;
      }
    }
    return null;
  };

  const getCellStatus = (row: number, col: number, value: number | null) => {
    if (!value) return 'empty';
    if (!calledNumbers.includes(value)) return 'pending';
    if (markedCells[row][col]) {
      const winPattern = isCellInWinningPattern(row, col);
      if (winPattern) return `marked-winning-${winPattern}`;
      return 'marked';
    }
    return 'called-unmarked';
  };

  return (
    <div className="relative">
      <Card className="p-4 bg-white border-2 border-gray-200 shadow-lg">
        {/* Ticket Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm font-bold">
              Ticket #{ticketIndex + 1}
            </Badge>
            {completedPatterns.length > 0 && (
              <Badge variant="default" className="bg-yellow-500 text-yellow-900">
                <Trophy className="w-3 h-3 mr-1" />
                {completedPatterns.length} Win{completedPatterns.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          
          <div className="text-sm text-gray-600">
            {getMarkedNumbers().length}/15 marked
          </div>
        </div>

        {/* Ticket Grid */}
        <div className="grid grid-cols-9 gap-1 mb-4">
          {ticket.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const cellStatus = getCellStatus(rowIndex, colIndex, cell);
              const isRecentlyMarked = recentlyMarked && 
                recentlyMarked[0] === rowIndex && recentlyMarked[1] === colIndex;
              
              return (
                <motion.button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  disabled={!cell || !isActive}
                  className={`
                    aspect-square flex items-center justify-center text-sm font-bold rounded-md border-2 transition-all duration-200
                    ${cell === null 
                      ? 'bg-gray-100 border-gray-200 cursor-default' 
                      : cellStatus === 'pending'
                        ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        : cellStatus === 'called-unmarked'
                          ? 'bg-yellow-100 border-yellow-400 text-yellow-800 hover:bg-yellow-200 animate-pulse'
                          : cellStatus === 'marked'
                            ? 'bg-green-500 border-green-600 text-white'
                            : cellStatus.startsWith('marked-winning')
                              ? 'bg-purple-500 border-purple-600 text-white ring-2 ring-purple-300'
                              : 'bg-white border-gray-300 text-gray-700'
                    }
                  `}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    scale: isRecentlyMarked ? [1, 1.2, 1] : 1,
                    rotateZ: isRecentlyMarked ? [0, 5, -5, 0] : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {cell && (
                    <div className="relative">
                      {cell}
                      {markedCells[rowIndex][colIndex] && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1"
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.button>
              );
            })
          )}
        </div>

        {/* Completed Patterns */}
        {completedPatterns.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700">Completed Patterns:</h4>
            <div className="flex flex-wrap gap-2">
              {completedPatterns.map((pattern, index) => (
                <motion.div
                  key={pattern.type}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge 
                    variant="default" 
                    className="bg-purple-100 text-purple-800 border border-purple-300"
                  >
                    <Star className="w-3 h-3 mr-1" />
                    {pattern.name} {pattern.prize}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && showAnimations && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              exit={{ scale: 0 }}
              className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold shadow-lg"
            >
              🎉 WINNER! 🎉
            </motion.div>
            
            {/* Confetti effect */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * 30) * Math.PI / 180) * 100,
                  y: Math.sin((i * 30) * Math.PI / 180) * 100,
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
                className="absolute w-2 h-2 bg-yellow-400 rounded"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TambolaTicketDisplay;
