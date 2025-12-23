import { useState, useEffect } from "react";
import { Plus, Check, Flame, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { addGamificationPoints } from "./GamificationTracker";
import { soundEffects } from "@/utils/soundEffects";

interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  completedDates: string[];
  createdAt: string;
  color: string;
}

const HABIT_ICONS = ["💪", "📚", "🧘", "💧", "🏃", "🍎", "😴", "🙏", "✍️", "🎯"];
const HABIT_COLORS = [
  "from-primary to-primary/60",
  "from-secondary to-secondary/60",
  "from-accent to-accent/60",
  "from-destructive to-destructive/60",
  "from-cyan-500 to-cyan-400",
  "from-emerald-500 to-emerald-400",
  "from-amber-500 to-amber-400",
  "from-rose-500 to-rose-400",
];

export const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("💪");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("habits");
    if (saved) {
      setHabits(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const getTodayKey = () => new Date().toISOString().split("T")[0];

  const isCompletedToday = (habit: Habit) => {
    return habit.completedDates.includes(getTodayKey());
  };

  const calculateStreak = (completedDates: string[]): number => {
    if (completedDates.length === 0) return 0;
    
    const sortedDates = [...completedDates].sort().reverse();
    const today = getTodayKey();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split("T")[0];
    
    // Must have completed today or yesterday to have a streak
    if (!sortedDates.includes(today) && !sortedDates.includes(yesterdayKey)) {
      return 0;
    }
    
    let streak = 0;
    let currentDate = new Date();
    
    // If not completed today, start from yesterday
    if (!sortedDates.includes(today)) {
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    while (true) {
      const dateKey = currentDate.toISOString().split("T")[0];
      if (sortedDates.includes(dateKey)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;

    const habit: Habit = {
      id: crypto.randomUUID(),
      name: newHabit,
      icon: selectedIcon,
      streak: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
      color: HABIT_COLORS[Math.floor(Math.random() * HABIT_COLORS.length)],
    };

    setHabits([...habits, habit]);
    setNewHabit("");
    setSelectedIcon("💪");
    setIsAdding(false);
    toast.success("Habit created! Build your streak 🔥");
  };

  const toggleHabit = (id: string) => {
    const todayKey = getTodayKey();
    
    setHabits(habits.map(habit => {
      if (habit.id !== id) return habit;
      
      const alreadyCompleted = habit.completedDates.includes(todayKey);
      let newCompletedDates: string[];
      
      if (alreadyCompleted) {
        newCompletedDates = habit.completedDates.filter(d => d !== todayKey);
        toast.info("Habit unmarked for today");
      } else {
        newCompletedDates = [...habit.completedDates, todayKey];
        soundEffects.playChime();
        addGamificationPoints("task_completed", 5);
        toast.success(`${habit.icon} ${habit.name} completed! +5 XP`);
      }
      
      return {
        ...habit,
        completedDates: newCompletedDates,
        streak: calculateStreak(newCompletedDates),
      };
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
    toast.success("Habit removed");
  };

  const getWeekProgress = (habit: Habit): number => {
    const today = new Date();
    let completed = 0;
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];
      if (habit.completedDates.includes(dateKey)) {
        completed++;
      }
    }
    
    return (completed / 7) * 100;
  };

  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push({
        key: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en", { weekday: "short" }).charAt(0),
        isToday: i === 0,
      });
    }
    
    return days;
  };

  const completedToday = habits.filter(h => isCompletedToday(h)).length;
  const totalHabits = habits.length;
  const dailyProgress = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
              <RotateCcw className="w-5 h-5 text-primary" />
            </div>
            <span>Daily Habits</span>
          </CardTitle>
          <Button
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        
        {/* Daily Progress */}
        {totalHabits > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Today's Progress</span>
              <span className="font-semibold text-primary">{completedToday}/{totalHabits}</span>
            </div>
            <Progress value={dailyProgress} className="h-2" />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Add Habit Form */}
        {isAdding && (
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-3 animate-fade-in">
            <Input
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="e.g., Morning meditation"
              className="bg-background/50"
              onKeyDown={(e) => e.key === "Enter" && addHabit()}
            />
            <div className="flex flex-wrap gap-2">
              {HABIT_ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={`text-xl p-2 rounded-lg transition-all ${
                    selectedIcon === icon
                      ? "bg-primary/20 scale-110 ring-2 ring-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={addHabit} className="flex-1" size="sm">
                Create Habit
              </Button>
              <Button onClick={() => setIsAdding(false)} variant="ghost" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Habits List */}
        <div className="space-y-3">
          {habits.map((habit) => {
            const completed = isCompletedToday(habit);
            const weekDays = getLast7Days();
            
            return (
              <div
                key={habit.id}
                className={`relative p-4 rounded-xl border transition-all duration-300 group ${
                  completed
                    ? "bg-gradient-to-r " + habit.color + " border-transparent"
                    : "bg-card/50 border-border/50 hover:border-primary/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Check Button */}
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                      completed
                        ? "bg-background/30 text-background"
                        : "bg-muted/50 hover:bg-primary/20 text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {completed ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-xl">{habit.icon}</span>
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${completed ? "text-background" : "text-foreground"}`}>
                        {habit.name}
                      </span>
                      {habit.streak > 0 && (
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${completed ? "bg-background/20 text-background" : ""}`}
                        >
                          <Flame className="w-3 h-3 mr-1" />
                          {habit.streak}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Week View */}
                    <div className="flex gap-1 mt-2">
                      {weekDays.map((day) => {
                        const dayCompleted = habit.completedDates.includes(day.key);
                        return (
                          <div
                            key={day.key}
                            className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-medium ${
                              day.isToday
                                ? dayCompleted
                                  ? "bg-background/40 text-background"
                                  : "bg-primary/20 text-primary ring-1 ring-primary"
                                : dayCompleted
                                  ? completed ? "bg-background/20 text-background" : "bg-primary/20 text-primary"
                                  : completed ? "bg-background/10 text-background/50" : "bg-muted/30 text-muted-foreground"
                            }`}
                          >
                            {day.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteHabit(habit.id)}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 ${
                      completed ? "text-background/70 hover:text-background hover:bg-background/20" : "text-destructive"
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {habits.length === 0 && !isAdding && (
          <div className="text-center py-8 text-muted-foreground">
            <RotateCcw className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No habits yet</p>
            <p className="text-sm">Build consistency with daily habits</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};