import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Home, RotateCcw, Share } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const GameEnd = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { result, prize, winType } = location.state || { 
    result: 'lose', 
    prize: '₹0', 
    winType: 'No Win' 
  };

  const isWinner = result === 'win';

  const shareResult = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'TambolaVerse Game Result',
        text: isWinner 
          ? `I just won ${prize} in TambolaVerse! 🎉`
          : 'Just played an exciting game on TambolaVerse!',
        url: window.location.origin
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Result Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="text-center mb-8"
        >
          {isWinner ? (
            <div className="mb-6">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-4"
              >
                <Trophy className="w-24 h-24 text-primary" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl font-baloo font-bold text-primary mb-2"
              >
                Congratulations! 🎉
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-xl text-foreground"
              >
                You Won {prize}!
              </motion.p>
            </div>
          ) : (
            <div className="mb-6">
              <Medal className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-3xl font-baloo font-bold text-foreground mb-2">
                Better Luck Next Time!
              </h1>
              <p className="text-lg text-muted-foreground">
                Thanks for playing
              </p>
            </div>
          )}
        </motion.div>

        {/* Game Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-6 mb-6 bg-card/50 border-primary/20">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Win Type:</span>
                <Badge 
                  variant={isWinner ? "default" : "secondary"}
                  className={isWinner ? "bg-primary text-primary-foreground" : ""}
                >
                  {winType}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Prize Won:</span>
                <span className={`font-bold ${isWinner ? 'text-primary' : 'text-muted-foreground'}`}>
                  {prize}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Game Mode:</span>
                <span className="text-foreground">Classic Tambola</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Players:</span>
                <span className="text-foreground">6 Players</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-3"
        >
          <Button
            onClick={() => navigate('/setup')}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </Button>

          <Button
            variant="outline"
            onClick={shareResult}
            className="w-full bg-card/50 border-primary/20 text-foreground hover:bg-primary/10"
          >
            <Share className="w-5 h-5 mr-2" />
            Share Result
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="w-full text-foreground hover:bg-white/10"
          >
            <Home className="w-5 h-5 mr-2" />
            Home
          </Button>
        </motion.div>

        {/* Achievement Notification */}
        {isWinner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg text-center"
          >
            <p className="text-sm text-accent-foreground">
              🎯 Achievement Unlocked: First Win!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GameEnd;