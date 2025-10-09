import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { WeatherWidget } from "@/components/WeatherWidget";
import { QuoteCard } from "@/components/QuoteCard";
import { TaskManager } from "@/components/TaskManager";
import { GoalManager } from "@/components/GoalManager";
import { AIInspirationButton } from "@/components/AIInspirationButton";

const Index = () => {
  const [isDark, setIsDark] = useState(true);

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

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      {/* Animated gradient background */}
      <div className="fixed inset-0 gradient-animate opacity-20 pointer-events-none" />
      
      <div className="relative z-10">
        <Header isDark={isDark} toggleTheme={toggleTheme} />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left column - Tasks and Goals */}
            <div className="lg:col-span-2 space-y-6">
              <QuoteCard />
              <TaskManager />
              <GoalManager />
              <AIInspirationButton />
            </div>

            {/* Right column - Weather and Time */}
            <div className="space-y-6">
              <WeatherWidget />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
