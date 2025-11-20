import { useState, useEffect } from "react";
import { TrendingUp, CheckCircle2, Clock, Target, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { notificationService } from "@/utils/notificationService";

interface DigestStats {
  tasksCompleted: number;
  tasksPending: number;
  completionRate: number;
  streak: number;
  topProductiveTime: string;
}

export const DailyDigest = () => {
  const [stats, setStats] = useState<DigestStats>({
    tasksCompleted: 0,
    tasksPending: 0,
    completionRate: 0,
    streak: 0,
    topProductiveTime: 'Morning',
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    try {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const today = new Date().toDateString();
      
      const completedToday = tasks.filter((t: any) => {
        if (!t.completed) return false;
        const completedDate = new Date(t.completedAt || t.timestamp);
        return completedDate.toDateString() === today;
      });

      const pending = tasks.filter((t: any) => !t.completed);
      const totalTasks = tasks.length;
      const completionRate = totalTasks > 0 ? (completedToday.length / totalTasks) * 100 : 0;

      // Calculate streak (simplified)
      const streak = parseInt(localStorage.getItem('currentStreak') || '0');

      setStats({
        tasksCompleted: completedToday.length,
        tasksPending: pending.length,
        completionRate: Math.round(completionRate),
        streak,
        topProductiveTime: getProductiveTime(),
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const getProductiveTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  const sendDigestNotification = () => {
    notificationService.generateDailyDigest();
  };

  const motivationalMessage = () => {
    if (stats.completionRate >= 80) {
      return "🌟 Outstanding work! You're crushing your goals!";
    } else if (stats.completionRate >= 50) {
      return "💪 Great progress! Keep up the momentum!";
    } else if (stats.completionRate >= 20) {
      return "🚀 Good start! You're on the right track!";
    } else {
      return "✨ Every journey starts with a single step!";
    }
  };

  return (
    <Card className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary glow-primary">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Daily Digest</h2>
            <p className="text-xs text-muted-foreground">Your productivity summary</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={sendDigestNotification}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Send Report
        </Button>
      </div>

      {/* Motivational Message */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30">
        <p className="text-center text-sm font-medium text-foreground">
          {motivationalMessage()}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-card/50 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-xs text-muted-foreground">Completed</span>
          </div>
          <p className="text-2xl font-bold gradient-text">{stats.tasksCompleted}</p>
        </div>

        <div className="p-4 rounded-lg bg-card/50 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="text-xs text-muted-foreground">Pending</span>
          </div>
          <p className="text-2xl font-bold gradient-text">{stats.tasksPending}</p>
        </div>

        <div className="p-4 rounded-lg bg-card/50 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-muted-foreground">Streak</span>
          </div>
          <p className="text-2xl font-bold gradient-text">{stats.streak} days</p>
        </div>

        <div className="p-4 rounded-lg bg-card/50 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-xs text-muted-foreground">Best Time</span>
          </div>
          <p className="text-sm font-bold gradient-text">{stats.topProductiveTime}</p>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Completion Rate</span>
          <span className="text-sm font-bold gradient-text">{stats.completionRate}%</span>
        </div>
        <Progress value={stats.completionRate} className="h-2" />
      </div>

      {/* Quick Insights */}
      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
        <h3 className="text-sm font-semibold text-foreground mb-2">💡 Quick Insight</h3>
        <p className="text-xs text-muted-foreground">
          You're most productive during the {stats.topProductiveTime.toLowerCase()}. 
          Try scheduling important tasks during this time for maximum efficiency.
        </p>
      </div>
    </Card>
  );
};
