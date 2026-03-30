"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { DEFAULT_PREFERENCES, PREFERENCES_STORAGE_KEY } from "@/lib/constants";
import { readStorage, writeStorage } from "@/lib/storage";
import type { SessionPreferences } from "@/lib/types";

interface PreferencesContextValue {
  preferences: SessionPreferences;
  hydrated: boolean;
  updatePreferences: (updates: Partial<SessionPreferences>) => void;
  resetPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] =
    useState<SessionPreferences>(DEFAULT_PREFERENCES);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPreferences(readStorage(PREFERENCES_STORAGE_KEY, DEFAULT_PREFERENCES));
      setHydrated(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    writeStorage(PREFERENCES_STORAGE_KEY, preferences);
  }, [hydrated, preferences]);

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        hydrated,
        updatePreferences: (updates) =>
          setPreferences((current) => {
            const next = { ...current, ...updates };

            if (
              next.defaultAudience === current.defaultAudience &&
              next.inputLanguage === current.inputLanguage &&
              next.outputLanguage === current.outputLanguage &&
              next.motionPreference === current.motionPreference
            ) {
              return current;
            }

            return next;
          }),
        resetPreferences: () =>
          setPreferences((current) => {
            if (
              current.defaultAudience === DEFAULT_PREFERENCES.defaultAudience &&
              current.inputLanguage === DEFAULT_PREFERENCES.inputLanguage &&
              current.outputLanguage === DEFAULT_PREFERENCES.outputLanguage &&
              current.motionPreference === DEFAULT_PREFERENCES.motionPreference
            ) {
              return current;
            }

            return DEFAULT_PREFERENCES;
          }),
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }

  return context;
}
