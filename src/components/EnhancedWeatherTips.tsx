import { Card } from "@/components/ui/card";
import { Lightbulb, Sunrise, Sunset } from "lucide-react";

interface WeatherTipsProps {
  condition: string;
  city: string;
  sunrise?: string;
  sunset?: string;
}

const weatherTips: Record<string, string[]> = {
  Clear: [
    "Beautiful day! Perfect for outdoor activities ☀️",
    "Don't forget sunscreen if heading out! 🧴",
    "Great weather for a productive day indoors or out! 🌞",
  ],
  Clouds: [
    "Cloudy skies - perfect focus weather ☁️",
    "Overcast day, ideal for indoor productivity ☕",
    "Cozy weather for getting things done! 🌥️",
  ],
  Rain: [
    "Rainy day - stay cozy and focused indoors 🌧️",
    "Perfect weather for deep work sessions ☔",
    "Let the rain inspire your creativity! 💧",
  ],
  Snow: [
    "Winter wonderland! Stay warm and productive ❄️",
    "Snowy day - hot drink and good vibes ☕",
    "Bundle up if you're heading out! 🧣",
  ],
  Thunderstorm: [
    "Stormy weather - stay safe indoors ⛈️",
    "Thunder outside, productivity inside! 🌩️",
    "Let the storm fuel your determination! ⚡",
  ],
};

export const EnhancedWeatherTips = ({ condition, city, sunrise, sunset }: WeatherTipsProps) => {
  const tips = weatherTips[condition] || weatherTips.Clear;
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <Card className="glass-card p-4 border-primary/20 space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Weather Insight</span>
      </div>
      <p className="text-sm text-muted-foreground">{randomTip}</p>
      
      {(sunrise || sunset) && (
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-primary/10">
          {sunrise && (
            <div className="flex items-center gap-1">
              <Sunrise className="w-3 h-3" />
              <span>{sunrise}</span>
            </div>
          )}
          {sunset && (
            <div className="flex items-center gap-1">
              <Sunset className="w-3 h-3" />
              <span>{sunset}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="text-xs text-muted-foreground pt-1">
        📍 {city}
      </div>
    </Card>
  );
};