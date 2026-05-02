import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PortalHeader } from "@/components/PortalHeader";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  ChevronDown,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  GraduationCap,
  Wallet,
  ScrollText,
  Cpu,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      {
        title: "Contact Us — College of Nursing Sciences, Tambuwal",
      },
      {
        name: "description",
        content:
          "Get in touch with CONS Tambuwal: send a message, find department contacts, opening hours, location and FAQs.",
      },
      {
        property: "og:title",
        content: "Contact CONS Tambuwal",
      },
      {
        property: "og:description",
        content:
          "Reach Admissions, Bursary, Registry, ICT or the Library. Visit us, write to us, or call.",
      },
      { property: "og:image", content: "/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
  }),
  component: ContactPage,
});

/* ---------------- Data ---------------- */

const DEPARTMENTS = [
  {
    code: "ADM",
    name: "Admissions Office",
    desc: "Verification of credentials, JAMB clearance and enrolment inquiries.",
    email: "admissions@constambuwal.edu.ng",
    phone: "+234 803 123 4567",
    icon: GraduationCap,
  },
  {
    code: "BUR",
    name: "Bursary Office",
    desc: "Tuition, school fees, receipts and financial clearance.",
    email: "bursary@constambuwal.edu.ng",
    phone: "+234 803 234 5678",
    icon: Wallet,
  },
  {
    code: "REG",
    name: "Academic Registry",
    desc: "Transcripts, certificates and statement of result requests.",
    email: "registry@constambuwal.edu.ng",
    phone: "+234 803 345 6789",
    icon: ScrollText,
  },
  {
    code: "ICT",
    name: "ICT & Portal Support",
    desc: "Student & staff portal access, password resets and email.",
    email: "ict.support@constambuwal.edu.ng",
    phone: "+234 803 456 7890",
    icon: Cpu,
  },
  {
    code: "LIB",
    name: "Academic Library",
    desc: "Borrowing, e-resources and research consultations.",
    email: "library@constambuwal.edu.ng",
    phone: "+234 803 567 8901",
    icon: BookOpen,
  },
] as const;

const FAQS = [
  {
    q: "When are admission lists officially released?",
    a: "Admission lists are typically published on the College website and notice boards in the third quarter of the academic calendar. Candidates are notified by SMS to the phone number used during application.",
  },
  {
    q: "How do I request an academic transcript?",
    a: "Submit a written application addressed to the Registrar, attach proof of payment from the Bursary, and allow 10–14 working days for processing. Transcripts can be collected in person or dispatched to a verified institution.",
  },
  {
    q: "I forgot my staff or student portal password — what do I do?",
    a: "Use the “Forgot password” link on the relevant portal login page or write to ict.support@constambuwal.edu.ng with your Staff ID / Matric number for assisted reset.",
  },
  {
    q: "How can I apply for hostel accommodation?",
    a: "Hostel applications open immediately after acceptance fees are paid. Visit the Student Affairs office on the ground floor of the Administrative Block with your matriculation slip.",
  },
] as const;

const SUBJECTS = [
  "Admissions Inquiry",
  "Tuition / Bursary Matter",
  "Academic Transcript Request",
  "Portal / ICT Support",
  "Library Services",
  "Visit / Tour Request",
  "General Inquiry",
] as const;

/* ---------------- Page ---------------- */

function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PortalHeader />
      <Hero />
      <FormAndDirectory />
      <LocationPanel />
      <FAQSection />
      <VisitCTA />
    </main>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Soft blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-6 py-20 text-center md:px-12 md:py-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          We&apos;d love to hear from you
        </span>

        <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-primary md:text-6xl">
          Let&apos;s start a{" "}
          <span className="bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
            conversation
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Whether you&apos;re a prospective student, a parent, or a partner —
          our team at the College of Nursing Sciences, Tambuwal is here to help.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#message"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Send className="h-4 w-4" />
            Send a Message
          </a>
          <a
            href="mailto:info@constambuwal.edu.ng"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3 text-sm font-bold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-primary/5"
          >
            <Mail className="h-4 w-4 text-primary" />
            info@constambuwal.edu.ng
          </a>
        </div>

        {/* Quick stats */}
        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-4">
          {[
            { v: "2 days", l: "Avg. response" },
            { v: "5", l: "Departments" },
            { v: "Mon–Sat", l: "Open hours" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-2xl border border-border bg-card/70 px-4 py-4 shadow-sm backdrop-blur"
            >
              <p className="font-display text-xl font-extrabold text-primary md:text-2xl">
                {s.v}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

/* ---------------- Form + Department Directory ---------------- */

function FormAndDirectory() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: SUBJECTS[0] as string,
    department: DEPARTMENTS[0].name as string,
    message: "",
  });

  const isValid = useMemo(
    () =>
      form.name.trim().length >= 2 &&
      /\S+@\S+\.\S+/.test(form.email) &&
      form.message.trim().length >= 10,
    [form],
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setForm((f) => ({ ...f, message: "" }));
  };

  return (
    <section
      id="message"
      className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-6 py-16 md:px-12 md:py-24 lg:gap-12"
    >
      {/* Form card */}
      <div className="col-span-12 lg:col-span-7">
        <div className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-elegant)] md:p-10">
          <p className="text-xs font-bold uppercase tracking-wider text-gold">
            Send a message
          </p>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
            Tell us how we can help
          </h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            We aim to respond within{" "}
            <span className="font-semibold text-foreground">
              two working days
            </span>
            .
          </p>

          {submitted && (
            <div
              role="status"
              className="mt-6 flex items-start gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-foreground"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>
                Thanks! Your message has been received. We&apos;ll reply to{" "}
                <span className="font-semibold">{form.email}</span>.
              </span>
            </div>
          )}

          <form
            onSubmit={onSubmit}
            className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2"
            noValidate
          >
            <Field
              label="Full Name"
              id="name"
              placeholder="Aisha Bello"
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              required
            />
            <Field
              label="Email Address"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(v) => setForm((f) => ({ ...f, email: v }))}
              required
            />
            <SelectField
              label="Subject"
              id="subject"
              value={form.subject}
              onChange={(v) => setForm((f) => ({ ...f, subject: v }))}
              options={[...SUBJECTS]}
            />
            <SelectField
              label="Department"
              id="department"
              value={form.department}
              onChange={(v) => setForm((f) => ({ ...f, department: v }))}
              options={DEPARTMENTS.map((d) => d.name)}
            />
            <div className="sm:col-span-2">
              <Field
                label="Your Message"
                id="message"
                as="textarea"
                rows={5}
                placeholder="Tell us a bit more about how we can help…"
                value={form.message}
                onChange={(v) => setForm((f) => ({ ...f, message: v }))}
                required
              />
            </div>
            <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3 pt-1">
              <p className="text-xs text-muted-foreground">
                By sending you agree to our communication policy.
              </p>
              <button
                type="submit"
                disabled={!isValid}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
              >
                <Send className="h-4 w-4" />
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Directory */}
      <aside className="col-span-12 lg:col-span-5">
        <p className="text-xs font-bold uppercase tracking-wider text-gold">
          Department directory
        </p>
        <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
          Talk to the right team
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Pick the office that best matches your inquiry to get a faster
          response.
        </p>

        <div className="mt-6 grid gap-3">
          {DEPARTMENTS.map(({ code, name, desc, email, phone, icon: Icon }) => (
            <div
              key={code}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-display text-base font-bold text-primary">
                      {name}
                    </h3>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground">
                      {code}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {desc}
                  </p>
                  <div className="mt-3 flex flex-col gap-1.5 text-xs text-foreground sm:flex-row sm:flex-wrap sm:gap-x-4">
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-primary"
                    >
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      {email}
                    </a>
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-primary"
                    >
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      {phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}

/* ---------------- Location Panel ---------------- */

function LocationPanel() {
  return (
    <section className="bg-muted/30">
      <div className="mx-auto grid max-w-7xl grid-cols-12 items-center gap-10 px-6 py-16 md:px-12 md:py-24 lg:gap-14">
        <div className="order-2 col-span-12 lg:order-1 lg:col-span-7">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-elegant)]">
            <div className="relative aspect-[16/10] w-full bg-muted">
              <iframe
                title="CONS Tambuwal location map"
                src="https://www.google.com/maps?q=Tambuwal,+Sokoto+State,+Nigeria&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </div>

        <div className="order-1 col-span-12 lg:order-2 lg:col-span-5">
          <p className="text-xs font-bold uppercase tracking-wider text-gold">
            Visit us
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
            Find us in Tambuwal
          </h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            We&apos;re always happy to welcome visitors. Stop by during opening
            hours or reach out ahead of time to plan your visit.
          </p>

          <div className="mt-7 space-y-4">
            <InfoCard
              icon={MapPin}
              label="Address"
              lines={[
                "College of Nursing Sciences,",
                "Sokoto–Jega Road, Tambuwal LGA,",
                "Sokoto State, Nigeria.",
              ]}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoCard
                icon={Clock}
                label="Hours"
                lines={["Mon – Fri: 08:00 – 16:00", "Sat: 09:00 – 13:00", "Sun: Closed"]}
              />
              <InfoCard
                icon={Phone}
                label="Direct lines"
                lines={["+234 803 123 4567", "+234 701 987 6543"]}
              />
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gold">
                Official email
              </p>
              <a
                href="mailto:info@constambuwal.edu.ng"
                className="mt-1 block font-display text-lg font-bold text-primary hover:text-gold"
              >
                info@constambuwal.edu.ng
              </a>
              <div className="mt-4 flex items-center gap-2">
                <SocialLink href="#" label="Facebook" icon={Facebook} />
                <SocialLink href="#" label="Twitter" icon={Twitter} />
                <SocialLink href="#" label="LinkedIn" icon={Linkedin} />
                <SocialLink href="#" label="Instagram" icon={Instagram} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  label,
  lines,
  icon: Icon,
}: {
  label: string;
  lines: string[];
  icon: typeof MapPin;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      </div>
      <div className="space-y-0.5 text-sm leading-relaxed text-foreground">
        {lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
      </div>
    </div>
  );
}

function SocialLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof Facebook;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

/* ---------------- FAQ ---------------- */

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:px-12 md:py-24">
      <div className="mb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-gold">
          FAQs
        </p>
        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
          Quick answers
        </h2>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          The things people ask us most often.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={item.q}
              className={`rounded-2xl border bg-card transition ${
                isOpen
                  ? "border-primary/30 shadow-[var(--shadow-elegant)]"
                  : "border-border shadow-sm hover:border-primary/20"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6 md:py-5"
              >
                <span className="font-display text-base font-bold text-primary md:text-lg">
                  {item.q}
                </span>
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition ${
                    isOpen
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-0 text-sm leading-relaxed text-muted-foreground md:px-6 md:text-base">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- Visit CTA ---------------- */

function VisitCTA() {
  return (
    <section className="px-6 pb-20 md:px-12">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/90 px-8 py-14 text-primary-foreground shadow-[var(--shadow-elegant)] md:px-14 md:py-20">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />

        <div className="relative grid grid-cols-12 items-center gap-8">
          <div className="col-span-12 lg:col-span-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-xs font-semibold text-gold backdrop-blur">
              <CalendarCheck className="h-3.5 w-3.5" />
              Plan a visit
            </span>
            <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight md:text-5xl">
              Come see the campus for yourself
            </h2>
            <p className="mt-4 max-w-xl text-base text-primary-foreground/80 md:text-lg">
              Tour the lecture halls, simulation labs and library. Our team will
              gladly walk you through campus life at CONS Tambuwal.
            </p>
          </div>
          <div className="col-span-12 flex flex-wrap items-center gap-3 lg:col-span-4 lg:justify-end">
            <a
              href="mailto:info@constambuwal.edu.ng?subject=Campus%20Visit%20Request"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-bold text-primary shadow-lg transition hover:-translate-y-0.5 hover:brightness-105"
            >
              Plan Your Visit
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/admission"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-3 text-sm font-bold text-primary-foreground backdrop-blur transition hover:bg-white/10"
            >
              Apply for Admission
            </Link>
          </div>
        </div>

        <div className="relative mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/15 pt-6 text-[11px] uppercase tracking-wider text-primary-foreground/60 sm:flex-row">
          <span>College of Nursing Sciences, Tambuwal</span>
          <span>© {new Date().getFullYear()} All rights reserved</span>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Form primitives ---------------- */

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  as,
  rows,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  as?: "input" | "textarea";
  rows?: number;
}) {
  const baseClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 shadow-sm transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10";
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="mb-1.5 text-xs font-semibold text-foreground"
      >
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          id={id}
          rows={rows ?? 4}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${baseClass} resize-y`}
        />
      ) : (
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={baseClass}
        />
      )}
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="mb-1.5 text-xs font-semibold text-foreground"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3 pr-9 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
}
