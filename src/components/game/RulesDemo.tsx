import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RulesDemoProps {
  pattern: 'early-five' | 'top-row' | 'middle-row' | 'bottom-row' | 'full-house' | 'corners';
  title: string;
  description: string;
}

const RulesDemo = ({ pattern, title, description }: RulesDemoProps) => {
  // Create a 3x9 tambola ticket layout
  const createTicket = () => {
    const ticket = Array(3).fill(null).map(() => Array(9).fill(0));
    // Add some sample numbers for demonstration
    const sampleNumbers = [
      [0, 12, 0, 34, 0, 56, 0, 78, 90],
      [5, 0, 23, 0, 45, 0, 67, 0, 0],
      [0, 18, 0, 39, 0, 52, 0, 81, 0]
    ];
    return sampleNumbers;
  };

  const ticket = createTicket();

  const isHighlighted = (row: number, col: number) => {
    const hasNumber = ticket[row][col] !== 0;
    if (!hasNumber) return false;

    switch (pattern) {
      case 'early-five':
        // Highlight first 5 numbers found
        const allNumbers = ticket.flat().filter(n => n !== 0);
        const firstFive = allNumbers.slice(0, 5);
        return firstFive.includes(ticket[row][col]);
      case 'top-row':
        return row === 0;
      case 'middle-row':
        return row === 1;
      case 'bottom-row':
        return row === 2;
      case 'full-house':
        return true;
      case 'corners':
        return (row === 0 && (col === 0 || col === 8)) || 
               (row === 2 && (col === 0 || col === 8));
      default:
        return false;
    }
  };

  return (
    <Card className="p-6 bg-card/50 border-primary/20">
      <div className="text-center mb-4">
        <h3 className="font-baloo font-semibold text-lg text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Mini Tambola Ticket */}
      <div className="bg-background/50 p-4 rounded-lg border border-primary/20 mb-4">
        <div className="grid grid-cols-9 gap-1">
          {ticket.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  aspect-square flex items-center justify-center text-xs font-mono rounded
                  ${cell === 0 
                    ? 'bg-muted/30' 
                    : isHighlighted(rowIndex, colIndex)
                      ? 'bg-primary text-primary-foreground font-bold'
                      : 'bg-background border border-primary/20 text-foreground'
                  }
                `}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: (rowIndex * 9 + colIndex) * 0.02 }}
              >
                {cell || ''}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Pattern Badge */}
      <div className="text-center">
        <Badge variant="secondary" className="bg-primary/20 text-primary">
          {title}
        </Badge>
      </div>
    </Card>
  );
};

export default RulesDemo;