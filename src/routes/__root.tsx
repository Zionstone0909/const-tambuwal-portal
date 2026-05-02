import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "College of Nursing Sciences, Tambuwal — E-Portal" },
      { name: "description", content: "Official electronic portal of the College of Nursing Sciences, Tambuwal, Sokoto State. Access student, staff and applicant services." },
      { name: "author", content: "College of Nursing Sciences, Tambuwal" },
      { name: "application-name", content: "CONS Tambuwal" },
      { name: "theme-color", content: "#ffffff", media: "(prefers-color-scheme: light)" },
      { name: "theme-color", content: "#0a2540", media: "(prefers-color-scheme: dark)" },
      { name: "color-scheme", content: "light dark" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "CONS Tambuwal" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "msapplication-TileColor", content: "#0a2540" },
      { name: "msapplication-TileImage", content: "/android-chrome-192x192.png" },
      { name: "format-detection", content: "telephone=no" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "CONS Tambuwal E-Portal" },
      { property: "og:locale", content: "en_NG" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico", media: "(prefers-color-scheme: light)" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png", media: "(prefers-color-scheme: light)" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png", media: "(prefers-color-scheme: light)" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png", media: "(prefers-color-scheme: light)" },
      { rel: "icon", type: "image/x-icon", href: "/favicon-dark.ico", media: "(prefers-color-scheme: dark)" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16-dark.png", media: "(prefers-color-scheme: dark)" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32-dark.png", media: "(prefers-color-scheme: dark)" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon-dark.png", media: "(prefers-color-scheme: dark)" },
      { rel: "mask-icon", href: "/favicon.png", color: "#0a2540" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
