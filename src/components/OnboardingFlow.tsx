import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ChevronRight, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

const steps = [
  {
    title: "Welcome to Ajayi's Planner! 🎉",
    description: "Your AI-powered productivity companion. Let's get you started on your journey to excellence.",
  },
  {
    title: "Add Your First Task ✍️",
    description: "Click the task manager to add what you want to accomplish today. Every big win starts with a small step.",
  },
  {
    title: "Set Your Goals 🎯",
    description: "Define your bigger objectives and track progress. Goals give direction to your daily tasks.",
  },
  {
    title: "Earn Rewards & Badges 🏆",
    description: "Complete tasks to earn points, level up, and unlock achievements. Make productivity fun!",
  },
];

export const OnboardingFlow = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      setIsVisible(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      confetti({
        particleCount: 50,
        angle: 90,
        spread: 45,
        origin: { x: 0.5, y: 0.5 },
      });
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setIsVisible(false);
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b"],
    });
  };

  const handleSkip = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="glass-card max-w-lg w-full p-8 border-primary/30 neon-glow animate-scale-in">
        <div className="flex justify-between items-start mb-6">
          <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkip}
            className="hover-scale"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="text-3xl font-bold gradient-text">{step.title}</h2>
          <p className="text-muted-foreground text-lg">{step.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "w-8 bg-primary"
                    : index < currentStep
                    ? "w-2 bg-primary/50"
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          <Button onClick={handleNext} className="neon-glow hover-scale">
            {currentStep < steps.length - 1 ? (
              <>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </>
            ) : (
              "Get Started! 🚀"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};