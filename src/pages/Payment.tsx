import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import PaymentMethods from "@/components/game/PaymentMethods";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Get payment details from navigation state
  const { entryFee = 50, ticketCount = 1, gameMode = "Public Game" } = location.state || {};
  const totalAmount = entryFee * ticketCount;

  const handlePaymentComplete = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsSuccess(true);

    // Auto redirect to lobby after success animation
    setTimeout(() => {
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      navigate(`/lobby/${roomCode}`, {
        state: { entryFee, ticketCount, gameMode }
      });
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.6, times: [0, 0.6, 1] }}
            className="mb-6"
          >
            <CheckCircle className="w-24 h-24 text-accent mx-auto" />
          </motion.div>
          <h2 className="text-2xl font-baloo font-bold text-foreground mb-2">
            Payment Successful!
          </h2>
          <p className="text-muted-foreground mb-4">
            Joining game room...
          </p>
          <div className="animate-pulse text-primary">
            <div className="w-8 h-2 bg-primary rounded mx-auto"></div>
          </div>
        </motion.div>
      </div>
    );
  }

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
            onClick={() => navigate(-1)}
            className="bg-card/50 border-primary/20 text-foreground hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-baloo font-bold text-foreground">
            Complete Payment
          </h1>
        </div>

        {/* Payment Summary */}
        <Card className="p-6 bg-card/50 border-primary/20">
          <h3 className="font-baloo font-semibold text-lg text-foreground mb-4">
            Payment Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Game Mode:</span>
              <span className="text-foreground font-medium">{gameMode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Entry Fee:</span>
              <span className="text-foreground font-medium">₹{entryFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Number of Tickets:</span>
              <span className="text-foreground font-medium">{ticketCount}</span>
            </div>
            <hr className="border-primary/20" />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-foreground">Total Amount:</span>
              <span className="text-primary">₹{totalAmount}</span>
            </div>
          </div>
        </Card>

        {/* Payment Methods */}
        {!isProcessing ? (
          <PaymentMethods
            amount={totalAmount}
            onPaymentComplete={handlePaymentComplete}
          />
        ) : (
          <Card className="p-8 bg-card/50 border-primary/20">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
              />
              <h3 className="font-baloo font-semibold text-foreground mb-2">
                Processing Payment...
              </h3>
              <p className="text-sm text-muted-foreground">
                Please don't close this window
              </p>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default Payment;