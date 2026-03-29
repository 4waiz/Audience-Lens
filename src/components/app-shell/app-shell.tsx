"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Clock3,
  FileUp,
  History,
  Home,
  PlayCircle,
  Radio,
  Settings2,
} from "lucide-react";

import { RelayLogo } from "@/components/relay-logo";
import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/live", label: "Live", icon: Radio },
  { href: "/app/demo", label: "Demo", icon: PlayCircle },
  { href: "/app/upload", label: "Upload", icon: FileUp },
  { href: "/app/history", label: "History", icon: History },
  { href: "/app/settings", label: "Settings", icon: Settings2 },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/app") {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

function getRouteHeader(pathname: string) {
  if (pathname === "/app") {
    return {
      eyebrow: "Common Ground workspace",
      title: "Demo center",
      description: "Choose the fastest path into the product.",
    };
  }

  if (pathname === "/app/demo") {
    return {
      eyebrow: "Sample demo",
      title: "Demo workspace",
      description: "Preloaded transcript, audience adaptation, and recap output.",
    };
  }

  if (pathname === "/app/live") {
    return {
      eyebrow: "Live capture",
      title: "Live workspace",
      description: "Start a real-time session with microphone preflight.",
    };
  }

  if (pathname === "/app/upload") {
    return {
      eyebrow: "Recording import",
      title: "Upload workspace",
      description: "Process an audio or video file into a structured recap.",
    };
  }

  if (pathname === "/app/history") {
    return {
      eyebrow: "Saved sessions",
      title: "History",
      description: "Search and reopen previous demos, live sessions, and uploads.",
    };
  }

  if (pathname === "/app/settings") {
    return {
      eyebrow: "Preferences",
      title: "Settings",
      description: "Defaults, permissions help, and provider status.",
    };
  }

  if (pathname.startsWith("/app/session/")) {
    return {
      eyebrow: "Session recap",
      title: "Session detail",
      description: "Traceable recap output linked back to the source transcript.",
    };
  }

  return {
    eyebrow: "Common Ground workspace",
    title: "Workspace",
    description: "Speech in, audience-ready explanation out, recap attached.",
  };
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const routeHeader = getRouteHeader(pathname);
  const isImmersiveDemo = pathname === "/app/demo";

  return (
    <div
      className={cn(
        "light-canvas min-h-screen",
        isImmersiveDemo ? "pb-8" : "page-shell flex gap-0 pb-24 md:pb-8",
      )}
    >
      {!isImmersiveDemo ? (
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-[260px] flex-col justify-between rounded-l-[32px] rounded-r-none border border-r-0 border-border bg-white/96 p-5 shadow-soft md:flex">
          <div className="space-y-8">
            <RelayLogo href="/app" />
            <nav aria-label="Primary" className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-[rgba(23,19,41,0.72)] transition hover:bg-[rgba(124,77,255,0.08)] hover:text-foreground",
                      isActive(pathname, item.href) &&
                        "bg-[rgba(124,77,255,0.12)] text-foreground shadow-[0_10px_24px_rgba(124,77,255,0.1)]",
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="space-y-4 rounded-[24px] border border-border bg-[rgba(241,236,255,0.72)] p-4">
            <StatusPill label="Guest mode" tone="accent" />
            <p className="text-sm text-[rgba(23,19,41,0.76)]">
              Demo-safe experience. Live and upload routes still work without API keys.
            </p>
            <Button asChild className="w-full" variant="outline">
              <Link href="/app/demo">Open sample workspace</Link>
            </Button>
          </div>
        </aside>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        {isImmersiveDemo ? (
          <header className="sticky top-0 z-30 border-b border-[rgba(23,19,41,0.08)] bg-[rgba(246,244,238,0.94)] backdrop-blur">
            <div className="page-shell py-4">
              <div className="flex items-center justify-between gap-4 rounded-full border border-[rgba(255,255,255,0.08)] bg-[var(--bg-dark)] px-4 py-3 shadow-[0_18px_42px_rgba(23,19,41,0.16)] sm:px-5 lg:px-6">
                <RelayLogo
                  href="/"
                  tone="dark"
                  showTagline={false}
                  className="shrink-0"
                />
                <nav
                  aria-label="Workspace"
                  className="hidden items-center gap-7 lg:flex"
                >
                  <Link
                    href="/"
                    className="text-sm font-medium text-white/78 transition hover:text-white"
                  >
                    Product
                  </Link>
                  <Link
                    href="/app/live"
                    className="text-sm font-medium text-white/78 transition hover:text-white"
                  >
                    Live
                  </Link>
                  <Link
                    href="/app/upload"
                    className="text-sm font-medium text-white/78 transition hover:text-white"
                  >
                    Upload
                  </Link>
                  <Link
                    href="/app/history"
                    className="text-sm font-medium text-white/78 transition hover:text-white"
                  >
                    History
                  </Link>
                </nav>
                <div className="flex items-center gap-3">
                  <StatusPill label="Demo-ready" tone="success" />
                  <Button asChild size="sm" className="hidden sm:inline-flex">
                    <Link href="/app/live">Start live</Link>
                  </Button>
                </div>
              </div>
            </div>
          </header>
        ) : (
          <header className="sticky top-0 z-30 grid grid-cols-1 items-center gap-3 border-b border-border bg-[rgba(246,244,238,0.97)] px-6 py-4 backdrop-blur md:grid-cols-[96px_minmax(0,1fr)_auto] md:px-8 lg:grid-cols-[128px_minmax(0,1fr)_auto] lg:px-12">
            <div aria-hidden className="hidden md:block" />
            <div className="min-w-0">
              <p className="eyebrow">{routeHeader.eyebrow}</p>
              <h1 className="truncate text-2xl font-semibold tracking-tight md:text-3xl">
                {routeHeader.title}
              </h1>
              <p className="mt-1 hidden text-sm text-[rgba(23,19,41,0.76)] md:block">
                {routeHeader.description}
              </p>
            </div>
            <div className="flex items-center gap-3 md:justify-self-end">
              <div className="hidden sm:flex">
                <StatusPill label="Demo-ready" tone="success" />
              </div>
              <Button asChild size="sm" variant="ghost" className="hidden sm:inline-flex">
                <Link href="/app/history">
                  <Clock3 className="size-4" />
                  Recent
                </Link>
              </Button>
            </div>
          </header>
        )}
        <main
          className={cn(
            "flex-1",
            isImmersiveDemo ? "page-shell py-6 sm:py-8" : "px-6 py-6 md:px-8 lg:px-12",
          )}
        >
          {children}
        </main>
      </div>

      {!isImmersiveDemo ? (
        <nav className="fixed inset-x-4 bottom-4 z-40 rounded-[28px] border border-border bg-card p-2 shadow-soft backdrop-blur md:hidden">
          <ul className="grid grid-cols-6 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex min-h-14 flex-col items-center justify-center rounded-2xl px-2 text-[11px] font-medium text-[rgba(23,19,41,0.72)] transition",
                      isActive(pathname, item.href) &&
                        "bg-[rgba(124,77,255,0.12)] text-foreground",
                    )}
                  >
                    <Icon className="mb-1 size-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
