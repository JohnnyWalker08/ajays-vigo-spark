import { useState, useEffect } from "react";
import { BookOpen, ExternalLink, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BibleVerse {
  text: string;
  reference: string;
  category: string;
}

const bibleVerses: BibleVerse[] = [
  {
    text: "I can do all things through Christ who strengthens me.",
    reference: "Philippians 4:13",
    category: "strength"
  },
  {
    text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    reference: "Proverbs 3:5-6",
    category: "guidance"
  },
  {
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
    reference: "Jeremiah 29:11",
    category: "hope"
  },
  {
    text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    reference: "Joshua 1:9",
    category: "courage"
  },
  {
    text: "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
    reference: "Psalm 23:1-3",
    category: "peace"
  },
  {
    text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.",
    reference: "Matthew 6:33",
    category: "priorities"
  },
  {
    text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
    reference: "Philippians 4:6-7",
    category: "peace"
  },
  {
    text: "Come to me, all you who are weary and burdened, and I will give you rest.",
    reference: "Matthew 11:28",
    category: "rest"
  },
  {
    text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
    reference: "Psalm 34:18",
    category: "comfort"
  },
  {
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    reference: "Romans 8:28",
    category: "faith"
  },
  {
    text: "Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.",
    reference: "Matthew 6:34",
    category: "peace"
  },
  {
    text: "The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.",
    reference: "Zephaniah 3:17",
    category: "love"
  },
  {
    text: "Cast all your anxiety on him because he cares for you.",
    reference: "1 Peter 5:7",
    category: "comfort"
  },
  {
    text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    reference: "Isaiah 40:31",
    category: "strength"
  },
  {
    text: "This is the day the Lord has made; let us rejoice and be glad in it.",
    reference: "Psalm 118:24",
    category: "joy"
  }
];

export const QuoteCard = () => {
  const [currentVerse, setCurrentVerse] = useState<BibleVerse>(bibleVerses[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Get daily verse based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const verseIndex = dayOfYear % bibleVerses.length;
    setCurrentVerse(bibleVerses[verseIndex]);
  }, []);

  const refreshVerse = () => {
    setIsRefreshing(true);
    const randomIndex = Math.floor(Math.random() * bibleVerses.length);
    setCurrentVerse(bibleVerses[randomIndex]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <Card className="glass-card p-6 space-y-4 hover-scale animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary glow-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Word of God</h2>
            <p className="text-xs text-muted-foreground">Daily encouragement</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={refreshVerse}
          disabled={isRefreshing}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="space-y-3">
        <p className="text-foreground leading-relaxed italic">
          "{currentVerse.text}"
        </p>
        <p className="text-sm font-medium gradient-text">
          — {currentVerse.reference}
        </p>
      </div>

      <div className="pt-2 border-t border-border/50">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full gap-2 group hover:bg-primary hover:text-primary-foreground transition-smooth"
        >
          <a 
            href="https://daily-light-aura.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <BookOpen className="h-4 w-4" />
            Get Our Bible App
            <ExternalLink className="h-3 w-3 ml-auto group-hover:translate-x-1 transition-transform" />
          </a>
        </Button>
      </div>
    </Card>
  );
};
