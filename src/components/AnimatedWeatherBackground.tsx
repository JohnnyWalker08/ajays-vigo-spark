import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, CloudSnow, Wind } from "lucide-react";

interface AnimatedWeatherBackgroundProps {
  condition: string;
}

export const AnimatedWeatherBackground = ({ condition }: AnimatedWeatherBackgroundProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Generate particles based on weather condition
    const particleCount = condition.toLowerCase().includes("rain") ? 50 : 
                          condition.toLowerCase().includes("snow") ? 40 : 
                          condition.toLowerCase().includes("cloud") ? 20 : 0;
    
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 2 + Math.random() * 3,
    }));
    
    setParticles(newParticles);
  }, [condition]);

  const renderParticles = () => {
    const cond = condition.toLowerCase();
    
    if (cond.includes("rain")) {
      return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-0.5 h-12 bg-gradient-to-b from-primary/60 to-transparent animate-rain"
              style={{
                left: `${particle.x}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        </div>
      );
    }
    
    if (cond.includes("snow")) {
      return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 bg-white/80 rounded-full animate-snow"
              style={{
                left: `${particle.x}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-100/10 via-transparent to-transparent dark:from-blue-900/10" />
        </div>
      );
    }
    
    if (cond.includes("cloud")) {
      return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {particles.map((particle) => (
            <Cloud
              key={particle.id}
              className="absolute text-muted-foreground/20 animate-float-cloud"
              size={60 + Math.random() * 40}
              style={{
                left: `${particle.x}%`,
                top: `${20 + Math.random() * 40}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${10 + particle.duration * 2}s`,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-muted/5 via-transparent to-transparent" />
        </div>
      );
    }
    
    if (cond.includes("clear") || cond.includes("sun")) {
      return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-20 right-20 w-40 h-40 bg-accent/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
          {/* Sun rays */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-1/4 left-3/4 w-1 h-32 bg-gradient-to-b from-accent/40 to-transparent origin-top animate-sun-ray"
              style={{
                transform: `rotate(${i * 45}deg)`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      );
    }
    
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
      </div>
    );
  };

  return renderParticles();
};