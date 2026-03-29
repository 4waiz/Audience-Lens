"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { FileAudio2, FileVideo2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { useSessions } from "@/components/providers/session-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PROCESSING_STAGE_LABELS } from "@/lib/constants";
import type { ProcessingStage, SessionRecord } from "@/lib/types";

const stageOrder: ProcessingStage[] = [
  "uploading",
  "transcribing",
  "clarifying",
  "extracting",
];

const stageProgress: Record<ProcessingStage, number> = {
  idle: 0,
  uploading: 25,
  transcribing: 50,
  clarifying: 75,
  extracting: 92,
  complete: 100,
  error: 100,
};

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function UploadWorkflow() {
  const router = useRouter();
  const { upsertSession } = useSessions();
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<ProcessingStage>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dropzone = useDropzone({
    accept: {
      "audio/*": [],
      "video/*": [],
    },
    maxFiles: 1,
    onDropAccepted: (acceptedFiles) => {
      setErrorMessage(null);
      setFile(acceptedFiles[0] ?? null);
    },
    onDropRejected: () => {
      setErrorMessage("Upload failed. Choose one audio or video file and try again.");
      setStage("error");
    },
  });

  async function handleProcess() {
    if (!file) {
      setErrorMessage("Choose an audio or video recording first.");
      return;
    }

    setErrorMessage(null);

    try {
      for (const nextStage of stageOrder) {
        setStage(nextStage);
        await sleep(500);
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/process-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Processing failed");
      }

      const data = (await response.json()) as { session: SessionRecord };

      setStage("complete");
      upsertSession(data.session);
      toast.success("Recording processed.");
      router.push(`/app/session/${data.session.id}`);
    } catch {
      setStage("error");
      setErrorMessage(
        "Processing failed. The file is still selected, so you can try again.",
      );
      toast.error("Processing failed.");
    }
  }

  const isBusy = stage !== "idle" && stage !== "error" && stage !== "complete";
  const icon =
    file?.type.startsWith("video/") ? (
      <FileVideo2 className="size-6" />
    ) : (
      <FileAudio2 className="size-6" />
    );

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.88fr]">
      <Card className="app-gradient">
        <CardHeader>
          <CardTitle>Upload a recording</CardTitle>
          <CardDescription>
            Common Ground will process the file into a transcript, clearer rewrites,
            and a structured recap with decisions and action items.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div
            {...dropzone.getRootProps()}
            className={`rounded-[28px] border border-dashed p-8 text-center transition ${
              dropzone.isDragActive
                ? "border-accent bg-accent/8"
                : "border-border bg-card/70"
            }`}
          >
            <input {...dropzone.getInputProps()} />
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent/12 text-accent">
              <UploadCloud className="size-6" />
            </div>
            <p className="mt-4 text-base font-medium text-foreground">
              Drag and drop audio or video here
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Or click to choose a file. Demo mode keeps this reliable even without
              external providers.
            </p>
          </div>

          {file ? (
            <div className="rounded-[24px] border border-border bg-card/70 p-5">
              <div className="flex items-start gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-foreground">
                  {icon}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {errorMessage ? (
            <div className="rounded-[24px] border border-danger/20 bg-danger/8 p-4 text-sm text-foreground">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button disabled={!file || isBusy} onClick={handleProcess}>
              Process recording
            </Button>
            <Button
              disabled={isBusy}
              onClick={() => {
                setFile(null);
                setStage("idle");
                setErrorMessage(null);
              }}
              variant="outline"
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Processing status</CardTitle>
          <CardDescription>
            Common Ground shows a clear stage for each step instead of leaving users
            with a generic spinner.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={stageProgress[stage]} />
          <div className="space-y-3">
            {stageOrder.map((item) => {
              const active = stage === item;
              const completeItem =
                stageOrder.indexOf(item) < stageOrder.indexOf(stage as ProcessingStage) ||
                stage === "complete";

              return (
                <div
                  key={item}
                  className={`rounded-[22px] border p-4 ${
                    active
                      ? "border-accent/20 bg-accent/8"
                      : completeItem
                        ? "border-success/20 bg-success/8"
                        : "border-border bg-card/70"
                  }`}
                >
                  <p className="text-sm font-medium text-foreground">
                    {PROCESSING_STAGE_LABELS[item]}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item === "uploading" &&
                      "Receiving the file and validating that it can be processed."}
                    {item === "transcribing" &&
                      "Turning the recording into a transcript with timestamps and speakers."}
                    {item === "clarifying" &&
                      "Rewriting confusing language into clearer audience-aware drafts."}
                    {item === "extracting" &&
                      "Pulling out decisions, owners, risks, and follow-up work."}
                  </p>
                </div>
              );
            })}
          </div>
          {stage === "complete" ? (
            <div className="rounded-[22px] border border-success/20 bg-success/8 p-4 text-sm text-foreground">
              Export-ready recap complete.
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
