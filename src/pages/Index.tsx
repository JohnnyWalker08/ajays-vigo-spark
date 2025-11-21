import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { WeatherWidget } from "@/components/WeatherWidget";
import { QuoteCard } from "@/components/QuoteCard";
import { TaskManager } from "@/components/TaskManager";
import { GoalManager } from "@/components/GoalManager";
import { AIInspirationButton } from "@/components/AIInspirationButton";
import { AnimatedWeatherBackground } from "@/components/AnimatedWeatherBackground";
import { GamificationTracker } from "@/components/GamificationTracker";
import { InsightsDashboard } from "@/components/InsightsDashboard";
import { BadgeNotification } from "@/components/BadgeNotification";
import { PersonalizedGreeting } from "@/components/PersonalizedGreeting";
import { MoodSelector } from "@/components/MoodSelector";
import { FocusMode } from "@/components/FocusMode";
import { DataExport } from "@/components/DataExport";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { EnhancedWeatherTips } from "@/components/EnhancedWeatherTips";
import { AIAssistant } from "@/components/AIAssistant";
import { SmartCalendar } from "@/components/SmartCalendar";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { NotificationCenter } from "@/components/NotificationCenter";
import { AlarmManager } from "@/components/AlarmManager";
import { DailyDigest } from "@/components/DailyDigest";

const Index = () => {
  const [isDark, setIsDark] = useState(true);
  const [weatherCondition, setWeatherCondition] = useState("Clear");
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    // Check for saved theme preference or default to dark
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
    // Listen for weather updates from WeatherWidget
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <PersonalizedGreeting />
              <MoodSelector />
              <QuoteCard />
              <TaskManager />
              <GoalManager />
              <InsightsDashboard />
              <AIInspirationButton />
            </div>
            <div className="space-y-6">
              <WeatherWidget />
              <EnhancedWeatherTips 
                condition={weatherCondition}
                city="Your Location"
                sunrise="6:30 AM"
                sunset="6:45 PM"
              />
              <GamificationTracker />
              <FocusMode />
              <DataExport />
            </div>
          </div>
        );
      case "tasks":
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <TaskManager />
          </div>
        );
      case "goals":
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <GoalManager />
            <InsightsDashboard />
          </div>
        );
      case "calendar":
        return (
          <div className="max-w-4xl mx-auto">
            <SmartCalendar />
          </div>
        );
      case "insights":
        return (
          <div className="max-w-5xl mx-auto space-y-6">
            <InsightsDashboard />
            <DataExport />
          </div>
        );
      case "notifications":
        return (
          <div className="max-w-5xl mx-auto space-y-6">
            <DailyDigest />
            <NotificationCenter />
            <AlarmManager />
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
      
      {/* Animated gradient background */}
      <div className="fixed inset-0 gradient-animate opacity-20 pointer-events-none z-0" />
      
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
      <div className="flex-1 relative z-10">
        <Header isDark={isDark} toggleTheme={toggleTheme} />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl lg:pl-8">
          {renderContent()}
        </main>
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
};

export default Index;
