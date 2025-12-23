import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { WeatherWidget } from "@/components/WeatherWidget";
import { QuoteCard } from "@/components/QuoteCard";
import { TaskManager } from "@/components/TaskManager";
import { GoalManager } from "@/components/GoalManager";
import { AnimatedWeatherBackground } from "@/components/AnimatedWeatherBackground";
import { GamificationTracker } from "@/components/GamificationTracker";
import { BadgeNotification } from "@/components/BadgeNotification";
import { PersonalizedGreeting } from "@/components/PersonalizedGreeting";
import { FocusMode } from "@/components/FocusMode";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { AIAssistant } from "@/components/AIAssistant";
import { SmartCalendar } from "@/components/SmartCalendar";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { NotificationCenter } from "@/components/NotificationCenter";
import { AlarmManager } from "@/components/AlarmManager";
import { DailyDigest } from "@/components/DailyDigest";
import { Settings } from "@/components/Settings";
import { HabitTracker } from "@/components/HabitTracker";

const Index = () => {
  const [isDark, setIsDark] = useState(true);
  const [weatherCondition, setWeatherCondition] = useState("Clear");
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme ? savedTheme === "dark" : prefersDark;
    
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const handleWeatherUpdate = (event: CustomEvent) => {
      setWeatherCondition(event.detail.condition);
    };
    
    window.addEventListener("weather-update" as any, handleWeatherUpdate as EventListener);
    return () => {
      window.removeEventListener("weather-update" as any, handleWeatherUpdate as EventListener);
    };
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <PersonalizedGreeting />
            
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TaskManager />
                  <GoalManager />
                </div>
                <HabitTracker />
              </div>
              
              {/* Right Column - Widgets */}
              <div className="lg:col-span-4 space-y-6">
                <WeatherWidget />
                <QuoteCard />
                <GamificationTracker />
                <FocusMode />
              </div>
            </div>
          </div>
        );
        
      case "tasks":
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold gradient-text">Task Manager</h1>
              <p className="text-muted-foreground mt-1">Organize and track your tasks</p>
            </div>
            <TaskManager />
          </div>
        );
        
      case "goals":
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold gradient-text">Goals</h1>
              <p className="text-muted-foreground mt-1">Set and achieve your goals</p>
            </div>
            <GoalManager />
            <GamificationTracker />
          </div>
        );
        
      case "habits":
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold gradient-text">Daily Habits</h1>
              <p className="text-muted-foreground mt-1">Build consistency with daily habits</p>
            </div>
            <HabitTracker />
          </div>
        );
        
      case "calendar":
        return (
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold gradient-text">Calendar</h1>
              <p className="text-muted-foreground mt-1">Plan your schedule</p>
            </div>
            <SmartCalendar />
          </div>
        );
        
      case "bible":
        return (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold gradient-text">Daily Word</h1>
              <p className="text-muted-foreground mt-1">Start your day with God's Word</p>
            </div>
            <QuoteCard />
          </div>
        );
        
      case "notifications":
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold gradient-text">Notifications</h1>
              <p className="text-muted-foreground mt-1">Manage your alerts and reminders</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NotificationCenter />
              <div className="space-y-6">
                <AlarmManager />
                <DailyDigest />
              </div>
            </div>
          </div>
        );
        
      case "settings":
        return (
          <div className="max-w-4xl mx-auto">
            <Settings />
          </div>
        );
        
      default:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-12 text-center">
              <h2 className="text-2xl font-bold gradient-text mb-4">Coming Soon</h2>
              <p className="text-muted-foreground">This feature is under development.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 flex">
      {/* Animated weather background */}
      <AnimatedWeatherBackground condition={weatherCondition} />
      
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none z-0" />
      
      {/* Badge notifications */}
      <BadgeNotification />
      
      {/* Onboarding flow */}
      <OnboardingFlow />

      {/* Navigation Sidebar */}
      <NavigationSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
      />
      
      {/* Main Content */}
      <div className="flex-1 relative z-10 min-h-screen">
        <Header isDark={isDark} toggleTheme={toggleTheme} />
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl">
          {renderContent()}
        </main>
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
};

export default Index;