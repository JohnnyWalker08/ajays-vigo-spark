import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Coffee, Sparkles, Brain } from "lucide-react";

const moods = [
  { id: "focused", label: "Focused", icon: Brain, gradient: "from-blue-500 to-cyan-500" },
  { id: "tired", label: "Tired", icon: Coffee, gradient: "from-orange-500 to-amber-500" },
  { id: "inspired", label: "Inspired", icon: Sparkles, gradient: "from-purple-500 to-pink-500" },
  { id: "energetic", label: "Energetic", icon: Zap, gradient: "from-green-500 to-emerald-500" },
];

export const MoodSelector = () => {
  const [selectedMood, setSelectedMood] = useState("focused");

  useEffect(() => {
    const savedMood = localStorage.getItem("userMood") || "focused";
    setSelectedMood(savedMood);
    applyMoodTheme(savedMood);
  }, []);

  const applyMoodTheme = (mood: string) => {
    const root = document.documentElement;
    const moodData = moods.find(m => m.id === mood);
    
    // Update CSS variables based on mood
    switch (mood) {
      case "focused":
        root.style.setProperty("--mood-primary", "217 91% 60%");
        break;
      case "tired":
        root.style.setProperty("--mood-primary", "25 95% 53%");
        break;
      case "inspired":
        root.style.setProperty("--mood-primary", "280 89% 66%");
        break;
      case "energetic":
        root.style.setProperty("--mood-primary", "142 71% 45%");
        break;
    }
  };

  const handleMoodChange = (mood: string) => {
    setSelectedMood(mood);
    localStorage.setItem("userMood", mood);
    applyMoodTheme(mood);
  };

  return (
    <Card className="glass-card p-4 mb-6 border-primary/20">
      <h3 className="text-sm font-medium mb-3 text-muted-foreground">How are you feeling?</h3>
      <div className="grid grid-cols-4 gap-2">
        {moods.map((mood) => {
          const Icon = mood.icon;
          return (
            <Button
              key={mood.id}
              variant={selectedMood === mood.id ? "default" : "outline"}
              className={`flex flex-col gap-1 h-auto py-3 hover-scale ${
                selectedMood === mood.id ? "neon-glow" : ""
              }`}
              onClick={() => handleMoodChange(mood.id)}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{mood.label}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};