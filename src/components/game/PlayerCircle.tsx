import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Clock } from "lucide-react";

interface Player {
  id: string;
  name: string;
  avatar: string;
  isReady: boolean;
  isCurrentPlayer?: boolean;
}

interface PlayerCircleProps {
  players: Player[];
  maxPlayers: number;
  onToggleReady?: () => void;
  currentPlayerId?: string;
}

const PlayerCircle = ({ players, maxPlayers, onToggleReady, currentPlayerId }: PlayerCircleProps) => {
  // Create array of positions for circular layout
  const positions = Array.from({ length: maxPlayers }, (_, i) => {
    const angle = (i * 360) / maxPlayers - 90; // Start from top
    const radius = 80; // Distance from center
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return { x, y, angle };
  });

  const currentPlayer = players.find(p => p.id === currentPlayerId);

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Center Area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
          <span className="font-baloo font-bold text-primary">
            {players.length}/{maxPlayers}
          </span>
        </div>
      </div>

      {/* Player Positions */}
      {positions.map((pos, index) => {
        const player = players[index];
        const isEmpty = !player;

        return (
          <motion.div
            key={index}
            className="absolute w-16 h-16"
            style={{
              left: `calc(50% + ${pos.x}px - 32px)`,
              top: `calc(50% + ${pos.y}px - 32px)`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {isEmpty ? (
              // Empty slot
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                <Clock className="w-6 h-6 text-muted-foreground/50" />
              </div>
            ) : (
              // Player slot
              <div className="relative">
                <Avatar className="w-16 h-16 border-2 border-primary/20">
                  <AvatarImage src={player.avatar} alt={player.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {player.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Ready badge */}
                <Badge
                  variant={player.isReady ? "default" : "secondary"}
                  className={`absolute -bottom-2 -right-2 text-xs ${
                    player.isReady 
                      ? "bg-accent text-accent-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {player.isReady ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                </Badge>

                {/* Player name */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs font-medium text-foreground bg-background/80 px-2 py-1 rounded">
                    {player.name}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Ready toggle for current player */}
      {currentPlayer && onToggleReady && (
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <Button
            variant={currentPlayer.isReady ? "secondary" : "default"}
            onClick={onToggleReady}
            className={
              currentPlayer.isReady
                ? "bg-muted text-muted-foreground hover:bg-muted/80"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }
          >
            {currentPlayer.isReady ? "Not Ready" : "Ready!"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PlayerCircle;