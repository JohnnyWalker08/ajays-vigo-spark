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

const Index = () => {
  const [isDark, setIsDark] = useState(true);
  const [weatherCondition, setWeatherCondition] = useState("Clear");

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

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      {/* Animated weather background */}
      <AnimatedWeatherBackground condition={weatherCondition} />
      
      {/* Animated gradient background */}
      <div className="fixed inset-0 gradient-animate opacity-20 pointer-events-none z-0" />
      
      {/* Badge notifications */}
      <BadgeNotification />
      
      {/* Onboarding flow */}
      <OnboardingFlow />
      
      <div className="relative z-10">
        <Header isDark={isDark} toggleTheme={toggleTheme} />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left column - Tasks and Goals */}
            <div className="lg:col-span-2 space-y-6">
              <PersonalizedGreeting />
              <MoodSelector />
              <QuoteCard />
              <TaskManager />
              <GoalManager />
              <InsightsDashboard />
              <AIInspirationButton />
            </div>

            {/* Right column - Weather, Stats, and Gamification */}
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
        </main>
      </div>
    </div>
  );
};

export default Index;
