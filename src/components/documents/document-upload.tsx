"use client";

import { useRef, useState } from "react";
import { toast } from "../ui/toast";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FileUp, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function DocumentUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleUpload = async () => {
    const file = inputRef.current?.files?.item(0);
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Nahrávání selhalo.");
      }

      toast.add({
        type: "success",
        description: "Dokument byl úspěšně nahrán.",
      });

      if (inputRef.current) inputRef.current.value = "";

      router.refresh();
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof Error ? error.message : "Nahrávání selhalo.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Input
        ref={inputRef}
        type="file"
        accept=".txt,.md,.pdf,text/plain,text/markdown,application/pdf"
        disabled={uploading}
        aria-label="Vybrat dokument"
      />

      <Button onClick={handleUpload} disabled={uploading}>
        {uploading ? <Loader2 className="animate-spin" /> : <FileUp />}
        {uploading ? "Nahrávám..." : "Nahrát dokument"}
      </Button>
    </div>
  );
}
