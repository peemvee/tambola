import { motion } from "framer-motion";

interface GameCommentaryProps {
  commentary: string;
  isLoadingCommentary: boolean;
}

const GameCommentary = ({ commentary, isLoadingCommentary }: GameCommentaryProps) => {
  return (
    <motion.div 
      className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl border-2 border-purple-200 h-full flex flex-col"
      animate={{
        backgroundColor: isLoadingCommentary ? 
          ["rgba(233, 213, 255, 1)", "rgba(196, 181, 253, 1)"] : 
          "rgba(233, 213, 255, 1)"
      }}
      transition={{
        duration: 1,
        repeat: isLoadingCommentary ? Infinity : 0,
        repeatType: "reverse"
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-purple-600 font-bold text-lg">🎤 AI Commentary</span>
        {isLoadingCommentary && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full"
          />
        )}
      </div>
      <motion.p 
        className="text-purple-800 font-medium text-lg leading-relaxed flex-1 flex items-center"
        key={commentary}
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isLoadingCommentary ? "🎤 Generating exciting commentary..." : 
         (commentary || "Welcome to Tambola! Spin the wheel to start with AI commentary!")}
      </motion.p>
    </motion.div>
  );
};

export default GameCommentary;
