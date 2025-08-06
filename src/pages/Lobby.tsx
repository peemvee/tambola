import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Share2, Users, Play } from "lucide-react";
import RoomCodeGenerator from "@/components/game/RoomCodeGenerator";
import PlayerCircle from "@/components/game/PlayerCircle";
import PrizePool from "@/components/game/PrizePool";

const Lobby = () => {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Get game details from navigation state
  const { entryFee = 50, ticketCount = 1, gameMode = "Public Game" } = location.state || {};

  // Mock player data
  const [players, setPlayers] = useState([
    {
      id: "current",
      name: "You",
      avatar: "/avatars/player1.png",
      isReady: false,
      isCurrentPlayer: true
    },
    {
      id: "player2",
      name: "Alex",
      avatar: "/avatars/player2.png",
      isReady: true
    },
    {
      id: "player3",
      name: "Sam",
      avatar: "/avatars/player3.png",
      isReady: false
    }
  ]);

  const maxPlayers = 6;
  const allReady = players.every(p => p.isReady);
  const canStartGame = players.length >= 2 && allReady;

  const toggleReady = () => {
    const newReadyState = !isReady;
    setIsReady(newReadyState);
    setPlayers(prev => 
      prev.map(p => 
        p.id === "current" ? { ...p, isReady: newReadyState } : p
      )
    );
    
    // Navigate to game when player becomes ready
    if (newReadyState) {
      navigate(`/game/${roomCode}`, {
        state: { entryFee, ticketCount, players }
      });
    }
  };

  // Start countdown when all players are ready
  useEffect(() => {
    if (canStartGame && countdown === 0) {
      setCountdown(5);
    }
  }, [canStartGame, countdown]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        if (countdown === 1) {
          // Start game
          navigate(`/game/${roomCode}`, {
            state: { entryFee, ticketCount, players }
          });
        } else {
          setCountdown(countdown - 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, navigate, roomCode, entryFee, ticketCount, players]);

  const shareRoom = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join my Tambola game!',
        text: `Join my Tambola game with room code: ${roomCode}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`Join my Tambola game! Room code: ${roomCode}\n${window.location.href}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto lg:max-w-2xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/setup')}
              className="bg-card/50 border-primary/20 text-foreground hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-baloo font-bold text-foreground">
              Game Lobby
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={shareRoom}
            className="bg-card/50 border-primary/20 text-foreground hover:bg-primary/10"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Room Code */}
        <RoomCodeGenerator roomCode={roomCode} />

        {/* Game Info */}
        <Card className="p-4 bg-card/50 border-primary/20">
          <div className="flex justify-between items-center text-sm">
            <div>
              <span className="text-muted-foreground">Mode: </span>
              <span className="text-foreground font-medium">{gameMode}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Entry: </span>
              <span className="text-primary font-bold">₹{entryFee}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Tickets: </span>
              <span className="text-foreground font-medium">{ticketCount}</span>
            </div>
          </div>
        </Card>

        {/* Players */}
        <Card className="p-6 bg-card/50 border-primary/20">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-baloo font-semibold text-foreground">
              Players ({players.length}/{maxPlayers})
            </h3>
          </div>
          
          <PlayerCircle
            players={players}
            maxPlayers={maxPlayers}
            onToggleReady={toggleReady}
            currentPlayerId="current"
          />
        </Card>

        {/* Prize Pool */}
        <PrizePool
          entryFee={entryFee}
          playerCount={players.length}
          maxPlayers={maxPlayers}
        />

        {/* Game Status */}
        {countdown > 0 ? (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <Card className="p-6 bg-primary/10 border-primary/20">
              <motion.div
                key={countdown}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold text-primary mb-2"
              >
                {countdown}
              </motion.div>
              <p className="text-foreground font-medium">Game starting...</p>
            </Card>
          </motion.div>
        ) : canStartGame ? (
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-poppins py-3"
            onClick={() => navigate(`/game/${roomCode}`, {
              state: { entryFee, ticketCount, players }
            })}
          >
            <Play className="w-5 h-5 mr-2" />
            Start Game Now
          </Button>
        ) : (
          <Card className="p-4 bg-muted/10 border-muted/20">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                {!allReady 
                  ? "Waiting for all players to be ready..."
                  : "Need at least 2 players to start"
                }
              </p>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/rules')}
            className="bg-card/50 border-primary/20 text-foreground hover:bg-primary/10"
          >
            View Rules
          </Button>
          <Button
            variant="outline"
            onClick={() => {/* Add invite logic */}}
            className="bg-card/50 border-primary/20 text-foreground hover:bg-primary/10"
          >
            Invite Friends
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Lobby;