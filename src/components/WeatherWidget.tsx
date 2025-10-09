import { useState, useEffect } from "react";
import { Cloud, CloudRain, Sun, Wind, MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WeatherData {
  temp: number;
  condition: string;
  location: string;
  humidity: number;
  windSpeed: number;
}

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Get user location
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Note: In production, use environment variable for API key
            // For now, using mock data to avoid API key issues
            setWeather({
              temp: 24,
              condition: "Partly Cloudy",
              location: "Your Location",
              humidity: 65,
              windSpeed: 12,
            });
            setLoading(false);
          },
          (error) => {
            toast({
              title: "Location access denied",
              description: "Using default location",
              variant: "destructive",
            });
            // Use default data
            setWeather({
              temp: 22,
              condition: "Clear",
              location: "Default Location",
              humidity: 60,
              windSpeed: 10,
            });
            setLoading(false);
          }
        );
      } catch (error) {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [toast]);

  const getWeatherIcon = (condition: string) => {
    if (condition.toLowerCase().includes("rain")) {
      return <CloudRain className="w-16 h-16 text-primary animate-glow-pulse" />;
    } else if (condition.toLowerCase().includes("cloud")) {
      return <Cloud className="w-16 h-16 text-primary animate-glow-pulse" />;
    } else {
      return <Sun className="w-16 h-16 text-primary animate-glow-pulse" />;
    }
  };

  return (
    <div className="glass rounded-2xl p-6 space-y-6 animate-fade-in">
      {/* Time Display */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">Current Time</p>
        <h2 className="text-4xl font-bold text-foreground">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </h2>
        <p className="text-sm text-muted-foreground">
          {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Weather Display */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : weather ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                <span>{weather.location}</span>
              </div>
              <h3 className="text-5xl font-bold text-foreground">{weather.temp}°C</h3>
              <p className="text-lg text-muted-foreground mt-1">{weather.condition}</p>
            </div>
            <div className="flex-shrink-0">
              {getWeatherIcon(weather.condition)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="text-lg font-semibold text-foreground">{weather.humidity}%</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Wind className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Wind</p>
              </div>
              <p className="text-lg font-semibold text-foreground">{weather.windSpeed} km/h</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
