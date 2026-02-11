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
        "Our AI analyzes every piece of media you upload, identifies the most compelling moments, and intelligently selects the best content to feature in your highlight reel.",
    },
    {
      icon: Download,
      title: "Export and Share",
      description:
        "Once your highlight video is generated, download it instantly as a high-quality MP4 file ready to share on social media, in presentations, or with your community.",
    },
    {
      icon: Zap,
      title: "No Editing Skills Required",
      description:
        "You don't need any video editing experience. Simply upload your media, add an optional description, and let the AI handle the rest. It's that simple.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
              <Link href="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <img
              src="/logo.png"
              alt="Impact Reels logo"
              className="w-40 h-30 rounded-lg"
            />
            <span className="font-bold text-2xl md:text-3xl text-foreground">
              Impact Reels
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-16 max-w-3xl">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
              About Impact Reels
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              A free tool built to help nonprofits and community organizations
              turn their event media into professional highlight videos, powered
              by AI.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Why We Built This
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Nonprofits and community organizations do incredible work every
              day, but they often lack the resources or technical expertise to
              create polished video content from their events. Impact Reels
              bridges that gap by providing an easy-to-use, AI-powered tool that
              transforms raw event media into shareable highlight reels -- no
              editing experience needed.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether it is a charity fundraiser, a volunteer appreciation day,
              or a community picnic, Impact Reels helps you capture and share the
              moments that matter most.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-xl bg-card border border-border hover:border-accent/50 transition-colors"
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

          <div className="p-6 rounded-xl bg-card border border-border space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              The Process
            </h2>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold text-sm">
                  1
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Upload your media</strong>{" "}
                  -- drag and drop photos and videos from your event into the
                  upload area.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold text-sm">
                  2
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">
                    AI generates your highlights
                  </strong>{" "}
                  -- our AI analyzes your content, selects the best moments, and
                  assembles a cohesive highlight reel.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold text-sm">
                  3
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Download and share</strong>{" "}
                  -- preview your video and download it as a high-quality MP4
                  ready to share anywhere.
                </p>
              </li>
            </ol>
          </div>

          <div className="text-center pt-4">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/">Get Started</Link>
            </Button>
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
