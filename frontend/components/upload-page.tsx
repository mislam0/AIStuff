"use client";

import React from "react"

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, X, FileImage, FileVideo, Sparkles } from "lucide-react";

interface UploadPageProps {
  onBack: () => void;
  onGenerate: (files: File[], description: string) => void;
}

export function UploadPage({ onBack, onGenerate }: UploadPageProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);

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
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Impact Reels logo" 
              className="w-40 h-30 rounded-lg"
            />
            <span className="font-semibold text-lg text-foreground">Impact Reels</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
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

          <div className="space-y-3">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Describe your event (optional)
            </label>
            <Textarea
              id="description"
              placeholder="e.g., Annual charity fundraiser, community picnic, volunteer appreciation day..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <Button
            size="lg"
            className="w-full text-lg py-6"
            disabled={files.length === 0}
            onClick={() => onGenerate(files, description)}
          >
            Generate Highlight Video
          </Button>
        </div>
      </main>
    </div>
  );
}
