"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft, Download, RefreshCw, Sparkles, Play } from "lucide-react";
import { useState } from "react";

interface ResultPageProps {
  onBack: () => void;
  onRegenerate: () => void;
}

export function ResultPage({ onBack, onRegenerate }: ResultPageProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <img 
              src="/logo.png" 
              alt="Impact Reels logo" 
              className="w-40 h-30 rounded-lg"
            />
            <span className="font-bold text-2xl md:text-3xl text-foreground">Impact Reels</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm mb-4">
              <Sparkles className="w-3 h-3" />
              <span>Video Ready</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Your Highlight Video
            </h1>
            <p className="text-muted-foreground">
              Preview and download your generated highlight reel
            </p>
          </div>

          <div
            className="aspect-video bg-card border border-border rounded-xl overflow-hidden relative group cursor-pointer"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <div className="absolute inset-0 bg-secondary/50 flex items-center justify-center">
              {!isPlaying ? (
                <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-accent-foreground ml-1" />
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex justify-center gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-1 bg-accent rounded-full animate-pulse"
                        style={{
                          height: `${20 + Math.random() * 30}px`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Playing preview...</p>
                </div>
              )}
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                {isPlaying && (
                  <div
                    className="h-full bg-accent animate-[progress_45s_linear_forwards]"
                    style={{
                      animation: isPlaying ? "progress 45s linear forwards" : "none",
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Duration</span>
              <span className="text-foreground font-medium">0:45</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-muted-foreground">Format</span>
              <span className="text-foreground font-medium">MP4 (1080p)</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-muted-foreground">Size</span>
              <span className="text-foreground font-medium">~12 MB</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="flex-1 text-lg py-6">
              <Download className="w-5 h-5 mr-2" />
              Download Video
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 text-lg py-6 bg-transparent"
              onClick={onRegenerate}
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Regenerate
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Not happy with the result? Try regenerating for a different edit.
          </p>
        </div>
      </main>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
