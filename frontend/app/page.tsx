"use client";

import { useState } from "react";
import { LandingPage } from "@/components/landing-page";
import { UploadPage } from "@/components/upload-page";
import { ProcessingPage } from "@/components/processing-page";
import { ResultPage } from "@/components/result-page";

type AppState = "landing" | "upload" | "processing" | "result";

export default function Home() {
  const [state, setState] = useState<AppState>("landing");
  const [resultVideo, setResultVideo] = useState<string | null>(null);

  const handleGetStarted = () => setState("upload");
  const handleBack = () => setState("landing");
  const handleBackToUpload = () => setState("upload");
  const handleRegenerate = () => setState("processing");

  const handleGenerate = async (files: File[], description: string) => {
    setState("processing"); // SHOW LOADER

    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("prompt", description);

      const response = await fetch("http://127.0.0.1:8000/create-highlight", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setResultVideo(data.video_url);

      setState("result"); // SHOW RESULT WHEN DONE
    } catch (error) {
      console.error(error);
      alert("Error generating highlight");
      setState("upload");
    }
  };

  return (
    <>
      {state === "landing" && <LandingPage onGetStarted={handleGetStarted} />}

      {state === "upload" && (
        <UploadPage onBack={handleBack} onGenerate={handleGenerate} />
      )}

      {state === "processing" && <ProcessingPage />}

      {state === "result" && (
        <ResultPage
          videoUrl={resultVideo}
          onBack={handleBackToUpload}
          onRegenerate={handleRegenerate}
        />
      )}
    </>
  );
}