import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PortalHeader } from "@/components/PortalHeader";
import { User, Lock } from "lucide-react";
import crest from "@/assets/cons-tambuwal-logo.png";

export const Route = createFileRoute("/admission/")({
  head: () => ({
    meta: [
      { title: "Student Login — College of Nursing Sciences, Tambuwal" },
      {
        name: "description",
        content:
          "Sign in to the CONS Tambuwal Student Information Portal with your matric number and password.",
      },
      { property: "og:title", content: "Student Information Portal — CONS Tambuwal" },
      {
        property: "og:description",
        content: "Login to access admission, registration, results and more.",
      },
      { property: "og:image", content: "/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
  }),
  component: AdmissionLoginPage,
});

const loginSchema = z.object({
  matric: z
    .string()
    .trim()
    .nonempty({ message: "Matric/UTME number is required" })
    .min(4, { message: "Must be at least 4 characters" })
    .max(50, { message: "Must be less than 50 characters" })
    .regex(/^[A-Za-z0-9/-]+$/, {
      message: "Only letters, numbers, / and - are allowed",
    }),
  password: z
    .string()
    .nonempty({ message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must be less than 100 characters" }),
  session: z.string().min(1),
  semester: z.string().min(1),
});

type LoginValues = z.infer<typeof loginSchema>;

function AdmissionLoginPage() {
  const navigate = useNavigate({ from: "/admission/" });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      matric: "",
      password: "",
      session: "2025/2026",
      semester: "1st Semester",
    },
  });

  const DEMO_MATRIC = "CONS/2025/001";
  const DEMO_PASSWORD = "akanni";

  const onSubmit = async (values: LoginValues) => {
    await new Promise((r) => setTimeout(r, 400));

    if (
      values.matric.trim().toLowerCase() !== DEMO_MATRIC.toLowerCase() ||
      values.password !== DEMO_PASSWORD
    ) {
      setError("root", {
        type: "server",
        message: `Invalid credentials. Try matric "${DEMO_MATRIC}" with password "${DEMO_PASSWORD}".`,
      });
      return;
    }

    await navigate({
      to: "/admission/dashboard",
      search: {
        matric: values.matric.trim(),
        session: values.session,
        semester: values.semester,
        view: "home" as const,
      },
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <PortalHeader />
      <section className="px-4 py-10 md:py-16">
        <div className="mx-auto w-full max-w-md">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elegant)]">
            <div className="flex items-center gap-3 bg-primary px-6 py-5 text-primary-foreground">
              <img
                src={crest}
                alt="CONS Tambuwal crest"
                className="h-12 w-12 shrink-0 object-contain"
              />
              <div className="leading-tight">
                <p className="font-display text-base font-extrabold md:text-lg">
                  College of Nursing Sciences, Tambuwal
                </p>
                <p className="text-gold text-sm">Student Information Portal</p>
              </div>
            </div>

            <div className="px-6 py-8">
              <h1 className="mb-2 text-center font-display text-2xl font-extrabold text-primary">
                Login
              </h1>
              <p className="mb-6 text-center text-xs text-muted-foreground">
                Demo: <span className="font-mono text-primary">{DEMO_MATRIC}</span> /{" "}
                <span className="font-mono text-primary">{DEMO_PASSWORD}</span>
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div>
                  <label htmlFor="matric" className="sr-only">
                    Matric or UTME number
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="matric"
                      type="text"
                      autoComplete="username"
                      aria-invalid={!!errors.matric}
                      aria-describedby={errors.matric ? "matric-error" : undefined}
                      placeholder="Staff/Student Matric No/UTME No"
                      {...register("matric")}
                      className={`w-full rounded-md border bg-muted/40 py-3 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                        errors.matric
                          ? "border-destructive focus:ring-destructive/40"
                          : "border-border focus:ring-primary/40"
                      }`}
                    />
                  </div>
                  {errors.matric && (
                    <p id="matric-error" className="mt-1.5 text-xs text-destructive">
                      {errors.matric.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "password-error" : undefined}
                      placeholder="Password/Surname"
                      {...register("password")}
                      className={`w-full rounded-md border bg-muted/40 py-3 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                        errors.password
                          ? "border-destructive focus:ring-destructive/40"
                          : "border-border focus:ring-primary/40"
                      }`}
                    />
                  </div>
                  {errors.password && (
                    <p id="password-error" className="mt-1.5 text-xs text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <select
                  {...register("session")}
                  className="w-full rounded-md border border-border bg-muted/40 px-3 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="2025/2026">2025/2026</option>
                  <option value="2024/2025">2024/2025</option>
                  <option value="2023/2024">2023/2024</option>
                </select>

                <select
                  {...register("semester")}
                  className="w-full rounded-md border border-border bg-muted/40 px-3 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                </select>

                {errors.root && (
                  <p
                    role="alert"
                    className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive"
                  >
                    {errors.root.message}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-gold px-8 py-2.5 font-display font-bold uppercase tracking-wide text-primary transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Signing in…" : "Submit"}
                  </button>
                  <Link
                    to="/admission"
                    className="text-sm text-primary underline underline-offset-2 hover:text-gold"
                  >
                    Lost your password?
                  </Link>
                </div>
              </form>

              <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-center">
                <p className="text-xs text-muted-foreground">
                  New applicant? Don&apos;t have an account yet?
                </p>
                <Link
                  to="/admission/register"
                  className="mt-1 inline-block text-sm font-bold text-primary underline underline-offset-2 hover:text-gold"
                >
                  Apply for Admission →
                </Link>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Already registered?{" "}
                  <Link to="/admission/apply" className="font-semibold text-primary underline underline-offset-2 hover:text-gold">
                    Continue your application
                  </Link>
                </p>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
