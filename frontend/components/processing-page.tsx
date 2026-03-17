"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Progress } from "@/components/ui/progress";
import { Upload, Sparkles, Film, Download, Check, Loader2 } from "lucide-react";

const PROCESSING_STEPS = [
  {
    id: "upload",
    icon: Upload,
    title: "Uploading Media",
    description: "Transferring your files to our servers",
  },
  {
    id: "analyze",
    icon: Sparkles,
    title: "Analyzing Content",
    description: "AI is identifying the best moments",
  },
  {
    id: "generate",
    icon: Film,
    title: "Generating Video",
    description: "Creating your highlight reel",
  },
  {
    id: "finalize",
    icon: Download,
    title: "Finalizing",
    description: "Preparing your video for download",
  },
];

export function ProcessingPage() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        const increment = Math.random() * 4 + 1;
        const newProgress = Math.min(prev + increment, 95);
        
        // Update step based on progress
        if (newProgress >= 75) setCurrentStep(3);
        else if (newProgress >= 50) setCurrentStep(2);
        else if (newProgress >= 25) setCurrentStep(1);
        
        return newProgress;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const getStepStatus = (index: number) => {
    if (index < currentStep) return "complete";
    if (index === currentStep) return "active";
    return "pending";
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Impact Reels logo"
              className="w-40 h-auto rounded-lg"
            />
            <span className="font-bold text-2xl md:text-5xl text-foreground">
              Impact Reels
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <div className="page-background flex-1">
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg space-y-10">
            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Creating Your Highlight
              </h1>
              <p className="text-muted-foreground">
                This usually takes 30-60 seconds
              </p>
            </div>

            {/* Main progress circle */}
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                <svg
                  className="w-32 h-32 transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-muted/30"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-out"
                    strokeDasharray={`${progress * 2.64} 264`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Linear progress bar */}
            <div className="space-y-2">
              <Progress value={progress} className="h-2 bg-muted/30" />
            </div>

            {/* Processing steps */}
            <div className="space-y-3">
              {PROCESSING_STEPS.map((step, index) => {
                const status = getStepStatus(index);
                const StepIcon = step.icon;

                return (
                  <div
                    key={step.id}
                    className={`
                      flex items-center gap-4 p-4 rounded-xl border transition-all duration-300
                      ${status === "active" 
                        ? "bg-accent/10 border-accent shadow-sm" 
                        : status === "complete"
                          ? "bg-card border-border opacity-60"
                          : "bg-card/50 border-border/50 opacity-40"
                      }
                    `}
                  >
                    {/* Step indicator */}
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center shrink-0
                        transition-all duration-300
                        ${status === "active"
                          ? "bg-accent text-accent-foreground"
                          : status === "complete"
                            ? "bg-accent/20 text-accent"
                            : "bg-muted text-muted-foreground"
                        }
                      `}
                    >
                      {status === "complete" ? (
                        <Check className="w-5 h-5" />
                      ) : status === "active" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>

                    {/* Step text */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`
                          font-medium truncate
                          ${status === "active" 
                            ? "text-foreground" 
                            : "text-muted-foreground"
                          }
                        `}
                      >
                        {step.title}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {step.description}
                      </p>
                    </div>

                    {/* Status indicator */}
                    {status === "active" && (
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tip */}
            <p className="text-center text-sm text-muted-foreground">
              Please keep this page open while we work our magic
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
