"use client";

import { Button } from "@/components/ui/button";
import { Upload, Sparkles, Download, Zap } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: Upload,
      title: "Upload Multiple Files",
      description: "Drag and drop photos and videos from your event",
    },
    {
      icon: Sparkles,
      title: "AI Selection",
      description: "Our AI picks the best moments automatically",
    },
    {
      icon: Download,
      title: "Export Ready",
      description: "Download your highlight video instantly",
    },
    {
      icon: Zap,
      title: "No Skills Required",
      description: "No editing experience needed",
    },
  ];

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
            <span className="font-semibold text-lg text-foreground">Impact Reels</span>
        </div>
          <Button onClick={onGetStarted} size="sm">
            Get Started
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-muted-foreground text-sm">
            <Sparkles className="w-3 h-3" />
            <span>AI-Powered Video Generation</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground text-balance">
            Turn your media into
            <br />
            <span className="text-accent">highlight videos</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Upload your photos and videos. Our AI selects the best moments and
            creates a beautiful 30-60 second highlight reel. Perfect for
            nonprofits and community events.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={onGetStarted} className="text-lg px-8 py-6">
              Create Highlight Video
            </Button>
          </div>
        </div>

        <div className="mt-24 w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-card border border-border hover:border-accent/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 text-center">
          <p className="text-muted-foreground text-sm mb-6">How it works</p>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold text-sm">
                1
              </div>
              <span className="text-foreground">Upload media</span>
            </div>
            <div className="hidden md:block w-8 h-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <span className="text-foreground">AI generates highlights</span>
            </div>
            <div className="hidden md:block w-8 h-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <span className="text-foreground">Download video</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          Built for nonprofits and community organizations
        </div>
      </footer>
    </div>
  );
}
