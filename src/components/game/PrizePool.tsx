import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Coins, Trophy, Target, Star } from "lucide-react";

interface PrizePoolProps {
  entryFee: number;
  playerCount: number;
  maxPlayers: number;
}

const PrizePool = ({ entryFee, playerCount, maxPlayers }: PrizePoolProps) => {
  const totalPool = entryFee * playerCount;
  const maxPool = entryFee * maxPlayers;
  const poolProgress = (playerCount / maxPlayers) * 100;

  // Prize distribution
  const prizes = [
    {
      name: "Full House",
      icon: Trophy,
      percentage: 50,
      amount: Math.floor(totalPool * 0.5),
      color: "text-primary"
    },
    {
      name: "Top Row",
      icon: Target,
      percentage: 15,
      amount: Math.floor(totalPool * 0.15),
      color: "text-secondary"
    },
    {
      name: "Middle Row",
      icon: Target,
      percentage: 15,
      amount: Math.floor(totalPool * 0.15),
      color: "text-secondary"
    },
    {
      name: "Bottom Row",
      icon: Target,
      percentage: 15,
      amount: Math.floor(totalPool * 0.15),
      color: "text-secondary"
    },
    {
      name: "Early Five",
      icon: Star,
      percentage: 5,
      amount: Math.floor(totalPool * 0.05),
      color: "text-accent"
    }
  ];

  return (
    <Card className="p-6 bg-card/50 border-primary/20">
      <div className="text-center mb-6">
        <h3 className="font-baloo font-semibold text-lg text-foreground mb-2">Prize Pool</h3>
        
        {/* Total Pool Display */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Coins className="w-6 h-6 text-primary" />
          <span className="text-3xl font-bold text-primary">₹{totalPool}</span>
        </motion.div>

        {/* Pool Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹{entryFee} × {playerCount} players</span>
            <span>Max: ₹{maxPool}</span>
          </div>
          <Progress value={poolProgress} className="h-2 bg-muted/30" />
          <p className="text-xs text-muted-foreground">
            {maxPlayers - playerCount} more players can join
          </p>
        </div>
      </div>

      {/* Prize Breakdown */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-foreground mb-3">Prize Distribution:</h4>
        {prizes.map((prize, index) => (
          <motion.div
            key={prize.name}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-background/30"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <prize.icon className={`w-4 h-4 ${prize.color}`} />
              <span className="text-sm font-medium text-foreground">{prize.name}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-foreground">₹{prize.amount}</div>
              <div className="text-xs text-muted-foreground">{prize.percentage}%</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pool Growth Animation */}
      {playerCount > 0 && (
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-xs text-muted-foreground">
            Pool grows as more players join!
          </div>
        </motion.div>
      )}
    </Card>
  );
};

export default PrizePool;