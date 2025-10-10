import { useState, useEffect } from "react";
import { Trophy, Flame, Zap, Award, Star, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GamificationData {
  totalPoints: number;
  level: number;
  streak: number;
  tasksCompleted: number;
  goalsCompleted: number;
  badges: string[];
  lastActiveDate: string;
}

const POINTS_PER_LEVEL = 100;

const BADGES = [
  { id: "first_task", name: "First Steps", icon: Star, requirement: 1, description: "Complete your first task" },
  { id: "task_warrior", name: "Task Warrior", icon: Zap, requirement: 10, description: "Complete 10 tasks" },
  { id: "goal_crusher", name: "Goal Crusher", icon: Target, requirement: 5, description: "Complete 5 goals" },
  { id: "week_streak", name: "Week Warrior", icon: Flame, requirement: 7, description: "7-day streak" },
  { id: "month_streak", name: "Consistency King", icon: Trophy, requirement: 30, description: "30-day streak" },
  { id: "level_5", name: "Rising Star", icon: Award, requirement: 5, description: "Reach level 5" },
];

export const GamificationTracker = () => {
  const [gamificationData, setGamificationData] = useState<GamificationData>({
    totalPoints: 0,
    level: 1,
    streak: 0,
    tasksCompleted: 0,
    goalsCompleted: 0,
    badges: [],
    lastActiveDate: new Date().toDateString(),
  });

  useEffect(() => {
    const saved = localStorage.getItem("gamification");
    if (saved) {
      const data = JSON.parse(saved);
      // Check streak
      const lastDate = new Date(data.lastActiveDate).toDateString();
      const today = new Date().toDateString();
      
      if (lastDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const wasYesterday = new Date(data.lastActiveDate).toDateString() === yesterday.toDateString();
        
        setGamificationData({
          ...data,
          streak: wasYesterday ? data.streak : 0,
          lastActiveDate: today,
        });
      } else {
        setGamificationData(data);
      }
    }

    // Listen for gamification events
    const handleGamificationUpdate = (event: CustomEvent) => {
      const { type, points } = event.detail;
      updateGamification(type, points);
    };

    window.addEventListener("gamification-update" as any, handleGamificationUpdate as EventListener);
    return () => {
      window.removeEventListener("gamification-update" as any, handleGamificationUpdate as EventListener);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("gamification", JSON.stringify(gamificationData));
  }, [gamificationData]);

  const updateGamification = (type: string, points: number) => {
    setGamificationData((prev) => {
      const newPoints = prev.totalPoints + points;
      const newLevel = Math.floor(newPoints / POINTS_PER_LEVEL) + 1;
      
      let updates: Partial<GamificationData> = {
        totalPoints: newPoints,
        level: newLevel,
        lastActiveDate: new Date().toDateString(),
      };

      // Update streak on first action of the day
      const today = new Date().toDateString();
      if (prev.lastActiveDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const wasYesterday = new Date(prev.lastActiveDate).toDateString() === yesterday.toDateString();
        updates.streak = wasYesterday ? prev.streak + 1 : 1;
      }

      if (type === "task_completed") {
        updates.tasksCompleted = prev.tasksCompleted + 1;
      } else if (type === "goal_completed") {
        updates.goalsCompleted = prev.goalsCompleted + 1;
      }

      const newData = { ...prev, ...updates };

      // Check for new badges
      const earnedBadges = [...prev.badges];
      BADGES.forEach((badge) => {
        if (!earnedBadges.includes(badge.id)) {
          let earned = false;
          if (badge.id === "first_task" && newData.tasksCompleted >= 1) earned = true;
          if (badge.id === "task_warrior" && newData.tasksCompleted >= 10) earned = true;
          if (badge.id === "goal_crusher" && newData.goalsCompleted >= 5) earned = true;
          if (badge.id === "week_streak" && newData.streak >= 7) earned = true;
          if (badge.id === "month_streak" && newData.streak >= 30) earned = true;
          if (badge.id === "level_5" && newData.level >= 5) earned = true;

          if (earned) {
            earnedBadges.push(badge.id);
            // Show notification
            const event = new CustomEvent("badge-earned", {
              detail: { badge: badge.name, icon: badge.icon },
            });
            window.dispatchEvent(event);
          }
        }
      });

      return { ...newData, badges: earnedBadges };
    });
  };

  const currentLevelPoints = gamificationData.totalPoints % POINTS_PER_LEVEL;
  const progressToNextLevel = (currentLevelPoints / POINTS_PER_LEVEL) * 100;

  return (
    <div className="glass rounded-2xl p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-6 h-6 text-accent" />
          Your Progress
        </h2>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 glow-accent">
          <Zap className="w-5 h-5 text-accent" />
          <span className="text-accent font-bold text-lg">{gamificationData.totalPoints}</span>
        </div>
      </div>

      {/* Level Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-foreground font-semibold">Level {gamificationData.level}</span>
          <span className="text-muted-foreground text-sm">
            {currentLevelPoints}/{POINTS_PER_LEVEL} XP
          </span>
        </div>
        <Progress value={progressToNextLevel} className="h-3 glow-primary" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass rounded-xl p-4 space-y-2 hover:border-primary/50 transition-smooth">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-destructive" />
            <span className="text-muted-foreground text-sm">Streak</span>
          </div>
          <div className="text-3xl font-bold text-foreground glow-text">
            {gamificationData.streak}
            <span className="text-lg text-muted-foreground ml-1">days</span>
          </div>
        </div>

        <div className="glass rounded-xl p-4 space-y-2 hover:border-accent/50 transition-smooth">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" />
            <span className="text-muted-foreground text-sm">Badges</span>
          </div>
          <div className="text-3xl font-bold text-foreground glow-text">
            {gamificationData.badges.length}
            <span className="text-lg text-muted-foreground ml-1">/ {BADGES.length}</span>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Achievements
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {BADGES.map((badge) => {
            const earned = gamificationData.badges.includes(badge.id);
            const BadgeIcon = badge.icon;
            return (
              <div
                key={badge.id}
                className={`glass rounded-lg p-3 flex items-center gap-3 transition-smooth ${
                  earned 
                    ? "border-accent/50 glow-accent hover:scale-105" 
                    : "opacity-50 grayscale"
                }`}
              >
                <div className={`p-2 rounded-full ${earned ? "bg-accent/20" : "bg-muted/20"}`}>
                  <BadgeIcon className={`w-4 h-4 ${earned ? "text-accent" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-semibold truncate ${earned ? "text-foreground" : "text-muted-foreground"}`}>
                    {badge.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {badge.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Export utility function to trigger gamification updates
export const addGamificationPoints = (type: "task_completed" | "goal_completed", points: number) => {
  const event = new CustomEvent("gamification-update", {
    detail: { type, points },
  });
  window.dispatchEvent(event);
};