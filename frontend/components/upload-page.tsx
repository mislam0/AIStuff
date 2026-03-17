"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/theme-toggle";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  FileImage, 
  FileVideo, 
  Sparkles,
  ImageIcon,
  Film,
  Trash2,
  Plus
} from "lucide-react";

interface UploadPageProps {
  onBack: () => void;
  onGenerate: (files: File[], description: string) => void;
}

interface FileWithPreview {
  file: File;
  preview: string | null;
  id: string;
}

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const MAX_FILES = 20;

export function UploadPage({ onBack, onGenerate }: UploadPageProps) {
  const [filesWithPreviews, setFilesWithPreviews] = useState<FileWithPreview[]>([]);
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      filesWithPreviews.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
    };
  }, []);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const createFileWithPreview = useCallback((file: File): FileWithPreview => {
    let preview: string | null = null;
    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      preview = URL.createObjectURL(file);
    }
    return { file, preview, id: generateId() };
  }, []);

  const validateAndAddFiles = useCallback((newFiles: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of newFiles) {
      // Check file type
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        errors.push(`${file.name} is not a supported file type`);
        continue;
      }
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name} is too large (max 500MB)`);
        continue;
      }
      validFiles.push(file);
    }

    // Check total file count
    const currentCount = filesWithPreviews.length;
    const availableSlots = MAX_FILES - currentCount;
    
    if (validFiles.length > availableSlots) {
      toast.warning(`Only ${availableSlots} more files can be added (max ${MAX_FILES})`);
      validFiles.splice(availableSlots);
    }

    if (errors.length > 0) {
      toast.error("Some files couldn't be added", {
        description: errors.slice(0, 3).join(", ") + (errors.length > 3 ? "..." : ""),
      });
    }

    if (validFiles.length > 0) {
      const newFilesWithPreviews = validFiles.map(createFileWithPreview);
      setFilesWithPreviews((prev) => [...prev, ...newFilesWithPreviews]);
      toast.success(`Added ${validFiles.length} file${validFiles.length > 1 ? "s" : ""}`);
    }
  }, [filesWithPreviews.length, createFileWithPreview]);

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
    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndAddFiles(droppedFiles);
  }, [validateAndAddFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      validateAndAddFiles(selectedFiles);
      e.target.value = ""; // Reset input
    }
  }, [validateAndAddFiles]);

  const removeFile = useCallback((id: string) => {
    setFilesWithPreviews((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const clearAllFiles = useCallback(() => {
    filesWithPreviews.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    setFilesWithPreviews([]);
    toast.info("All files cleared");
  }, [filesWithPreviews]);

  // Calculate stats
  const stats = useMemo(() => {
    const images = filesWithPreviews.filter((f) => f.file.type.startsWith("image/")).length;
    const videos = filesWithPreviews.filter((f) => f.file.type.startsWith("video/")).length;
    const totalSize = filesWithPreviews.reduce((acc, f) => acc + f.file.size, 0);
    return { images, videos, totalSize };
  }, [filesWithPreviews]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  };

  const files = filesWithPreviews.map((f) => f.file);

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
          <ThemeToggle />
        </div>
      </header>

      {/* Background */}
      <div className="page-background flex-1">
        <main className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Back button */}
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer mb-4"
            onClick={onBack}
          >
            <ArrowLeft className="w-8 h-8" />
          </Button>

          <div className="space-y-6">
            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Upload Your Media
              </h1>
              <p className="text-muted-foreground">
                Add photos and videos from your event (max {MAX_FILES} files)
              </p>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-xl p-8 md:p-12 text-center transition-all cursor-pointer
                bg-card shadow-sm hover:shadow-md
                ${isDragging 
                  ? "border-accent bg-accent/10 scale-[1.02]" 
                  : "border-border hover:border-accent"
                }
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
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center transition-colors
                  ${isDragging ? "bg-accent/20" : "bg-secondary"}
                `}>
                  <Upload className={`w-8 h-8 ${isDragging ? "text-accent" : "text-muted-foreground"}`} />
                </div>

                <div>
                  <p className="font-medium text-foreground">
                    {isDragging ? "Drop files here" : "Drag and drop files here"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    or click to browse
                  </p>
                </div>

                <p className="text-xs text-muted-foreground">
                  Supports images (JPG, PNG, WebP) and videos (MP4, MOV, WebM)
                </p>
              </div>
            </div>

            {/* File previews */}
            {filesWithPreviews.length > 0 && (
              <div className="space-y-4">
                {/* Stats bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="font-medium text-foreground">
                      {filesWithPreviews.length} file{filesWithPreviews.length !== 1 && "s"}
                    </span>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      {stats.images > 0 && (
                        <span className="flex items-center gap-1">
                          <ImageIcon className="w-4 h-4" />
                          {stats.images}
                        </span>
                      )}
                      {stats.videos > 0 && (
                        <span className="flex items-center gap-1">
                          <Film className="w-4 h-4" />
                          {stats.videos}
                        </span>
                      )}
                      <span>{formatFileSize(stats.totalSize)}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFiles}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear all
                  </Button>
                </div>

                {/* Progress indicator */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Files selected</span>
                    <span>{filesWithPreviews.length} / {MAX_FILES}</span>
                  </div>
                  <Progress 
                    value={(filesWithPreviews.length / MAX_FILES) * 100} 
                    className="h-1.5 bg-muted/30"
                  />
                </div>

                {/* Grid of previews */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {filesWithPreviews.map((fileWithPreview) => (
                    <div
                      key={fileWithPreview.id}
                      className="group relative aspect-square rounded-lg overflow-hidden bg-muted border border-border"
                    >
                      {/* Preview */}
                      {fileWithPreview.file.type.startsWith("image/") && fileWithPreview.preview ? (
                        <img
                          src={fileWithPreview.preview}
                          alt={fileWithPreview.file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : fileWithPreview.file.type.startsWith("video/") && fileWithPreview.preview ? (
                        <div className="relative w-full h-full">
                          <video
                            src={fileWithPreview.preview}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <FileVideo className="w-8 h-8 text-white drop-shadow-lg" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {fileWithPreview.file.type.startsWith("video/") ? (
                            <FileVideo className="w-8 h-8 text-muted-foreground" />
                          ) : (
                            <FileImage className="w-8 h-8 text-muted-foreground" />
                          )}
                        </div>
                      )}

                      {/* Overlay with file info */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <p className="text-xs text-white truncate">
                            {fileWithPreview.file.name}
                          </p>
                          <p className="text-xs text-white/70">
                            {formatFileSize(fileWithPreview.file.size)}
                          </p>
                        </div>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(fileWithPreview.id);
                        }}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Add more button */}
                  {filesWithPreviews.length < MAX_FILES && (
                    <button
                      onClick={() => document.getElementById("file-input")?.click()}
                      className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-accent flex items-center justify-center bg-card/50 hover:bg-card transition-colors"
                    >
                      <Plus className="w-6 h-6 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Description card */}
            <div className="space-y-3 bg-card border border-border rounded-xl p-4 shadow-sm">
              <label className="text-sm font-medium text-foreground">
                Describe your event (optional)
              </label>
              <Textarea
                placeholder="e.g., Annual charity fundraiser with speeches, performances, and community activities..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-24 bg-background border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Adding a description helps our AI understand the context and create better highlights
              </p>
            </div>

            {/* Generate button */}
            <Button
              size="lg"
              className="w-full text-lg py-6 cursor-pointer transition-all hover:scale-[1.02] bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={files.length === 0}
              onClick={() => onGenerate(files, description)}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Highlight Video
              {files.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-accent-foreground/20 text-sm">
                  {files.length} file{files.length !== 1 && "s"}
                </span>
              )}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
