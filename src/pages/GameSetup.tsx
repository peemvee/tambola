import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, Lock, Coins, ArrowLeft, ArrowRight } from "lucide-react";
import TicketSelector from "@/components/game/TicketSelector";

const GameSetup = () => {
  const navigate = useNavigate();
  const [selectedFee, setSelectedFee] = useState(50);
  const [ticketCount, setTicketCount] = useState(1);
  const [gameMode, setGameMode] = useState<'private' | 'public' | null>(null);
  const [roomCode, setRoomCode] = useState("");

  const entryFees = [10, 20, 50, 100, 200];

  const handleCreatePrivateRoom = () => {
    setGameMode('private');
  };

  const handleJoinPublicGame = () => {
    setGameMode('public');
    proceedToPayment();
  };

  const handleJoinPrivateRoom = () => {
    if (roomCode.length === 6) {
      proceedToPayment();
    }
  };

  const proceedToPayment = () => {
    navigate('/payment', {
      state: {
        entryFee: selectedFee,
        ticketCount,
        gameMode: gameMode === 'private' ? 'Private Room' : 'Public Game'
      }
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="bg-card/50 border-primary/20 text-foreground hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-baloo font-bold text-foreground">
            Game Setup
          </h1>
        </div>

        {!gameMode ? (
          <>
            {/* Game Mode Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-baloo font-semibold text-center text-foreground mb-6">
                Choose Game Mode
              </h2>

              {/* Create Private Room */}
              <motion.div whileTap={{ scale: 0.98 }}>
                <Card 
                  className="p-6 bg-card/50 border-primary/20 cursor-pointer hover:border-primary/40 transition-colors"
                  onClick={handleCreatePrivateRoom}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-baloo font-semibold text-lg text-foreground">Create Private Room</h3>
                      <p className="text-sm text-muted-foreground">Play with friends</p>
                    </div>
                  </div>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-poppins">
                    Create Room
                  </Button>
                </Card>
              </motion.div>

              {/* Join Public Game */}
              <motion.div whileTap={{ scale: 0.98 }}>
                <Card 
                  className="p-6 bg-card/50 border-primary/20 cursor-pointer hover:border-primary/40 transition-colors"
                  onClick={handleJoinPublicGame}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-baloo font-semibold text-lg text-foreground">Join Public Game</h3>
                      <p className="text-sm text-muted-foreground">Play with anyone</p>
                    </div>
                  </div>
                  <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-poppins">
                    Quick Join
                  </Button>
                </Card>
              </motion.div>

              {/* Join Private Room */}
              <Card className="p-6 bg-card/50 border-primary/20">
                <h3 className="font-baloo font-semibold text-lg text-foreground mb-4">
                  Join Private Room
                </h3>
                <div className="space-y-3">
                  <Input
                    placeholder="Enter room code (e.g., T8QX9Y)"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="bg-background/50 border-primary/20 text-center font-mono text-lg tracking-widest"
                  />
                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-poppins"
                    onClick={handleJoinPrivateRoom}
                    disabled={roomCode.length !== 6}
                  >
                    Join Room
                  </Button>
                </div>
              </Card>
            </div>
          </>
        ) : (
          <>
            {/* Game Configuration */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-baloo font-semibold text-foreground mb-2">
                  {gameMode === 'private' ? 'Private Room Setup' : 'Game Configuration'}
                </h2>
                <p className="text-muted-foreground">
                  Configure your game settings
                </p>
              </div>

              {/* Entry Fee Selection */}
              <div className="space-y-4">
                <h3 className="font-baloo font-semibold text-center text-foreground">Entry Fee</h3>
                <div className="grid grid-cols-3 gap-3">
                  {entryFees.map((amount) => (
                    <motion.div key={amount} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant={selectedFee === amount ? "default" : "outline"}
                        className={`h-16 flex flex-col items-center justify-center ${
                          selectedFee === amount
                            ? "bg-primary text-primary-foreground"
                            : "bg-card/50 border-primary/20 text-foreground hover:bg-primary/10"
                        }`}
                        onClick={() => setSelectedFee(amount)}
                      >
                        <Coins className="w-4 h-4 mb-1" />
                        <span className="font-poppins">₹{amount}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Ticket Count Selection */}
              <TicketSelector
                selectedCount={ticketCount}
                onCountChange={setTicketCount}
              />

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setGameMode(null)}
                  className="flex-1 bg-card/50 border-primary/20 text-foreground hover:bg-primary/10"
                >
                  Back
                </Button>
                <Button
                  onClick={proceedToPayment}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-poppins"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Summary */}
              <Card className="p-4 bg-accent/10 border-accent/20">
                <div className="text-center">
                  <p className="text-sm text-accent-foreground">
                    <span className="font-medium">Total: ₹{selectedFee * ticketCount}</span>
                    <span className="text-xs text-accent-foreground/70 ml-2">
                      ({ticketCount} ticket{ticketCount > 1 ? 's' : ''} × ₹{selectedFee})
                    </span>
                  </p>
                </div>
              </Card>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default GameSetup;