import { motion } from "framer-motion";

interface GameStatsProps {
  availableNumbers: number[];
  calledNumbers: number[];
  entryFee?: number;
  numberOfTickets?: number;
}

const GameStats = ({ availableNumbers, calledNumbers, entryFee = 50, numberOfTickets = 3 }: GameStatsProps) => {
  const totalNumbers = 90;
  const progressPercentage = Math.round((calledNumbers.length / totalNumbers) * 100);

  return (
    <motion.div 
      className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-xl border-2 border-gray-200 h-full flex flex-col overflow-hidden"
      whileHover={{ scale: 1.02 }}
    >
      {/* Header with Game Info */}
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <h3 className="text-gray-700 font-bold text-sm flex items-center gap-2">
          📊 Game Statistics
        </h3>
        <div className="flex gap-1">
          <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
            ₹{entryFee}
          </div>
          <div className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full font-medium">
            {numberOfTickets}T
          </div>
        </div>
      </div>
      
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <motion.div 
          className="bg-gradient-to-br from-blue-50 to-blue-100 p-2 rounded-lg border-2 border-blue-200 text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-blue-600 font-semibold text-xs mb-1">Numbers Left</div>
          <motion.div 
            className="text-lg font-black text-blue-800"
            animate={{
              scale: availableNumbers.length <= 10 ? [1, 1.1, 1] : 1,
              color: availableNumbers.length <= 10 ? ["#1e40af", "#dc2626"] : "#1e40af",
            }}
            transition={{
              duration: 0.5,
              repeat: availableNumbers.length <= 10 ? Infinity : 0,
            }}
          >
            {availableNumbers.length}
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-green-50 to-green-100 p-2 rounded-lg border-2 border-green-200 text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-green-600 font-semibold text-xs mb-1">Numbers Called</div>
          <div className="text-lg font-black text-green-800">{calledNumbers.length}</div>
        </motion.div>
      </div>
      
      {/* Progress Section */}
      <div className="space-y-1 flex-shrink-0">
        <div className="flex justify-between text-xs text-gray-600">
          <span className="font-medium">Progress</span>
          <span className="font-bold">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Game Stage Indicator */}
        <div className="text-center">
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            progressPercentage < 25 ? 'bg-blue-100 text-blue-800' :
            progressPercentage < 50 ? 'bg-yellow-100 text-yellow-800' :
            progressPercentage < 75 ? 'bg-orange-100 text-orange-800' :
            'bg-red-100 text-red-800'
          }`}>
            {progressPercentage < 25 ? '🟢 Early' :
             progressPercentage < 50 ? '🟡 Mid' :
             progressPercentage < 75 ? '🟠 Late' :
             '🔴 Final'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default GameStats;
