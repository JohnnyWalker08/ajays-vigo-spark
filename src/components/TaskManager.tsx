import { useState, useEffect } from "react";
import { Plus, Check, Trash2, Edit2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addGamificationPoints } from "./GamificationTracker";
import { logActivity } from "./InsightsDashboard";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
    };

    setTasks([...tasks, task]);
    setNewTask("");
    toast({
      title: "Task added",
      description: "Your task has been added successfully",
    });
  };

  const toggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
    
    // Award points when completing a task
    if (task && !task.completed) {
      addGamificationPoints("task_completed", 10);
      logActivity("task_completed", 10);
      toast({
        title: "Task completed! +10 XP",
        description: "You're making great progress!",
      });
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast({
      title: "Task deleted",
      description: "Task removed from your list",
    });
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = () => {
    if (!editText.trim()) return;
    
    setTasks(
      tasks.map((task) =>
        task.id === editingId ? { ...task, text: editText } : task
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
        <span className="text-primary">✓</span> Tasks
      </h2>

      <div className="flex gap-2">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a new task..."
          className="glass border-border/50 focus:border-primary focus:glow-primary transition-smooth"
        />
        <Button
          onClick={addTask}
          className="bg-primary hover:bg-primary/90 glow-primary transition-smooth"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-2 mt-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="glass rounded-xl p-4 flex items-center justify-between group hover:border-primary/30 transition-smooth animate-fade-in"
          >
            {editingId === task.id ? (
              <div className="flex-1 flex items-center gap-2">
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
                  className="text-primary hover:bg-primary/10"
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
              <>
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-smooth ${
                      task.completed
                        ? "bg-primary border-primary glow-primary"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {task.completed && <Check className="w-3 h-3 text-primary-foreground" />}
                  </button>
                  <span
                    className={`text-foreground transition-smooth ${
                      task.completed ? "line-through opacity-50" : ""
                    }`}
                  >
                    {task.text}
                  </span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-smooth">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => startEdit(task)}
                    className="text-primary hover:bg-primary/10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No tasks yet. Add your first task above!
        </p>
      )}
    </div>
  );
};
