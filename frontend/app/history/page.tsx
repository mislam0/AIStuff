"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import VideoGallery from "@/components/video-gallery";
import { ArrowLeft, Plus, Sparkles } from "lucide-react";

export default function HistoryPage() {
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

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/">
                <Plus className="w-4 h-4 mr-1" />
                New Video
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Background */}
      <div className="page-background flex-1">
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Back button */}
          <Button
            variant="ghost"
            size="icon"
            className="mb-4"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="w-8 h-8" />
            </Link>
          </Button>

          {/* Page title */}
          <div className="text-center space-y-2 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-muted-foreground text-sm mb-4">
              <Sparkles className="w-3 h-3" />
              <span>Your Library</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-foreground">
              Video History
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              View, download, and manage all your generated highlight videos in one place
            </p>
          </div>

          {/* Video Gallery */}
          <VideoGallery showTitle={true} />
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          Built for nonprofits and community organizations
        </div>
      </footer>
    </div>
  );
}
