import { useEffect, useState } from "react";
import { Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { soundEffects } from "@/utils/soundEffects";
import confetti from "canvas-confetti";

interface Badge {
  name: string;
  icon: any;
}

export const BadgeNotification = () => {
  const [badge, setBadge] = useState<Badge | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleBadgeEarned = (event: CustomEvent) => {
      setBadge(event.detail);
      setShow(true);
      soundEffects.playAchievement();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b"],
      });
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShow(false);
      }, 5000);
    };

    window.addEventListener("badge-earned" as any, handleBadgeEarned as EventListener);
    return () => {
      window.removeEventListener("badge-earned" as any, handleBadgeEarned as EventListener);
    };
  }, []);

  if (!show || !badge) return null;

  const BadgeIcon = badge.icon;

  return (
    <div className="fixed top-20 right-4 z-50 animate-fade-in">
      <div className="glass rounded-2xl p-6 max-w-sm border-accent/50 glow-accent shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-accent/20 glow-accent animate-bounce">
              <BadgeIcon className="w-8 h-8 text-accent" />
            </div>
            <div>
              <div className="text-sm text-accent font-semibold uppercase tracking-wide">
                Badge Unlocked! 🎉
              </div>
              <div className="text-lg font-bold text-foreground mt-1">
                {badge.name}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Keep up the great work!
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShow(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};