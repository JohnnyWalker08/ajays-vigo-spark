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
      const response = await fetch("https://zenquotes.io/api/random");
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setQuote({
        content: data[0].q,
        author: data[0].a,
      });
    } catch (error) {
      // Fallback quotes
      const fallbackQuotes = [
        { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { content: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" }
      ];
      const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(randomQuote);
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
