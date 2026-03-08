"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Loader2, Upload, Search, Sparkles, Film } from "lucide-react";

interface ProgressData {
  progress: number;
  stage: string;
  message: string;
}

const STAGE_INFO: Record<string, { icon: React.ReactNode; label: string }> = {
  idle: { icon: <Loader2 className="w-6 h-6 animate-spin" />, label: "Preparing..." },
  uploading: { icon: <Upload className="w-6 h-6" />, label: "Uploading files..." },
  analyzing: { icon: <Search className="w-6 h-6" />, label: "Analyzing videos with FFmpeg..." },
  ai_processing: { icon: <Sparkles className="w-6 h-6" />, label: "AI selecting best moments..." },
  editing: { icon: <Film className="w-6 h-6" />, label: "Creating highlight video..." },
  complete: { icon: <Film className="w-6 h-6" />, label: "Complete!" },
  error: { icon: <Loader2 className="w-6 h-6" />, label: "Error occurred" },
};

export function ProcessingPage() {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Poll the backend for real progress
    const pollProgress = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/progress");
        const data: ProgressData = await response.json();
        
        setProgress(data.progress);
        setStage(data.stage || "idle");
        setMessage(data.message || "");
      } catch (error) {
        // If backend is not reachable, show simulated progress
        setProgress((p) => (p < 95 ? p + Math.random() * 3 : p));
      }
    };

    const interval = setInterval(pollProgress, 500);
    pollProgress(); // Initial call

    return () => clearInterval(interval);
  }, []);

  const stageInfo = STAGE_INFO[stage] || STAGE_INFO.idle;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <span className="text-2xl font-bold">Impact Reels</span>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md px-4">

          <h2 className="text-xl font-semibold">
            {stageInfo.label}
          </h2>

          {/* CIRCLE LOADER */}
          <div className="relative w-32 h-32 mx-auto">
            <svg
              className="w-32 h-32 transform -rotate-90"
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
                className="text-gray-300 dark:text-gray-700"
              />

              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className="text-accent transition-all duration-300"
                strokeDasharray={`${progress * 2.83} 283`}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-accent mb-1">
                {stageInfo.icon}
              </div>
              <span className="text-lg font-bold">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Stage indicators */}
          <div className="flex justify-center gap-2">
            {["uploading", "analyzing", "ai_processing", "editing"].map((s, i) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-colors ${
                  ["uploading", "analyzing", "ai_processing", "editing", "complete"].indexOf(stage) >= i
                    ? "bg-accent"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>

          {message && (
            <p className="text-sm text-muted-foreground">
              {message}
            </p>
          )}

          <p className="text-muted-foreground">
            {stage === "ai_processing" 
              ? "Groq AI is analyzing your content and selecting the best moments..."
              : "This may take up to a minute depending on video length"
            }
          </p>

        </div>
      </main>
    </div>
  );
}
