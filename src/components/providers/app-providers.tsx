"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";

import { PreferencesProvider } from "@/components/providers/preferences-provider";
import { SessionsProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <PreferencesProvider>
        <SessionsProvider>
          {children}
          <Toaster
            closeButton
            position="top-right"
            richColors
            toastOptions={{
              classNames: {
                toast: "surface text-sm",
              },
            }}
          />
        </SessionsProvider>
      </PreferencesProvider>
    </ThemeProvider>
  );
}
