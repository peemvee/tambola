import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

interface RoomCodeGeneratorProps {
  roomCode?: string;
}

const RoomCodeGenerator = ({ roomCode: providedCode }: RoomCodeGeneratorProps) => {
  const [copied, setCopied] = useState(false);
  
  // Generate a random room code if not provided
  const roomCode = providedCode || generateRoomCode();
  
  function generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6 bg-card/50 border-primary/20">
      <div className="text-center space-y-4">
        <h3 className="font-baloo font-semibold text-lg text-foreground">Room Code</h3>
        <div className="flex items-center justify-center gap-3">
          <motion.div
            className="bg-primary/10 px-4 py-2 rounded-lg border border-primary/20"
            whileTap={{ scale: 0.95 }}
          >
            <span className="font-mono text-2xl font-bold text-primary tracking-widest">
              {roomCode}
            </span>
          </motion.div>
          <Button
            variant="outline"
            size="sm"
            onClick={copyRoomCode}
            className="bg-card/50 border-primary/20 text-foreground hover:bg-primary/10"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Share this code with friends to join</p>
      </div>
    </Card>
  );
};

export default RoomCodeGenerator;