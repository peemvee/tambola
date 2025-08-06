import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GameSetup from "./pages/GameSetup";
import Payment from "./pages/Payment";
import Rules from "./pages/Rules";
import Lobby from "./pages/Lobby";
import Auth from "./pages/Auth";
import Game from "./pages/Game";
import GameEnd from "./pages/GameEnd";
import Leaderboard from "./pages/Leaderboard";
import Rewards from "./pages/Rewards";
import Settings from "./pages/Settings";
import JoinRoom from "./pages/JoinRoom";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/setup" element={<GameSetup />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/lobby/:roomCode" element={<Lobby />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/game/:roomCode" element={<Game />} />
          <Route path="/game-end/:roomCode" element={<GameEnd />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/join-room" element={<JoinRoom />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
