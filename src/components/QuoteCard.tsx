import { useState, useEffect } from "react";
import { Quote, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface QuoteData {
  content: string;
  author: string;
}

export const QuoteCard = () => {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.quotable.io/random");
      const data = await response.json();
      setQuote({
        content: data.content,
        author: data.author,
      });
    } catch (error) {
      toast({
        title: "Failed to fetch quote",
        description: "Using a default inspirational quote",
        variant: "destructive",
      });
      setQuote({
        content: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="glass rounded-2xl p-6 space-y-4 animate-fade-in relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 rounded-lg bg-primary/10 glow-primary">
            <Quote className="w-5 h-5 text-primary" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchQuote}
            disabled={loading}
            className="rounded-full hover:bg-primary/10 transition-smooth"
          >
            <RefreshCw className={`w-4 h-4 text-primary ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {quote && (
          <div className="space-y-3">
            <p className="text-lg text-foreground leading-relaxed italic">
              "{quote.content}"
            </p>
            <p className="text-sm text-muted-foreground">— {quote.author}</p>
          </div>
        )}
      </div>
    </div>
  );
};
