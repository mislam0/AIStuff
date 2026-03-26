"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export function ProcessingPage() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p < 95 ? p + Math.random() * 6 : p));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <span className="text-2xl font-bold">Impact Reels</span>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6">

          <h2 className="text-xl font-semibold">
            Generating Highlight...
          </h2>

          {/* CIRCLE LOADER */}
          <div className="relative w-28 h-28 mx-auto">
            <svg
              className="w-28 h-28 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-300"
              />

              {/* Yellow progress */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className="text-yellow-400 transition-all duration-300"
                strokeDasharray={`${progress * 2.83} 283`}
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          <p className="text-muted-foreground">
            This may take up to 30 seconds
          </p>

        </div>
      </main>
    </div>
  );
}