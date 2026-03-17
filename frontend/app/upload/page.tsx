"use client";

import { UploadPage } from "@/components/upload-page";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <UploadPage
      onBack={() => router.push("/")}
      onGenerate={() => router.push("/processing")}
    />
  );
}