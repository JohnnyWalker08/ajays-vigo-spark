import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const Header = ({ isDark, toggleTheme }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-30 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Left side - spacer for mobile menu */}
          <div className="w-10 lg:w-0" />
          
          {/* Center/Left - Title */}
          <div className="flex-1 lg:flex-initial">
            <h1 className="text-lg sm:text-xl font-bold text-foreground">
              Ajayi's <span className="gradient-text">Planner</span>
            </h1>
          </div>
          
          {/* Right side - Theme toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-xl h-10 w-10 hover:bg-muted transition-colors"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};