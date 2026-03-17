"use client";

import VideoGallery from "./video-gallery";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft, Download, RefreshCw, Sparkles } from "lucide-react";

interface ResultPageProps {
  videoUrl: string | null;
  onBack: () => void;
  onRegenerate: () => void;
}

export function ResultPage({ videoUrl, onBack, onRegenerate }: ResultPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Impact Reels logo"
              className="w-40 h-30 rounded-lg"
            />

            <span className="font-bold text-2xl md:text-5xl text-foreground">
              Impact Reels
            </span>
          </div>

          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
         <Button variant="ghost" size="icon" onClick={onBack}>
                       <ArrowLeft className="w-8 h-8" />
                     </Button>
        <div className="space-y-8">

          {/* TITLE */}
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

          {/* VIDEO PREVIEW */}
          <div className="aspect-video bg-card border border-border rounded-xl overflow-hidden">
            {videoUrl ? (
              <video
                src={videoUrl || ""}
                controls
                autoPlay
                preload="auto"
                className="w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No preview available
              </div>
            )}
          </div>

          {/* INFO CARD */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Duration</span>
              <span className="text-foreground font-medium">~60 seconds</span>
            </div>

            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-muted-foreground">Format</span>
              <span className="text-foreground font-medium">MP4</span>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4">

            <Button size="lg" className="flex-1 text-lg py-6" asChild>
              <a href={videoUrl || "#"} download>
                <Download className="w-5 h-5 mr-2" />
                Download Video
              </a>
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
          {/* VIDEO GALLERY */}
          <div className="pt-8 border-t border-border">
            <VideoGallery />
          </div>
        </div>
      </main>
    </div>
  );
}