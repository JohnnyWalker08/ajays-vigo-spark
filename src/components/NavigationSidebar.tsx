import { useState } from "react";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Bot, 
  Bell, 
  Settings, 
  Menu,
  X,
  Sparkles,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { id: "tasks", label: "Tasks", icon: <CheckSquare className="h-5 w-5" /> },
  { id: "goals", label: "Goals", icon: <Target className="h-5 w-5" /> },
  { id: "calendar", label: "Calendar", icon: <Calendar className="h-5 w-5" /> },
  { id: "ai", label: "AI Assistant", icon: <Bot className="h-5 w-5" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="h-5 w-5" /> },
  { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
];

interface NavigationSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const NavigationSidebar = ({ activeSection, onSectionChange }: NavigationSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 glow-primary">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold gradient-text">V.I.G.O Spark</h2>
            <p className="text-xs text-muted-foreground">Productivity Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 transition-all duration-200",
                activeSection === item.id
                  ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary glow-primary"
                  : "hover:bg-muted/50"
              )}
              onClick={() => {
                onSectionChange(item.id);
                setIsOpen(false);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Button>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
          <p className="text-xs text-muted-foreground text-center">
            Powered by AI • Version 2.0
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden rounded-full bg-card/80 backdrop-blur-sm border border-border/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 h-screen sticky top-0 border-r border-border/50 bg-card/30 backdrop-blur-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          <aside className="fixed left-0 top-0 w-64 h-screen bg-card border-r border-border/50 z-50 lg:hidden shadow-2xl">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
};
