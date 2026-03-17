"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Download, 
  Trash2, 
  Film, 
  Calendar,
  MoreVertical,
  Play,
  Pause,
  Volume2,
  VolumeX
} from "lucide-react";

type Video = {
  name: string;
  url: string;
};

interface VideoGalleryProps {
  showTitle?: boolean;
}

export default function VideoGallery({ showTitle = true }: VideoGalleryProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/videos");
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load videos", {
        description: "Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (name: string) => {
    try {
      setDeleting(name);
      await fetch(`http://127.0.0.1:8000/video?object_name=${name}`, {
        method: "DELETE",
      });
      setVideos(videos.filter((v) => v.name !== name));
      toast.success("Video deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete video", {
        description: "Please try again later.",
      });
    } finally {
      setDeleting(null);
    }
  };

  const togglePlay = (name: string) => {
    const videoEl = document.getElementById(`video-${name}`) as HTMLVideoElement;
    if (!videoEl) return;

    if (playingVideo === name) {
      videoEl.pause();
      setPlayingVideo(null);
    } else {
      // Pause any other playing videos
      if (playingVideo) {
        const prevVideo = document.getElementById(`video-${playingVideo}`) as HTMLVideoElement;
        prevVideo?.pause();
      }
      videoEl.play();
      setPlayingVideo(name);
    }
  };

  const toggleMute = (name: string) => {
    const videoEl = document.getElementById(`video-${name}`) as HTMLVideoElement;
    if (!videoEl) return;

    setMutedVideos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
        videoEl.muted = false;
      } else {
        newSet.add(name);
        videoEl.muted = true;
      }
      return newSet;
    });
  };

  const formatDate = (filename: string) => {
    // Try to extract date from filename or return generic text
    const dateMatch = filename.match(/(\d{4}[-_]?\d{2}[-_]?\d{2})/);
    if (dateMatch) {
      try {
        const dateStr = dateMatch[1].replace(/_/g, "-");
        return new Date(dateStr).toLocaleDateString();
      } catch {
        return "Recent";
      }
    }
    return "Recent";
  };

  const formatName = (filename: string) => {
    // Remove extension and clean up
    return filename
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .substring(0, 30) + (filename.length > 30 ? "..." : "");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {showTitle && (
          <div className="flex items-center gap-3">
            <Film className="w-6 h-6 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">Your Videos</h2>
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="space-y-6">
        {showTitle && (
          <div className="flex items-center gap-3">
            <Film className="w-6 h-6 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">Your Videos</h2>
          </div>
        )}
        <Card className="p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Film className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">No videos yet</p>
              <p className="text-sm text-muted-foreground">
                Your generated highlight videos will appear here
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Film className="w-6 h-6 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">Your Videos</h2>
            <span className="text-sm text-muted-foreground">({videos.length})</span>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {videos.map((video) => (
          <Card 
            key={video.name} 
            className="overflow-hidden group hover:shadow-lg transition-shadow"
          >
            {/* Video container */}
            <div className="relative aspect-video bg-black">
              <video
                id={`video-${video.name}`}
                className="w-full h-full object-contain"
                src={video.url}
                muted={mutedVideos.has(video.name)}
                loop
                playsInline
                preload="metadata"
                onEnded={() => setPlayingVideo(null)}
              />
              
              {/* Video overlay controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePlay(video.name)}
                      className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
                    >
                      {playingVideo === video.name ? (
                        <Pause className="w-5 h-5 text-black" />
                      ) : (
                        <Play className="w-5 h-5 text-black ml-0.5" />
                      )}
                    </button>
                    <button
                      onClick={() => toggleMute(video.name)}
                      className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                    >
                      {mutedVideos.has(video.name) ? (
                        <VolumeX className="w-4 h-4 text-black" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-black" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Play button overlay (when paused) */}
              {playingVideo !== video.name && (
                <div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer group-hover:opacity-0 transition-opacity"
                  onClick={() => togglePlay(video.name)}
                >
                  <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
              )}
            </div>

            {/* Card content */}
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-medium text-foreground truncate" title={video.name}>
                  {formatName(video.name)}
                </h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(video.name)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild className="flex-1" size="sm">
                  <a href={video.url} download={video.name}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={deleting === video.name}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this video?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        highlight video from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteVideo(video.name)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
