import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const inspirationIdeas = [
  "Start your day with 10 minutes of meditation to clear your mind",
  "Break large tasks into smaller, manageable chunks of 25-minute focus sessions",
  "Celebrate small wins - they compound into major achievements",
  "Learn something new for 15 minutes daily - consistency beats intensity",
  "Practice the 2-minute rule: if it takes less than 2 minutes, do it now",
  "Set your top 3 priorities each morning before checking messages",
  "Take a 5-minute break every hour to stretch and reset your focus",
  "Write down 3 things you're grateful for each evening",
  "Eliminate one distraction from your workspace today",
  "Share your progress with someone who supports your goals",
  "Visualize completing your most important task before starting it",
  "Create a morning routine that energizes you for the day ahead",
  "Block time for deep work when your energy is highest",
  "Review your goals weekly to stay aligned with your vision",
  "Practice saying no to protect your time and energy",
];

export const AIInspirationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [ideas, setIdeas] = useState<string[]>([]);

  const generateIdeas = () => {
    const shuffled = [...inspirationIdeas].sort(() => Math.random() - 0.5);
    setIdeas(shuffled.slice(0, 3));
    setIsOpen(true);
  };

  return (
    <>
      <Button
        onClick={generateIdeas}
        className="w-full glass hover:glass-hover border border-border/50 hover:border-accent hover:glow-primary transition-smooth group h-auto py-6"
        variant="outline"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-smooth">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-foreground">Get AI Inspiration</div>
            <div className="text-xs text-muted-foreground">
              Discover 3 productivity tips to boost your day
            </div>
          </div>
        </div>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glass border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              AI Inspiration
            </DialogTitle>
            <DialogDescription>
              Here are 3 productivity ideas to supercharge your day
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {ideas.map((idea, index) => (
              <div
                key={index}
                className="glass rounded-lg p-4 border border-border/50 hover:border-accent/30 transition-smooth animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{idea}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
