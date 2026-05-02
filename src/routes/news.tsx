import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PortalHeader } from "@/components/PortalHeader";
import { ArrowLeft, ArrowUpRight, Calendar, Search, Sparkles } from "lucide-react";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News & Updates — CONS Tambuwal" },
      {
        name: "description",
        content:
          "Latest announcements, bulletins and updates from the College of Nursing Sciences, Tambuwal.",
      },
      { property: "og:title", content: "CONS Tambuwal — News & Updates" },
      {
        property: "og:description",
        content: "Stay informed with official news from the College.",
      },
      { property: "og:image", content: "/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
  }),
  component: NewsPage,
});

type Category = "Academic" | "Admissions" | "Bursary" | "Ceremony";

const items: Array<{
  date: string;
  title: string;
  body: string;
  category: Category;
  readTime: string;
  featured?: boolean;
}> = [
  {
    date: "Oct 02, 2025",
    title: "2024/2025 Academic Session Resumption",
    body: "All returning students of the College are notified that the 2024/2025 academic session resumes on Monday, October 14. Lectures commence in earnest the following morning.",
    category: "Academic",
    readTime: "2 min",
    featured: true,
  },
  {
    date: "Sep 28, 2025",
    title: "Post-UTME Screening Results Released",
    body: "Candidates who participated in the screening exercise can now check their results on the e-portal using their application reference number.",
    category: "Admissions",
    readTime: "3 min",
  },
  {
    date: "Sep 20, 2025",
    title: "Tuition Payment Window Now Open",
    body: "The fee payment window for the new session is open. Kindly pay before the published deadline to avoid late penalty charges.",
    category: "Bursary",
    readTime: "2 min",
  },
  {
    date: "Sep 10, 2025",
    title: "Convocation Ceremony 2025",
    body: "The College's Convocation Ceremony holds in November. Graduands should confirm the spelling of their names on the portal before October 30.",
    category: "Ceremony",
    readTime: "4 min",
  },
];

const CATEGORIES: Array<"All" | Category> = [
  "All",
  "Academic",
  "Admissions",
  "Bursary",
  "Ceremony",
];

const CATEGORY_TONE: Record<Category, string> = {
  Academic: "bg-primary/10 text-primary",
  Admissions: "bg-gold/15 text-gold",
  Bursary: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Ceremony: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

function NewsPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered = useMemo(() => {
    return items.filter((n) => {
      const inCat = active === "All" || n.category === active;
      const q = query.trim().toLowerCase();
      const matches =
        q.length === 0 ||
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q);
      return inCat && matches;
    });
  }, [active, query]);

  const featured = filtered.find((n) => n.featured) ?? filtered[0];
  const rest = filtered.filter((n) => n !== featured);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <PortalHeader />

      {/* ---------------- Hero ---------------- */}
      <header className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-12 md:px-12 md:pt-28 md:pb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Fresh from the Newsroom
          </span>

          <div className="mt-6 grid grid-cols-12 items-end gap-8">
            <h1 className="col-span-12 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-primary md:text-6xl lg:col-span-8 lg:text-7xl">
              News &amp;{" "}
              <span className="bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
                Updates
              </span>
            </h1>
            <p className="col-span-12 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg lg:col-span-4">
              Official announcements, academic notices and community stories
              from CONS Tambuwal.
            </p>
          </div>

          {/* Search + categories */}
          <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search news…"
                className="w-full rounded-full border border-border bg-card pl-11 pr-4 py-3 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((c) => {
                const isActive = c === active;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setActive(c)}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "border border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* ---------------- Featured ---------------- */}
      {featured && (
        <section className="mx-auto max-w-6xl px-6 pb-12 md:px-12 md:pb-16">
          <div className="mb-6 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gold">
                Top story
              </p>
              <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
                Don&apos;t miss this
              </h2>
            </div>
          </div>

          <article className="group grid grid-cols-12 gap-0 overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-elegant)] transition hover:-translate-y-0.5 hover:shadow-xl">
            {/* Visual band */}
            <div className="relative col-span-12 h-48 overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 md:col-span-5 md:h-auto">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/30 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-10 h-48 w-48 rounded-full bg-gold/15 blur-3xl" />
              <div className="relative flex h-full flex-col justify-between p-7 text-primary-foreground md:p-10">
                <span
                  className={`inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold backdrop-blur`}
                >
                  {featured.category}
                </span>
                <div>
                  <div className="flex items-center gap-2 text-xs text-primary-foreground/70">
                    <Calendar className="h-3.5 w-3.5 text-gold" />
                    {featured.date}
                    <span className="text-gold/40">·</span>
                    {featured.readTime} read
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="col-span-12 p-7 md:col-span-7 md:p-10">
              <h3 className="font-display text-2xl font-extrabold leading-tight tracking-tight text-primary md:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {featured.body}
              </p>
              <button
                type="button"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Read full story
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </article>
        </section>
      )}

      {/* ---------------- Archive ---------------- */}
      <section className="mx-auto max-w-6xl px-6 pb-20 md:px-12 md:pb-28">
        <div className="mb-6 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gold">
              Latest
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
              Recent updates
            </h2>
          </div>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            {rest.length} {rest.length === 1 ? "article" : "articles"}
          </span>
        </div>

        {rest.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
            <p className="font-display text-lg font-bold text-primary">
              Nothing to show here yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different search term or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((n) => (
              <article
                key={n.title}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="flex items-center justify-between p-6 pb-0">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${CATEGORY_TONE[n.category]}`}
                  >
                    {n.category}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {n.readTime}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 text-gold" />
                    {n.date}
                  </div>

                  <h3 className="mt-3 font-display text-lg font-extrabold leading-snug tracking-tight text-primary group-hover:text-primary/90">
                    {n.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {n.body}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition group-hover:gap-3">
                    Read more
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <span className="text-xs text-muted-foreground">
            Published by the Registry · Tambuwal
          </span>
        </div>
      </section>
    </main>
  );
}
