import { motion } from "framer-motion";

interface GameStatsCompactProps {
  availableNumbers: number[];
  calledNumbers: number[];
  entryFee?: number;
  numberOfTickets?: number;
}

const GameStatsCompact = ({ availableNumbers, calledNumbers, entryFee = 50, numberOfTickets = 3 }: GameStatsCompactProps) => {
  const totalNumbers = 90;
  const progressPercentage = Math.round((calledNumbers.length / totalNumbers) * 100);

  return (
    <motion.div 
      className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200"
      whileHover={{ scale: 1.01 }}
    >
      {/* Compact Stats Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Game Info */}
        <div className="flex gap-2">
          <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
            Entry: ₹{entryFee}
          </div>
          <div className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full font-medium">
            {numberOfTickets} ticket{numberOfTickets > 1 ? 's' : ''}
          </div>
        </div>

        {/* Numbers Stats */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-600">Left</div>
            <div className="text-xl font-bold text-blue-600">{availableNumbers.length}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Called</div>
            <div className="text-xl font-bold text-green-600">{calledNumbers.length}</div>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-blue-500"
              style={{ width: `${progressPercentage}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            progressPercentage < 25 ? 'bg-blue-100 text-blue-800' :
            progressPercentage < 50 ? 'bg-yellow-100 text-yellow-800' :
            progressPercentage < 75 ? 'bg-orange-100 text-orange-800' :
            'bg-red-100 text-red-800'
          }`}>
            {progressPercentage < 25 ? 'Early' :
             progressPercentage < 50 ? 'Mid' :
             progressPercentage < 75 ? 'Late' :
             'Final'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default GameStatsCompact;
