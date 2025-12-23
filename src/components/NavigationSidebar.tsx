import { useState } from "react";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Bell, 
  Settings, 
  Menu,
  X,
  Sparkles,
  Target,
  RotateCcw,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

const navigationItems: NavigationItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, description: "Overview" },
  { id: "tasks", label: "Tasks", icon: <CheckSquare className="h-5 w-5" />, description: "Manage tasks" },
  { id: "goals", label: "Goals", icon: <Target className="h-5 w-5" />, description: "Track goals" },
  { id: "habits", label: "Habits", icon: <RotateCcw className="h-5 w-5" />, description: "Daily habits" },
  { id: "calendar", label: "Calendar", icon: <Calendar className="h-5 w-5" />, description: "Schedule" },
  { id: "bible", label: "Daily Word", icon: <BookOpen className="h-5 w-5" />, description: "Scripture" },
  { id: "notifications", label: "Alerts", icon: <Bell className="h-5 w-5" />, description: "Notifications" },
  { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" />, description: "Preferences" },
];

interface NavigationSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const NavigationSidebar = ({ activeSection, onSectionChange }: NavigationSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-card to-card/95">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold gradient-text tracking-tight">V.I.G.O</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Spark</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-1">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-12 px-4 transition-all duration-200 rounded-xl",
                activeSection === item.id
                  ? "bg-gradient-to-r from-primary/15 to-secondary/10 text-primary shadow-sm border border-primary/20"
                  : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
              )}
              onClick={() => {
                onSectionChange(item.id);
                setIsOpen(false);
              }}
            >
              <div className={cn(
                "p-1.5 rounded-lg transition-colors",
                activeSection === item.id ? "bg-primary/20" : "bg-transparent"
              )}>
                {item.icon}
              </div>
              <span className="font-medium">{item.label}</span>
            </Button>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">AI Powered</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Your intelligent productivity companion
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden rounded-xl bg-card/90 backdrop-blur-md border-border/50 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 h-screen sticky top-0 border-r border-border/50 bg-card/50 backdrop-blur-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          <aside className="fixed left-0 top-0 w-72 h-screen bg-card border-r border-border/50 z-50 lg:hidden shadow-2xl animate-fade-in">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
};