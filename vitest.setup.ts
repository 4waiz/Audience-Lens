import React from "react";
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string | { pathname?: string };
    children: React.ReactNode;
  }) =>
    React.createElement(
      "a",
      {
        href: typeof href === "string" ? href : href?.pathname ?? "#",
        ...props,
      },
      children,
    ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/app",
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "system",
    resolvedTheme: "light",
    setTheme: vi.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: () => null,
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  value: class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
});

Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  writable: true,
  value: vi.fn(),
});
