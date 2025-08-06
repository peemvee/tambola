import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Download, Play, CheckCircle } from "lucide-react";
import RulesDemo from "@/components/game/RulesDemo";

const Rules = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const ruleSteps = [
    {
      title: "Get Your Ticket",
      description: "Each player gets 1-6 tambola tickets with numbers from 1-90",
      component: <RulesDemo pattern="full-house" title="Sample Ticket" description="Numbers are arranged in a 3x9 grid" />
    },
    {
      title: "Early Five",
      description: "First player to mark any 5 numbers wins the Early Five prize",
      component: <RulesDemo pattern="early-five" title="Early Five" description="Mark any 5 numbers first" />
    },
    {
      title: "Row Prizes",
      description: "Complete any full row (top, middle, or bottom) to win row prizes",
      component: <RulesDemo pattern="top-row" title="Top Row" description="Complete the entire top row" />
    },
    {
      title: "Full House",
      description: "Mark all numbers on your ticket to win the biggest prize!",
      component: <RulesDemo pattern="full-house" title="Full House" description="Mark every number on your ticket" />
    },
    {
      title: "Corner Pattern",
      description: "Some games include special patterns like corners for bonus prizes",
      component: <RulesDemo pattern="corners" title="Corners" description="Mark all four corner numbers" />
    }
  ];

  const nextStep = () => {
    if (currentStep < ruleSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startGame = () => {
    navigate('/setup');
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
            onClick={() => navigate(-1)}
            className="bg-card/50 border-primary/20 text-foreground hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-baloo font-bold text-foreground">
            How to Play
          </h1>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {ruleSteps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentStep
                  ? "bg-primary"
                  : index < currentStep
                  ? "bg-accent"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Current Step */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h2 className="text-xl font-baloo font-bold text-foreground mb-2">
              {ruleSteps[currentStep].title}
            </h2>
            <p className="text-muted-foreground">
              {ruleSteps[currentStep].description}
            </p>
          </div>

          {ruleSteps[currentStep].component}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="bg-card/50 border-primary/20 text-foreground hover:bg-primary/10 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep === ruleSteps.length - 1 ? (
            <Button
              onClick={startGame}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-poppins"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Start Playing
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-poppins"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Additional Resources */}
        <Card className="p-6 bg-card/50 border-primary/20">
          <h3 className="font-baloo font-semibold text-foreground mb-4">
            Need More Help?
          </h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start bg-background/50 border-primary/20 text-foreground hover:bg-primary/10"
            >
              <Download className="w-4 h-4 mr-3" />
              Download Complete Rules (PDF)
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-background/50 border-primary/20 text-foreground hover:bg-primary/10"
            >
              <Play className="w-4 h-4 mr-3" />
              Watch Tutorial Video
            </Button>
          </div>
        </Card>

        {/* Quick Tips */}
        <Card className="p-4 bg-accent/10 border-accent/20">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-accent-foreground text-sm mb-1">
                Pro Tip
              </h4>
              <p className="text-xs text-accent-foreground/80">
                Turn on auto-mark in settings to never miss a number. You can always switch to manual mode during the game!
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Rules;