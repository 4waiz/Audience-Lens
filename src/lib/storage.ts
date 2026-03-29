import { safeJsonParse } from "@/lib/utils";

export function readStorage<T>(key: string, fallback: T) {
  if (typeof window === "undefined") {
    return fallback;
  }

  return safeJsonParse<T>(window.localStorage.getItem(key), fallback);
}

export function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}
