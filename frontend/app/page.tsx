"use client";

import { useState } from "react";
import { LandingPage } from "@/components/landing-page";
import { UploadPage } from "@/components/upload-page";
import { ProcessingPage } from "@/components/processing-page";
import { ResultPage } from "@/components/result-page";

type AppState = "landing" | "upload" | "processing" | "result";

export default function Home() {
  const [state, setState] = useState<AppState>("landing");
  const [, setUploadedFiles] = useState<File[]>([]);
  const [, setEventDescription] = useState("");

  const handleGetStarted = () => {
    setState("upload");
  };

  const handleBack = () => {
    setState("landing");
  };

  const handleGenerate = (files: File[], description: string) => {
    setUploadedFiles(files);
    setEventDescription(description);
    setState("processing");
  };

  const handleProcessingComplete = () => {
    setState("result");
  };

  const handleRegenerate = () => {
    setState("processing");
  };

  const handleBackToUpload = () => {
    setState("upload");
  };

  return (
    <>
      {state === "landing" && <LandingPage onGetStarted={handleGetStarted} />}
      {state === "upload" && (
        <UploadPage onBack={handleBack} onGenerate={handleGenerate} />
      )}
      {state === "processing" && (
        <ProcessingPage onComplete={handleProcessingComplete} />
      )}
      {state === "result" && (
        <ResultPage onBack={handleBackToUpload} onRegenerate={handleRegenerate} />
      )}
    </>
  );
}
