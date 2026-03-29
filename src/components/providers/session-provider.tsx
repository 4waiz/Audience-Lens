"use client";

import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { SESSION_STORAGE_KEY } from "@/lib/constants";
import { DEMO_SESSION } from "@/lib/demo-data";
import { readStorage, writeStorage } from "@/lib/storage";
import type { SessionRecord } from "@/lib/types";

interface SessionsContextValue {
  sessions: SessionRecord[];
  hydrated: boolean;
  upsertSession: (session: SessionRecord) => void;
  removeSession: (id: string) => void;
  seedDemoSession: () => void;
  getSessionById: (id: string) => SessionRecord | undefined;
}

const SessionsContext = createContext<SessionsContextValue | null>(null);

function sortSessions(sessions: SessionRecord[]) {
  return [...sessions].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
}

export function SessionsProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSessions(sortSessions(readStorage<SessionRecord[]>(SESSION_STORAGE_KEY, [])));
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

    writeStorage(SESSION_STORAGE_KEY, sessions);
  }, [hydrated, sessions]);

  const upsertSession = useCallback((nextSession: SessionRecord) => {
    setSessions((current) => {
      const withoutMatch = current.filter((session) => session.id !== nextSession.id);
      return sortSessions([...withoutMatch, nextSession]);
    });
  }, []);

  const removeSession = useCallback((id: string) => {
    setSessions((current) => current.filter((session) => session.id !== id));
  }, []);

  const seedDemoSession = useCallback(() => {
    upsertSession({
      ...DEMO_SESSION,
      updatedAt: new Date().toISOString(),
    });
  }, [upsertSession]);

  const getSessionById = useCallback(
    (id: string) => sessions.find((session) => session.id === id),
    [sessions],
  );

  return (
    <SessionsContext.Provider
      value={{
        sessions,
        hydrated,
        upsertSession,
        removeSession,
        seedDemoSession,
        getSessionById,
      }}
    >
      {children}
    </SessionsContext.Provider>
  );
}

export function useSessions() {
  const context = useContext(SessionsContext);

  if (!context) {
    throw new Error("useSessions must be used within SessionsProvider");
  }

  return context;
}
