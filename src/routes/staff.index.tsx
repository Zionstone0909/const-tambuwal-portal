import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PortalHeader } from "@/components/PortalHeader";
import { Briefcase, Lock, ShieldCheck } from "lucide-react";
import crest from "@/assets/cons-tambuwal-logo.png";
import { useStaffSession, deriveStaffName } from "@/lib/staff-session";

export const Route = createFileRoute("/staff/")({
  head: () => ({
    meta: [
      { title: "Staff Login — College of Nursing Sciences, Tambuwal" },
      {
        name: "description",
        content:
          "Sign in to the CONS Tambuwal Staff Portal with your Staff ID and password.",
      },
      { property: "og:title", content: "Staff Portal — CONS Tambuwal" },
      {
        property: "og:description",
        content:
          "Staff access to course management, student records and academic administration.",
      },
      { property: "og:image", content: "/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
  }),
  component: StaffLoginPage,
});

const loginSchema = z.object({
  staffId: z
    .string()
    .trim()
    .nonempty({ message: "Staff ID is required" })
    .min(3, { message: "Must be at least 3 characters" })
    .max(50, { message: "Must be less than 50 characters" })
    .regex(/^[A-Za-z0-9/-]+$/, {
      message: "Only letters, numbers, / and - are allowed",
    }),
  password: z
    .string()
    .nonempty({ message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must be less than 100 characters" }),
  department: z.string().min(1),
});

type LoginValues = z.infer<typeof loginSchema>;

function StaffLoginPage() {
  const navigate = useNavigate({ from: "/staff/" });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      staffId: "",
      password: "",
      department: "General Nursing Sciences",
    },
  });

  const DEMO_STAFF = "STAFF/CONS/001";
  const DEMO_PASSWORD = "akanni";

  const signIn = useStaffSession((s) => s.signIn);
  const findAccount = useStaffSession((s) => s.findAccount);

  const onSubmit = async (values: LoginValues) => {
    await new Promise((r) => setTimeout(r, 400));

    const id = values.staffId.trim();

    const isDemo =
      id.toLowerCase() === DEMO_STAFF.toLowerCase() &&
      values.password === DEMO_PASSWORD;
    const registered = findAccount(id, values.password);

    if (!isDemo && !registered) {
      setError("root", {
        type: "server",
        message: `Invalid credentials. Use the demo account "${DEMO_STAFF}" / "${DEMO_PASSWORD}", or register a new staff account.`,
      });
      return;
    }

    if (registered) {
      signIn({
        staffId: registered.staffId,
        name: registered.name,
        title: registered.title,
        department: registered.department,
        email: registered.email,
      });
    } else {
      const { name, title } = deriveStaffName(id);
      signIn({
        staffId: id,
        name,
        title,
        department: values.department,
        email: `${id.replace(/[\/\-]/g, ".").toLowerCase()}@cons-tambuwal.edu.ng`,
      });
    }

    await navigate({ to: "/staff/dashboard" });
  };

  return (
    <main className="min-h-screen bg-background">
      <PortalHeader />
      <section className="px-4 py-10 md:py-16">
        <div className="mx-auto w-full max-w-md">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elegant)]">
            {/* Distinct staff header — gold band instead of primary */}
            <div className="flex items-center gap-3 bg-gold px-6 py-5 text-primary">
              <img
                src={crest}
                alt="CONS Tambuwal crest"
                className="h-12 w-12 shrink-0 object-contain"
              />
              <div className="leading-tight">
                <p className="font-display text-base font-extrabold md:text-lg">
                  College of Nursing Sciences, Tambuwal
                </p>
                <p className="text-primary/80 text-sm font-semibold">
                  Staff Portal
                </p>
              </div>
            </div>

            <div className="px-6 py-8">
              <div className="mb-4 flex items-center justify-center gap-2">
                <ShieldCheck className="h-5 w-5 text-gold" />
                <h1 className="text-center font-display text-2xl font-extrabold text-primary">
                  Staff Sign In
                </h1>
              </div>
              <p className="mb-6 text-center text-xs text-muted-foreground">
                Demo: <span className="font-mono text-primary">{DEMO_STAFF}</span> /{" "}
                <span className="font-mono text-primary">{DEMO_PASSWORD}</span>
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div>
                  <label htmlFor="staffId" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Staff ID
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="staffId"
                      type="text"
                      autoComplete="username"
                      aria-invalid={!!errors.staffId}
                      placeholder="e.g. STAFF/CONS/001"
                      {...register("staffId")}
                      className={`w-full rounded-md border bg-muted/40 py-3 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                        errors.staffId
                          ? "border-destructive focus:ring-destructive/40"
                          : "border-border focus:ring-gold/50"
                      }`}
                    />
                  </div>
                  {errors.staffId && (
                    <p className="mt-1.5 text-xs text-destructive">{errors.staffId.message}</p>
                  )}
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Password
                    </label>
                    <Link
                      to="/staff/forgot-password"
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      aria-invalid={!!errors.password}
                      placeholder="Password"
                      {...register("password")}
                      className={`w-full rounded-md border bg-muted/40 py-3 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                        errors.password
                          ? "border-destructive focus:ring-destructive/40"
                          : "border-border focus:ring-gold/50"
                      }`}
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="department" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Department
                  </label>
                  <select
                    id="department"
                    {...register("department")}
                    className="w-full rounded-md border border-border bg-muted/40 px-3 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                  >
                    <option value="General Nursing Sciences">General Nursing Sciences</option>
                    <option value="Midwifery">Midwifery</option>
                    <option value="Public Health Nursing">Public Health Nursing</option>
                    <option value="Mental Health & Psychiatric Nursing">Mental Health &amp; Psychiatric Nursing</option>
                    <option value="Paediatric Nursing">Paediatric Nursing</option>
                    <option value="Community Health Nursing">Community Health Nursing</option>
                    <option value="Maternal & Child Health">Maternal &amp; Child Health</option>
                    <option value="Medical-Surgical Nursing">Medical-Surgical Nursing</option>
                    <option value="Critical Care Nursing">Critical Care Nursing</option>
                    <option value="Anatomy & Physiology">Anatomy &amp; Physiology</option>
                    <option value="Pharmacology">Pharmacology</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Nursing Education & Research">Nursing Education &amp; Research</option>
                    <option value="Library & Information Services">Library &amp; Information Services</option>
                    <option value="Bursary / Finance">Bursary / Finance</option>
                    <option value="Registry">Registry</option>
                    <option value="Examinations & Records">Examinations &amp; Records</option>
                    <option value="ICT Unit">ICT Unit</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>

                {errors.root && (
                  <p
                    role="alert"
                    className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive"
                  >
                    {errors.root.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-primary px-8 py-3 font-display font-bold uppercase tracking-wide text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Signing in…" : "Sign In as Staff"}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between text-xs">
                <Link
                  to="/admission"
                  className="font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
                >
                  Student login →
                </Link>
                <Link
                  to="/"
                  className="font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
                >
                  ← Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
