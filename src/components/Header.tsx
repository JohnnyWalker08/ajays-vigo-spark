import { Moon, Sun, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const Header = ({ isDark, toggleTheme }: HeaderProps) => {
  return (
    <header className="border-b border-border/50 backdrop-blur-sm bg-card/30">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 glow-primary">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Ajayi's Planner
              </h1>
              <p className="text-xs text-muted-foreground">AI-Powered Daily Organizer</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full transition-smooth hover:bg-primary/10 hover:glow-primary"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-primary" />
            ) : (
              <Moon className="w-5 h-5 text-primary" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
