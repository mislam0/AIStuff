import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft, Upload, Sparkles, Download, Zap, Heart } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: Upload,
      title: "Upload Multiple Files",
      description:
        "Drag and drop any combination of photos and videos from your event. We support all major image and video formats so you can upload everything in one go.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Selection",
      description:
        "Our AI analyzes every piece of media you upload, identifies the most compelling moments, and selects the best content for your highlight reel.",
    },
    {
      icon: Download,
      title: "Export and Share",
      description:
        "Once your highlight video is generated, download it instantly as a high-quality MP4 file ready to share anywhere.",
    },
    {
      icon: Zap,
      title: "No Editing Skills Required",
      description:
        "You don't need any video editing experience. Simply upload your media and let the AI handle the rest.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">

      {/* HEADER */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Impact Reels logo"
              className="w-40 h-auto rounded-lg"
            />
            <span className="font-bold text-2xl md:text-3xl text-foreground">
              Impact Reels
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* BACK BUTTON */}
      <div className="container mx-auto px-4 pt-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/">
            <ArrowLeft className="w-8 h-8" />
          </Link>
        </Button>
      </div>

      {/* BACKGROUND */}
      <div className="page-background flex-1">

        <main className="container mx-auto px-4 py-12 max-w-6xl">

          <div className="space-y-12">

            {/* INTRO */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                About Impact Reels
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A free tool built to help nonprofits and community organizations
                turn event media into professional highlight videos powered by AI.
              </p>
            </div>

            {/* WHY WE BUILT THIS */}
            <div className="about-card bg-card border border-border space-y-4">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-accent" />
                </div>

                <h2 className="text-xl font-semibold text-foreground">
                  Why We Built This
                </h2>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                Nonprofits and community organizations do incredible work every day,
                but they often lack the resources or technical expertise to create
                polished video content from their events.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Impact Reels bridges that gap by providing an easy-to-use AI tool
                that transforms raw event media into shareable highlight reels —
                no editing experience required.
              </p>

            </div>

            {/* HOW IT WORKS */}
            <div className="space-y-6">

              <h2 className="text-2xl font-bold text-foreground text-center">
                How It Works
              </h2>

              <div className="about-feature-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="about-card bg-card border border-border hover:border-accent/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                      <feature.icon className="w-5 h-5 text-accent" />
                    </div>

                    <h3 className="font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}

              </div>

            </div>

            {/* CTA */}
            <div className="text-center pt-4">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/upload">Get Started</Link>
              </Button>
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