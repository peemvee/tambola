import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Users, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JoinRoom = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinRoom = async () => {
    if (roomCode.length !== 6) return;
    
    setIsJoining(true);
    // Simulate room validation
    setTimeout(() => {
      navigate(`/lobby/${roomCode}`);
    }, 1000);
  };

  const recentRooms = [
    { code: "ABC123", players: 4, host: "Rajesh" },
    { code: "XYZ789", players: 2, host: "Priya" },
    { code: "DEF456", players: 6, host: "Amit" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-foreground hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-baloo font-bold text-foreground">
            Join Room
          </h1>
        </div>

        {/* Room Code Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 mb-6 bg-card/50 border-primary/20">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Enter Room Code
            </h2>
            
            <div className="space-y-4">
              <Input
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="text-center text-2xl font-mono tracking-widest bg-background/50 border-primary/20"
              />
              
              <Button
                onClick={handleJoinRoom}
                disabled={roomCode.length !== 6 || isJoining}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isJoining ? (
                  <>
                    <Search className="w-5 h-5 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5 mr-2" />
                    Join Room
                  </>
                )}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground text-center mt-4">
              Ask your friend for the 6-digit room code
            </p>
          </Card>
        </motion.div>

        {/* Recent Rooms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Recent Rooms
          </h3>
          
          <div className="space-y-3">
            {recentRooms.map((room) => (
              <Card
                key={room.code}
                className="p-4 bg-card/50 border-primary/20 cursor-pointer hover:bg-card/70 transition-colors"
                onClick={() => setRoomCode(room.code)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-lg font-bold text-primary">
                      {room.code}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Host: {room.host}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-muted-foreground">
                      <Users className="w-4 h-4 mr-1" />
                      <span className="text-sm">{room.players}/6</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 space-y-3"
        >
          <Button
            variant="outline"
            onClick={() => navigate('/setup')}
            className="w-full bg-card/50 border-primary/20 text-foreground hover:bg-primary/10"
          >
            Create Your Own Room
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="w-full text-foreground hover:bg-white/10"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinRoom;