import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Volume2, VolumeX, Users, Trophy, MessageCircle, Settings, Eye, Hand, Plus, Download } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import NumberWheel from "@/components/game/NumberWheel";
import TambolaTicketDisplay from "@/components/game/TambolaTicketDisplay";
import NumberHistory from "@/components/game/NumberHistory";
import GameCommentary from "@/components/game/GameCommentary";
import GameStats from "@/components/game/GameStats";
import { TambolaTicketGenerator, TambolaTicket } from "@/utils/tambolaTicketGenerator";
import { TambolaNumberPicker } from "@/utils/tambolaNumberPicker";

// Game component with original NumberWheel
const Game = () => {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const location = useLocation();
  
  // Get game configuration from navigation state
  const { entryFee = 50, ticketCount = 3, players = [] } = location.state || {};
  
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [isGameActive, setIsGameActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [gameMode, setGameMode] = useState<'manual' | 'assist'>('assist');
  const [numberOfTickets, setNumberOfTickets] = useState(ticketCount);
  
  // State for AI commentary
  const [commentary, setCommentary] = useState("");
  const [isLoadingCommentary, setIsLoadingCommentary] = useState(false);

  // Initialize number picker
  const [numberPicker] = useState(() => new TambolaNumberPicker());

  // Generate valid Tambola tickets
  const tickets = useMemo(() => {
    return TambolaTicketGenerator.generateMultipleTickets({
      numberOfTickets,
      ticketsPerSheet: 6
    });
  }, [numberOfTickets]);

  // Validate tickets (for demonstration)
  useEffect(() => {
    tickets.forEach((ticket, index) => {
      const isValid = TambolaTicketGenerator.validateTicket(ticket);
      console.log(`Ticket ${index + 1} is ${isValid ? 'valid' : 'invalid'}`);
    });
  }, [tickets]);

  // Handle number called from wheel
  const handleNumberCalled = (number: number) => {
    setCurrentNumber(number);
    setCalledNumbers(prev => [...prev, number]);
  };

  const handleGameStateChange = (active: boolean) => {
    setIsGameActive(active);
    if (!active) {
      // Reset called numbers when game is reset
      setCalledNumbers([]);
      setCurrentNumber(null);
      numberPicker.reset();
    }
  };

  // Handle commentary change from NumberWheel
  const handleCommentaryChange = (newCommentary: string, loading: boolean) => {
    setCommentary(newCommentary);
    setIsLoadingCommentary(loading);
  };

  const autoMarkNumber = (number: number) => {
    // This is now handled by individual ticket components
    console.log(`Auto-marking number ${number}`);
  };

  const addMoreTickets = () => {
    if (numberOfTickets < 10) {
      setNumberOfTickets(prev => prev + 1);
    }
  };

  const downloadTickets = () => {
    // Generate printable tickets
    const ticketData = tickets.map((ticket, index) => ({
      ticketNumber: index + 1,
      ticket: ticket
    }));
    
    console.log('Downloading tickets:', ticketData);
    // Here you would implement actual PDF generation or printing
    alert('Ticket download feature would be implemented here!');
  };

  const claimWin = () => {
    navigate(`/game-end/${roomCode}`, { 
      state: { 
        result: 'win', 
        prize: '₹2,500',
        winType: 'Full House'
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-foreground hover:bg-accent"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
              <Users className="w-3 h-3 mr-1" />
              Room: {roomCode}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="text-foreground hover:bg-accent"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Number Wheel */}
        <div className="w-96 border-r border-border p-4 overflow-y-auto space-y-4">
          <NumberWheel
            onNumberCalled={handleNumberCalled}
            calledNumbers={calledNumbers}
            isGameActive={isGameActive}
            onGameStateChange={handleGameStateChange}
            onCommentaryChange={handleCommentaryChange}
          />

          <NumberHistory
            calledNumbers={calledNumbers}
            currentNumber={currentNumber}
            showHistory={true}
          />
        </div>

        {/* Right Panel - Stats, Commentary and Game Area */}
        <div className="flex-1 flex flex-col">
          {/* Stats and Commentary Row */}
          <div className="p-4 border-b border-border flex gap-4 h-48">
            {/* Game Stats - 60% */}
            <div className="flex-[0.6] h-full">
              <GameStats
                availableNumbers={Array.from({length: 90}, (_, i) => i + 1).filter(n => !calledNumbers.includes(n))}
                calledNumbers={calledNumbers}
                entryFee={entryFee}
                numberOfTickets={numberOfTickets}
              />
            </div>
            
            {/* Commentary - 40% */}
            <div className="flex-[0.4] h-full">
              <GameCommentary
                commentary={commentary}
                isLoadingCommentary={isLoadingCommentary}
              />
            </div>
          </div>

          {/* Game Mode Controls */}
          <div className="mx-4 mb-4">
            <div className="flex gap-2">
              <Button
                variant={gameMode === 'manual' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setGameMode('manual')}
                className="flex items-center gap-2"
              >
                <Hand className="w-4 h-4" />
                Manual
              </Button>
              <Button
                variant={gameMode === 'assist' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setGameMode('assist')}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Assist
              </Button>
            </div>
          </div>

          {/* Tickets */}
          <div className="flex-1 mx-4 mb-4">
            {/* Grid View for All Tickets */}
            <div className="max-h-[40vh] overflow-y-auto">
              <div className={`grid gap-3 ${
                numberOfTickets <= 2 ? 'grid-cols-1 lg:grid-cols-2' :
                numberOfTickets <= 4 ? 'grid-cols-2 lg:grid-cols-2' :
                numberOfTickets <= 6 ? 'grid-cols-2 lg:grid-cols-3' :
                'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}>
                {tickets.slice(0, numberOfTickets).map((ticket, ticketIndex) => (
                  <motion.div
                    key={ticketIndex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: ticketIndex * 0.1 }}
                    className="relative"
                  >
                    <div className="absolute -top-2 -left-2 z-10 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-bold">
                      #{ticketIndex + 1}
                    </div>
                    <TambolaTicketDisplay
                      ticket={ticket}
                      ticketIndex={ticketIndex}
                      calledNumbers={calledNumbers}
                      isActive={isGameActive}
                      autoMark={false}
                      showAnimations={true}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mx-4 mb-4 flex gap-3">
            <Button
              onClick={claimWin}
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Claim Win
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/lobby/${roomCode}`)}
              className="px-6"
            >
              Leave Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;