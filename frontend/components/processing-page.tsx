"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface ProcessingPageProps {
  onComplete: () => void;
}

export function ProcessingPage({ onComplete }: ProcessingPageProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Uploading media...");

  const stages = [
    { threshold: 20, message: "Uploading media..." },
    { threshold: 40, message: "Analyzing content..." },
    { threshold: 60, message: "Selecting highlights..." },
    { threshold: 80, message: "Generating video..." },
    { threshold: 95, message: "Finalizing..." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 8 + 2;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return next;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const currentStage = stages.find((stage) => progress < stage.threshold);
    if (currentStage) {
      setStatus(currentStage.message);
    } else {
      setStatus("Complete!");
    }
  }, [progress]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2">
          <img 
              src="/logo.png" 
              alt="Impact Reels logo" 
              className="w-40 h-30 rounded-lg"
            />
          <span className="font-semibold text-lg text-foreground">Impact Reels</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-secondary"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                className="text-accent transition-all duration-300"
                strokeDasharray={`${progress * 2.83} 283`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-foreground">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">{status}</h2>
            <p className="text-muted-foreground">
              This usually takes about 30 seconds
            </p>
          </div>

          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-accent animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
