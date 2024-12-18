"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Clock, CalendarDays, Sun, Sunrise, Sunset, Moon, Target, Trophy, Star } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import image1 from "@/components/client/dashboard/assets/image-1.jpg";
import image2 from "@/components/client/dashboard/assets/image-2.jpg";
import image3 from "@/components/client/dashboard/assets/image-3.jpg";

interface GreetingCardProps {
  clientName?: string;
}

export default function GreetingCard({ clientName = "User" }: GreetingCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quote, setQuote] = useState("");
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Background images array
  const backgrounds = [
    image1.src,
    image2.src,
    image3.src
  ];

  // Time and greeting utility functions
  const getTimeIcon = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 11) return <Sunrise className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />;
    if (hour >= 11 && hour < 16) return <Sun className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />;
    if (hour >= 16 && hour < 19) return <Sunset className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />;
    return <Moon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />;
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 22) return "Good Evening";
    return "Good Night";
  };

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const mobileDate = currentTime.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedName = clientName
    ? clientName.split(' ')[0]
    : "User";

  const motivationalQuotes = [
    {
      quote: "Success is not the key to happiness. Happiness is the key to success.",
      author: "Albert Schweitzer"
    },
    {
      quote: "The future depends on what you do today.",
      author: "Mahatma Gandhi"
    },
    {
      quote: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt"
    },
    {
      quote: "Success is walking from failure to failure with no loss of enthusiasm.",
      author: "Winston Churchill"
    },
    {
      quote: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    },
    {
      quote: "Your time is limited, don't waste it living someone else's life.",
      author: "Steve Jobs"
    },
    {
      quote: "Don't watch the clock; do what it does. Keep going.",
      author: "Sam Levenson"
    },
    {
      quote: "The best way to predict the future is to create it.",
      author: "Peter Drucker"
    }
  ];

  // Background carousel effect
  useEffect(() => {
    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);

    return () => clearInterval(bgInterval);
  }, []);

  // Clock update effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Quote update effect
  useEffect(() => {
    const setRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setQuote(motivationalQuotes[randomIndex].quote + " - " + motivationalQuotes[randomIndex].author);
    };

    setRandomQuote();
    const quoteTimer = setInterval(setRandomQuote, 86400000);

    return () => clearInterval(quoteTimer);
  }, []);

  return (
    <div className="relative w-full rounded-lg overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        <Image
          src={backgrounds[currentBgIndex]}
          alt="Background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/60 backdrop-blur-sm" />
      </div>

      {/* Content Card */}
      <Card className="relative bg-transparent border-0 shadow-none">
        <CardHeader className="pb-2 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
            <div className="space-y-3 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
                  {getTimeIcon()}
                </div>
                <CardTitle className="text-2xl sm:text-4xl font-bold text-white flex flex-wrap items-center gap-2">
                  <span>{getGreeting()},</span>
                  <span className="font-extrabold">{formattedName}</span>
                  <div className="relative hidden sm:block">
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 animate-pulse" />
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
                  </div>
                </CardTitle>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-white/90 bg-white/10 backdrop-blur-md rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-white" />
                  <span className="font-medium">{formattedTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-white" />
                  <span className="font-medium hidden sm:block">{formattedDate}</span>
                  <span className="font-medium sm:hidden">{mobileDate}</span>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="mt-4 p-4 sm:p-6 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
            <p className="text-sm sm:text-lg text-white/90 leading-relaxed italic">
              &quot;{quote}&quot;
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Background Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {backgrounds.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentBgIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}