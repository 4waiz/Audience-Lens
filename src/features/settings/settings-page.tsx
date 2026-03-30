"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useTheme } from "next-themes";
import { ShieldCheck, PlugZap, WandSparkles } from "lucide-react";
import { toast } from "sonner";

import { usePreferences } from "@/components/providers/preferences-provider";
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
import { StatusPill } from "@/components/status-pill";
import { AUDIENCE_OPTIONS, INPUT_LANGUAGE_OPTIONS, OUTPUT_LANGUAGE_OPTIONS } from "@/lib/constants";
import type { SessionPreferences } from "@/lib/types";

const settingsSchema = z.object({
  defaultAudience: z.enum(["executive", "client", "engineer", "newHire", "nonNative"]),
  inputLanguage: z.enum(["en-US", "ar-AE", "es-ES", "fr-FR"]),
  outputLanguage: z.enum(["en", "ar", "es", "fr"]),
  motionPreference: z.enum(["system", "reduced", "full"]),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsPage({
  providerSummary,
}: {
  providerSummary: {
    transcription: string;
    adaptation: string;
    storage: string;
    hasConfiguredProvider: boolean;
  };
}) {
  const { preferences, resetPreferences, updatePreferences } = usePreferences();
  const { theme, setTheme } = useTheme();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    values: preferences,
  });

  useEffect(() => {
    form.reset(preferences);
  }, [form, preferences]);

  function handleSave(values: SettingsFormValues) {
    updatePreferences(values as SessionPreferences);
    toast.success("Preferences saved.");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.92fr]">
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Save the defaults Common Ground should use when a session starts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-6" onSubmit={form.handleSubmit(handleSave)}>
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <div className="flex flex-wrap gap-2">
                {["light", "dark", "system"].map((option) => (
                  <Button
                    key={option}
                    onClick={() => setTheme(option)}
                    type="button"
                    variant={theme === option ? "default" : "outline"}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="defaultAudience">Default audience mode</Label>
                <Controller
                  control={form.control}
                  name="defaultAudience"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="defaultAudience">
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
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motionPreference">Motion preference</Label>
                <Controller
                  control={form.control}
                  name="motionPreference"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="motionPreference">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="reduced">Reduced</SelectItem>
                        <SelectItem value="full">Full</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="inputLanguage">Default input language</Label>
                <Controller
                  control={form.control}
                  name="inputLanguage"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="inputLanguage">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INPUT_LANGUAGE_OPTIONS.map((option) => (
                          <SelectItem key={option.code} value={option.code}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outputLanguage">Default output language</Label>
                <Controller
                  control={form.control}
                  name="outputLanguage"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="outputLanguage">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OUTPUT_LANGUAGE_OPTIONS.map((option) => (
                          <SelectItem key={option.code} value={option.code}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit">Save preferences</Button>
              <Button
                onClick={() => {
                  resetPreferences();
                  toast.success("Preferences reset.");
                }}
                type="button"
                variant="outline"
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <WandSparkles className="size-5 text-accent" />
              <div>
                <CardTitle>Provider status</CardTitle>
                <CardDescription>
                  Common Ground is fully usable in demo mode even without keys.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-[20px] border border-border bg-muted/30 p-4">
              <p className="text-sm font-medium text-foreground">Transcription</p>
              <StatusPill
                label={providerSummary.transcription}
                tone={providerSummary.transcription === "Configured" ? "success" : "accent"}
              />
            </div>
            <div className="flex items-center justify-between rounded-[20px] border border-border bg-muted/30 p-4">
              <p className="text-sm font-medium text-foreground">Adaptation</p>
              <StatusPill
                label={providerSummary.adaptation}
                tone={providerSummary.adaptation === "Configured" ? "success" : "accent"}
              />
            </div>
            <div className="flex items-center justify-between rounded-[20px] border border-border bg-muted/30 p-4">
              <p className="text-sm font-medium text-foreground">Storage</p>
              <StatusPill
                label={providerSummary.storage}
                tone={providerSummary.storage === "Database" ? "success" : "default"}
              />
            </div>
            {!providerSummary.hasConfiguredProvider ? (
              <div className="rounded-[22px] border border-accent/20 bg-accent/8 p-4 text-sm text-muted-foreground">
                No API keys are configured. Common Ground will keep using demo-safe
                transcript streaming and recap generation until providers are added.
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-success" />
              <div>
                <CardTitle>Microphone permissions</CardTitle>
                <CardDescription>
                  Common Ground asks for access only when you start a live session.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Use a secure browser context and confirm microphone access when prompted.</p>
            <p>If access is denied, you can still use the sample demo or upload flow.</p>
            <p>Original transcript lines stay visible so AI-generated output can be reviewed before sharing.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <PlugZap className="size-5 text-warning" />
              <div>
                <CardTitle>Integration placeholders</CardTitle>
                <CardDescription>
                  Space reserved for meeting, CRM, and messaging integrations.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Meeting sources: Zoom, Teams, Meet.</p>
            <p>Delivery targets: Slack, email, Notion, CRM handoff.</p>
            <p>Privacy note: in the hackathon build, session history is stored locally in the browser unless a database is configured.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
