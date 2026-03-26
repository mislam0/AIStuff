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

export function ResultPage({
  videoUrl,
  onBack,
  onRegenerate,
}: ResultPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src="/logo.png"
              alt="Impact Reels logo"
              className="w-40 h-auto rounded-lg"
            />

            <span className="font-bold text-2xl md:text-5xl text-foreground truncate">
              Impact Reels
            </span>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* BACKGROUND WRAPPER */}
      <div className="page-background flex-1">
        <main className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-8 h-8" />
          </Button>

          <div className="space-y-10">
            {/* TITLE */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-muted-foreground text-sm">
                <Sparkles className="w-3 h-3" />
                <span>Video Ready</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                Your Highlight Video
              </h1>

              <p className="text-base md:text-lg text-muted-foreground">
                Preview, download, or regenerate your AI-generated highlight reel.
              </p>
            </div>

            {/* MAIN RESULT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.7fr] gap-6 items-start">
              {/* VIDEO PREVIEW */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="aspect-video bg-black">
                  {videoUrl ? (
                    <video
                      src={videoUrl}
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
              </div>

              {/* SIDE PANEL */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="text-foreground font-medium">~60 seconds</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Format</span>
                    <span className="text-foreground font-medium">MP4</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-accent font-medium">Ready</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button size="lg" className="w-full text-base py-6" asChild>
                    <a href={videoUrl || "#"} download>
                      <Download className="w-5 h-5 mr-2" />
                      Download Video
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full text-base py-6 bg-transparent hover:border-accent hover:text-accent"
                    onClick={onRegenerate}
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Regenerate
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  Not happy with the result? Regenerate for a different edit.
                </p>
              </div>
            </div>

            {/* VIDEO GALLERY */}
            <div className="pt-10 border-t border-border">
              <VideoGallery />
            </div>
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          Built for nonprofits and community organizations
        </div>
      </footer>
    </div>
  );
}