import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Smile, Edit2 } from "lucide-react";

export const PersonalizedGreeting = () => {
  const [userName, setUserName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("userName") || "Champion";
    setUserName(savedName);
    setTempName(savedName);
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else if (hour < 21) setGreeting("Good Evening");
    else setGreeting("Good Night");
  }, []);

  const saveName = () => {
    localStorage.setItem("userName", tempName);
    setUserName(tempName);
    setIsEditing(false);
  };

  return (
    <Card className="glass-card p-6 mb-6 border-primary/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Smile className="w-8 h-8 text-primary animate-pulse-slow" />
          <div>
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="glass-input w-48"
                  placeholder="Your name"
                  onKeyDown={(e) => e.key === "Enter" && saveName()}
                />
                <Button onClick={saveName} size="sm" className="neon-glow">
                  Save
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold gradient-text">
                  {greeting}, {userName} 👋
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ready to conquer your day?
                </p>
              </>
            )}
          </div>
        </div>
        {!isEditing && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="hover-scale"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
};