import { useState, useEffect } from "react";
import { Plus, Target, Trash2, Edit2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addGamificationPoints } from "./GamificationTracker";
import { logActivity } from "./InsightsDashboard";

interface Goal {
  id: string;
  text: string;
  progress: number;
}

export const GoalManager = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedGoals = localStorage.getItem("goals");
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    if (!newGoal.trim()) return;

    const goal: Goal = {
      id: Date.now().toString(),
      text: newGoal,
      progress: 0,
    };

    setGoals([...goals, goal]);
    setNewGoal("");
    toast({
      title: "Goal added",
      description: "Your goal has been added successfully",
    });
  };

  const updateProgress = (id: string, progress: number) => {
    const goal = goals.find((g) => g.id === id);
    const newProgress = Math.min(100, Math.max(0, progress));
    
    setGoals(
      goals.map((g) =>
        g.id === id ? { ...g, progress: newProgress } : g
      )
    );

    // Award points for progress
    if (goal && newProgress > goal.progress) {
      const points = newProgress === 100 ? 50 : 5;
      addGamificationPoints("goal_completed", points);
      logActivity("goal_progress", points);
      
      if (newProgress === 100) {
        toast({
          title: "Goal completed! +50 XP 🎉",
          description: "Outstanding achievement!",
        });
      } else {
        toast({
          title: `Progress updated! +${points} XP`,
          description: "Keep pushing forward!",
        });
      }
    }
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id));
    toast({
      title: "Goal deleted",
      description: "Goal removed from your list",
    });
  };

  const startEdit = (goal: Goal) => {
    setEditingId(goal.id);
    setEditText(goal.text);
  };

  const saveEdit = () => {
    if (!editText.trim()) return;
    
    setGoals(
      goals.map((goal) =>
        goal.id === editingId ? { ...goal, text: editText } : goal
      )
    );
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  return (
    <div className="glass rounded-2xl p-6 space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Target className="w-6 h-6 text-secondary" /> Goals
      </h2>

      <div className="flex gap-2">
        <Input
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addGoal()}
          placeholder="Add a new goal..."
          className="glass border-border/50 focus:border-secondary focus:glow-secondary transition-smooth"
        />
        <Button
          onClick={addGoal}
          className="bg-secondary hover:bg-secondary/90 glow-secondary transition-smooth"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-4 mt-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="glass rounded-xl p-4 space-y-3 group hover:border-secondary/30 transition-smooth animate-fade-in"
          >
            {editingId === goal.id ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                  className="flex-1"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={saveEdit}
                  className="text-secondary hover:bg-secondary/10"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={cancelEdit}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-foreground font-medium">{goal.text}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-smooth">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => startEdit(goal)}
                    className="text-secondary hover:bg-secondary/10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteGoal(goal.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-secondary font-semibold">{goal.progress}%</span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-secondary to-accent rounded-full transition-all duration-500 glow-secondary"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateProgress(goal.id, goal.progress + 10)}
                  className="flex-1 border-secondary/30 hover:bg-secondary/10 hover:border-secondary transition-smooth"
                >
                  +10%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateProgress(goal.id, goal.progress - 10)}
                  className="flex-1 border-secondary/30 hover:bg-secondary/10 hover:border-secondary transition-smooth"
                >
                  -10%
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {goals.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No goals yet. Set your first goal above!
        </p>
      )}
    </div>
  );
};
