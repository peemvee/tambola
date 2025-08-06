import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { QrCode, Smartphone, Shield, RotateCcw, Zap } from "lucide-react";

interface PaymentMethodsProps {
  amount: number;
  onPaymentComplete: () => void;
}

const PaymentMethods = ({ amount, onPaymentComplete }: PaymentMethodsProps) => {
  return (
    <div className="space-y-6">
      {/* Security Badges */}
      <div className="flex justify-center gap-2">
        <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
          <Zap className="w-3 h-3 mr-1" />
          Instant
        </Badge>
        <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
          <RotateCcw className="w-3 h-3 mr-1" />
          Refundable
        </Badge>
        <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
          <Shield className="w-3 h-3 mr-1" />
          Secure
        </Badge>
      </div>

      {/* UPI Payment Options */}
      <Card className="p-6 bg-card/50 border-primary/20">
        <h3 className="font-baloo font-semibold mb-4 text-center text-foreground">
          Pay via UPI
        </h3>
        
        {/* UPI Apps */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {['GPay', 'PhonePe', 'Paytm'].map((app) => (
            <motion.div key={app} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center justify-center bg-card/50 border-primary/20 text-foreground hover:bg-primary/10"
              >
                <Smartphone className="w-5 h-5 mb-1" />
                <span className="text-xs font-poppins">{app}</span>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* QR Code Section */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-background/50 rounded-lg border border-primary/20 mb-3">
            <QrCode className="w-16 h-16 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Scan QR code to pay ₹{amount}</p>
        </div>

        {/* UPI ID Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Or enter UPI ID:</label>
          <Input
            placeholder="yourname@upi"
            className="bg-background/50 border-primary/20"
          />
        </div>

        {/* Pay Button */}
        <Button
          className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 font-poppins"
          onClick={onPaymentComplete}
        >
          Pay ₹{amount}
        </Button>
      </Card>
    </div>
  );
};

export default PaymentMethods;