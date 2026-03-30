"use client";

import { Mic, ShieldCheck } from "lucide-react";

import { LanguageSelect } from "@/components/language-select";
import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AUDIENCE_OPTIONS, INPUT_LANGUAGE_OPTIONS, OUTPUT_LANGUAGE_OPTIONS } from "@/lib/constants";
import type {
  AudienceMode,
  InputLanguageCode,
  OutputLanguageCode,
  PermissionState,
} from "@/lib/types";

function PermissionMessage({ state }: { state: PermissionState }) {
  if (state === "denied") {
    return (
      <div
        className="rounded-[24px] border border-danger/20 bg-danger/8 p-4"
        data-testid="permission-fallback"
      >
        <p className="text-sm font-medium text-foreground">Microphone access was denied</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Allow microphone access in your browser settings, or use the sample demo
          and upload flow instead.
        </p>
      </div>
    );
  }

  if (state === "unsupported") {
    return (
      <div
        className="rounded-[24px] border border-warning/20 bg-warning/8 p-4"
        data-testid="permission-fallback"
      >
        <p className="text-sm font-medium text-foreground">Live microphone capture is unavailable</p>
        <p className="mt-2 text-sm text-muted-foreground">
          This browser does not expose the speech-recognition APIs Common Ground
          needs for live capture. Use the sample demo or upload a recording instead.
        </p>
      </div>
    );
  }

  if (state === "no-device") {
    return (
      <div
        className="rounded-[24px] border border-warning/20 bg-warning/8 p-4"
        data-testid="permission-fallback"
      >
        <p className="text-sm font-medium text-foreground">No microphone found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Connect a microphone, then refresh this page. Until then, the sample demo
          still shows the full experience.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-border bg-muted/30 p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <ShieldCheck className="size-4 text-success" />
        Permission guidance
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Common Ground asks for microphone access only when you start a live
        session. If speech recognition is unavailable, the sample demo still shows
        the full workflow without setup.
      </p>
    </div>
  );
}

export function PreflightPanel({
  inputLanguage,
  outputLanguage,
  audience,
  permissionState,
  onInputLanguageChange,
  onOutputLanguageChange,
  onAudienceChange,
  onStart,
  onUseSampleDemo,
}: {
  inputLanguage: InputLanguageCode;
  outputLanguage: OutputLanguageCode;
  audience: AudienceMode;
  permissionState: PermissionState;
  onInputLanguageChange: (value: InputLanguageCode) => void;
  onOutputLanguageChange: (value: OutputLanguageCode) => void;
  onAudienceChange: (value: AudienceMode) => void;
  onStart: () => void;
  onUseSampleDemo: () => void;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <Card className="app-gradient">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/12 text-accent">
              <Mic className="size-5" />
            </div>
            <div>
              <CardTitle>Start a live session</CardTitle>
              <CardDescription>
                Choose the audience, confirm language defaults, then capture live
                speech if this browser supports it.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="input-language">Input language</Label>
              <LanguageSelect
                onValueChange={onInputLanguageChange}
                options={INPUT_LANGUAGE_OPTIONS}
                placeholder="Choose language"
                value={inputLanguage}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="output-language">Output language</Label>
              <LanguageSelect
                onValueChange={onOutputLanguageChange}
                options={OUTPUT_LANGUAGE_OPTIONS}
                placeholder="Choose output language"
                value={outputLanguage}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="default-audience">Default audience mode</Label>
            <Select
              onValueChange={(value) => onAudienceChange(value as AudienceMode)}
              value={audience}
            >
              <SelectTrigger id="default-audience">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AUDIENCE_OPTIONS.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={onStart}>Start session</Button>
            <Button onClick={onUseSampleDemo} variant="outline">
              Try sample demo instead
            </Button>
            <StatusPill
              label={permissionState === "idle" ? "Ready" : permissionState}
              tone={
                permissionState === "denied"
                  ? "danger"
                  : permissionState === "unsupported" ||
                      permissionState === "no-device"
                    ? "warning"
                    : "accent"
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <PermissionMessage state={permissionState} />
        <Card>
          <CardHeader>
            <CardTitle>What the judge sees</CardTitle>
            <CardDescription>
              Transcript on the left, audience adaptation on the right, then recap
              and export without leaving the workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>1. Start or use the sample feed.</p>
            <p>2. Watch the same explanation change for the selected listener.</p>
            <p>
              3. Export a recap with decisions and action items tied back to transcript
              evidence.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
