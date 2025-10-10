import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Volume2, VolumeX, Focus } from "lucide-react";
import { soundEffects } from "@/utils/soundEffects";

export const FocusMode = () => {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [ambientSound, setAmbientSound] = useState(false);
  const [stopAmbient, setStopAmbient] = useState<(() => void) | null>(null);

  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode);
    
    if (!isFocusMode) {
      document.body.classList.add("focus-mode");
    } else {
      document.body.classList.remove("focus-mode");
      if (stopAmbient) {
        stopAmbient();
        setStopAmbient(null);
        setAmbientSound(false);
      }
    }
  };

  const toggleAmbientSound = () => {
    if (!ambientSound) {
      const stop = soundEffects.playRain();
      setStopAmbient(() => stop);
      setAmbientSound(true);
    } else {
      if (stopAmbient) {
        stopAmbient();
        setStopAmbient(null);
      }
      setAmbientSound(false);
    }
  };

  return (
    <Card className="glass-card p-4 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Focus className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Focus Mode</h3>
        </div>
        <Switch
          checked={isFocusMode}
          onCheckedChange={toggleFocusMode}
        />
      </div>
      
      {isFocusMode && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-sm text-muted-foreground">
            Minimized distractions. Stay productive! 🎯
          </p>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={toggleAmbientSound}
            disabled={!isFocusMode}
          >
            {ambientSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            {ambientSound ? "Rain Sound Playing" : "Play Ambient Rain"}
          </Button>
        </div>
      )}
    </Card>
  );
};