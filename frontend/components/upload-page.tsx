"use client";

import React from "react"

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/theme-toggle";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Upload, X, FileImage, FileVideo, Sparkles, Wand2 } from "lucide-react";

interface UploadPageProps {
  onBack: () => void;
  onGenerate: (files: File[], description: string, targetDuration: number) => void;
}

const EDITING_PRESETS = [
  { label: "Fast-paced highlights", prompt: "Create a fast-paced highlight reel with quick cuts, focusing on the most exciting and energetic moments" },
  { label: "Cinematic montage", prompt: "Create a cinematic montage with smooth transitions, focusing on visually stunning moments and emotional beats" },
  { label: "Best moments compilation", prompt: "Select and compile the best moments with high activity, interesting scenes, and audio peaks" },
  { label: "Action-focused", prompt: "Focus on high-action segments with lots of movement, scene changes, and dynamic energy" },
];

export function UploadPage({ onBack, onGenerate }: UploadPageProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [targetDuration, setTargetDuration] = useState(60);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );
    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
      );
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("video/")) {
      return <FileVideo className="w-5 h-5 text-accent" />;
    }
    return <FileImage className="w-5 h-5 text-accent" />;
  };

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
            <span className="font-bold text-2xl md:text-5xl text-foreground">Impact Reels</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
         <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-8 h-8" />
            </Button>
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Upload Your Media</h1>
            <p className="text-muted-foreground">
              Add photos and videos from your event
            </p>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer
              ${isDragging ? "border-accent bg-accent/10" : "border-border hover:border-muted-foreground"}
            `}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
              id="file-input"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Drag and drop files here
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Supports images and videos
              </p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                {files.length} file{files.length !== 1 && "s"} selected
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
                  >
                    {getFileIcon(file)}
                    <span className="flex-1 text-sm text-foreground truncate">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Editing Presets */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-accent" />
              Quick Editing Styles
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EDITING_PRESETS.map((preset, index) => (
                <Button
                  key={index}
                  variant={selectedPreset === index ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-auto py-2 px-3"
                  onClick={() => {
                    setSelectedPreset(index);
                    setDescription(preset.prompt);
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Describe how you want your video edited
            </label>
            <Textarea
              id="description"
              placeholder="e.g., Create a highlight reel focusing on the most exciting moments with quick cuts and energetic pacing..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setSelectedPreset(null);
              }}
              className="min-h-24 bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              The AI will analyze your videos and select the best segments based on your description
            </p>
          </div>

          {/* Target Duration Slider */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Target Duration: {targetDuration} seconds
            </label>
            <Slider
              value={[targetDuration]}
              onValueChange={(value) => setTargetDuration(value[0])}
              min={15}
              max={180}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>15s</span>
              <span>60s</span>
              <span>120s</span>
              <span>180s</span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full text-lg py-6"
            disabled={files.length === 0}
            onClick={() => onGenerate(files, description, targetDuration)}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate AI Highlight Video
          </Button>
        </div>
      </main>
    </div>
  );
}
