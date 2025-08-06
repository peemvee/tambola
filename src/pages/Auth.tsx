import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, Lock, User, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

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
            {isLogin ? "Welcome Back!" : "Join TambolaVerse"}
          </h1>
        </div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 bg-card/50 border-primary/20">
            {/* Social Login */}
            <div className="space-y-3 mb-6">
              <Button className="w-full bg-[#DB4437] hover:bg-[#DB4437]/90 text-white">
                <Mail className="w-5 h-5 mr-2" />
                Continue with Google
              </Button>
              <Button className="w-full bg-[#1877F2] hover:bg-[#1877F2]/90 text-white">
                <Phone className="w-5 h-5 mr-2" />
                Continue with Facebook
              </Button>
            </div>

            <div className="relative mb-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
                or
              </span>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Full Name"
                    className="pl-10 bg-background/50 border-primary/20"
                  />
                </div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="pl-10 bg-background/50 border-primary/20"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-10 bg-background/50 border-primary/20"
                />
              </div>

              {!isLogin && (
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Phone Number (Optional)"
                    className="pl-10 bg-background/50 border-primary/20"
                  />
                </div>
              )}
            </div>

            {/* Action Button */}
            <Button className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
              {isLogin ? "Sign In" : "Create Account"}
            </Button>

            {/* Toggle Mode */}
            <div className="text-center mt-4">
              <span className="text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </span>
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary p-0 ml-1 h-auto"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </Button>
            </div>

            {/* Terms */}
            {!isLogin && (
              <p className="text-xs text-muted-foreground text-center mt-4">
                By creating an account, you agree to our{" "}
                <Button variant="link" className="text-primary p-0 h-auto text-xs">
                  Terms of Service
                </Button>{" "}
                and{" "}
                <Button variant="link" className="text-primary p-0 h-auto text-xs">
                  Privacy Policy
                </Button>
              </p>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;