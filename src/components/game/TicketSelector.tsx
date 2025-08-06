import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Ticket } from "lucide-react";

interface TicketSelectorProps {
  selectedCount: number;
  onCountChange: (count: number) => void;
}

const TicketSelector = ({ selectedCount, onCountChange }: TicketSelectorProps) => {
  const ticketCounts = [1, 2, 3, 4, 5, 6];

  return (
    <div className="space-y-4">
      <h3 className="font-baloo font-semibold text-center text-foreground">Number of Tickets</h3>
      <div className="grid grid-cols-3 gap-3">
        {ticketCounts.map((count) => (
          <motion.div key={count} whileTap={{ scale: 0.95 }}>
            <Button
              variant={selectedCount === count ? "default" : "outline"}
              className={`h-16 flex flex-col items-center justify-center ${
                selectedCount === count
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/50 border-primary/20 text-foreground hover:bg-primary/10"
              }`}
              onClick={() => onCountChange(count)}
            >
              <Ticket className="w-4 h-4 mb-1" />
              <span className="font-poppins">{count}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TicketSelector;