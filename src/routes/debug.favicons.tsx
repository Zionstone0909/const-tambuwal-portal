import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/debug/favicons")({
  head: () => ({
    meta: [
      { title: "Favicon Preview — Debug" },
      { name: "description", content: "Internal preview of every favicon and app icon variant." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: FaviconDebugPage,
});

type Icon = {
  label: string;
  href: string;
  size: number;
  rendered: number;
  scheme?: "light" | "dark";
  note?: string;
};

const ICONS: Icon[] = [
  { label: "favicon.ico (multi-res)", href: "/favicon.ico", size: 48, rendered: 48, scheme: "light" },
  { label: "favicon-16x16.png", href: "/favicon-16x16.png", size: 16, rendered: 16, scheme: "light" },
  { label: "favicon-32x32.png", href: "/favicon-32x32.png", size: 32, rendered: 32, scheme: "light" },
  { label: "apple-touch-icon.png", href: "/apple-touch-icon.png", size: 180, rendered: 96, scheme: "light" },
  { label: "android-chrome-192x192.png", href: "/android-chrome-192x192.png", size: 192, rendered: 96, scheme: "light" },
  { label: "android-chrome-512x512.png", href: "/android-chrome-512x512.png", size: 512, rendered: 128, scheme: "light" },
  { label: "favicon-dark.ico", href: "/favicon-dark.ico", size: 48, rendered: 48, scheme: "dark" },
  { label: "favicon-16x16-dark.png", href: "/favicon-16x16-dark.png", size: 16, rendered: 16, scheme: "dark" },
  { label: "favicon-32x32-dark.png", href: "/favicon-32x32-dark.png", size: 32, rendered: 32, scheme: "dark" },
  { label: "apple-touch-icon-dark.png", href: "/apple-touch-icon-dark.png", size: 180, rendered: 96, scheme: "dark" },
  { label: "favicon.png (legacy)", href: "/favicon.png", size: 0, rendered: 64, note: "Original logo PNG" },
  { label: "site.webmanifest", href: "/site.webmanifest", size: 0, rendered: 0, note: "PWA manifest (JSON)" },
  { label: "og-image.jpg (1200×630)", href: "/og-image.jpg", size: 0, rendered: 200, note: "Open Graph share image" },
];

type Status = "loading" | "ok" | "missing";

function FaviconDebugPage() {
  const [statuses, setStatuses] = useState<Record<string, Status>>({});

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      ICONS.map(async (icon) => {
        try {
          const res = await fetch(icon.href, { method: "HEAD", cache: "no-store" });
          return [icon.href, res.ok ? "ok" : "missing"] as const;
        } catch {
          return [icon.href, "missing"] as const;
        }
      }),
    ).then((entries) => {
      if (cancelled) return;
      setStatuses(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const okCount = Object.values(statuses).filter((s) => s === "ok").length;
  const missingCount = Object.values(statuses).filter((s) => s === "missing").length;

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Favicon Preview</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Internal QA page. Confirms every icon URL resolves and renders correctly.
            </p>
          </div>
          <Link to="/" className="text-sm text-primary hover:underline">
            ← Back to site
          </Link>
        </div>

        <a
          href="/cons-tambuwal-icons.zip"
          download
          className="mb-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          ⬇ Download icon set (.zip)
        </a>

        <div className="mb-6 grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-md border border-border bg-card p-3">
            <div className="text-muted-foreground">Total</div>
            <div className="text-2xl font-semibold text-foreground">{ICONS.length}</div>
          </div>
          <div className="rounded-md border border-border bg-card p-3">
            <div className="text-muted-foreground">OK</div>
            <div className="text-2xl font-semibold text-green-600 dark:text-green-400">{okCount}</div>
          </div>
          <div className="rounded-md border border-border bg-card p-3">
            <div className="text-muted-foreground">Missing</div>
            <div className="text-2xl font-semibold text-destructive">{missingCount}</div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ICONS.map((icon) => {
            const status = statuses[icon.href] ?? "loading";
            const isImage = !icon.href.endsWith(".webmanifest");
            return (
              <div
                key={icon.href}
                className="flex flex-col rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-foreground">{icon.label}</span>
                  <StatusPill status={status} />
                </div>
                <div
                  className={`mt-3 flex h-44 items-center justify-center rounded-md border border-dashed border-border ${
                    icon.scheme === "dark" ? "bg-slate-900" : "bg-white"
                  }`}
                >
                  {isImage && icon.rendered > 0 ? (
                    <img
                      src={icon.href}
                      alt={icon.label}
                      width={icon.rendered}
                      height={icon.rendered}
                      style={{ width: icon.rendered, height: icon.rendered, objectFit: "contain" }}
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">No visual preview</span>
                  )}
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  {icon.size > 0 && <div>Native: {icon.size}×{icon.size}</div>}
                  {icon.note && <div>{icon.note}</div>}
                  <a
                    href={icon.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-primary hover:underline"
                  >
                    Open {icon.href}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  const cls =
    status === "ok"
      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
      : status === "missing"
        ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
        : "bg-muted text-muted-foreground";
  const label = status === "ok" ? "OK" : status === "missing" ? "Missing" : "Checking…";
  return <span className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${cls}`}>{label}</span>;
}
