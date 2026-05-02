import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { PortalHeader } from "@/components/PortalHeader";
import {
  Briefcase,
  KeyRound,
  Lock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import crest from "@/assets/cons-tambuwal-logo.png";
import {
  STAFF_RESET_CODE,
  useStaffSession,
} from "@/lib/staff-session";

export const Route = createFileRoute("/staff/forgot-password")({
  head: () => ({
    meta: [
      {
        title: "Reset Staff Password — College of Nursing Sciences, Tambuwal",
      },
      {
        name: "description",
        content:
          "Reset the password for your CONS Tambuwal staff account using your Staff ID or email and an authorization code from the registry.",
      },
      {
        property: "og:title",
        content: "Reset Staff Password — CONS Tambuwal",
      },
      {
        property: "og:description",
        content:
          "Self-service password reset for registered CONS Tambuwal staff accounts.",
      },
      { property: "og:image", content: "/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
  }),
  component: StaffForgotPasswordPage,
});

const resetSchema = z
  .object({
    identifier: z
      .string()
      .trim()
      .nonempty({ message: "Staff ID or email is required" })
      .min(3, { message: "Must be at least 3 characters" })
      .max(120, { message: "Must be less than 120 characters" }),
    authCode: z
      .string()
      .trim()
      .nonempty({ message: "Authorization code is required" })
      .max(50),
    newPassword: z
      .string()
      .nonempty({ message: "New password is required" })
      .min(6, { message: "Password must be at least 6 characters" })
      .max(100, { message: "Password must be less than 100 characters" }),
    confirmPassword: z
      .string()
      .nonempty({ message: "Please confirm your new password" }),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ResetValues = z.infer<typeof resetSchema>;

function StaffForgotPasswordPage() {
  const navigate = useNavigate({ from: "/staff/forgot-password" });
  const findAccountByIdentifier = useStaffSession(
    (s) => s.findAccountByIdentifier,
  );
  const resetPassword = useStaffSession((s) => s.resetPassword);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    mode: "onTouched",
    defaultValues: {
      identifier: "",
      authCode: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetValues) => {
    await new Promise((r) => setTimeout(r, 400));

    if (values.authCode.trim().toUpperCase() !== STAFF_RESET_CODE) {
      setError("authCode", {
        type: "server",
        message: "Invalid authorization code. Contact the registry.",
      });
      return;
    }

    const account = findAccountByIdentifier(values.identifier);
    if (!account) {
      setError("identifier", {
        type: "server",
        message: "No registered account matches that Staff ID or email.",
      });
      return;
    }

    const result = resetPassword(values.identifier, values.newPassword);
    if (!result.ok) {
      setError("identifier", { type: "server", message: result.error });
      return;
    }

    setSuccess(
      `Password updated for ${result.staffId}. Redirecting to sign in…`,
    );
    reset();
    setTimeout(() => {
      void navigate({ to: "/staff" });
    }, 1600);
  };

  return (
    <main className="min-h-screen bg-background">
      <PortalHeader />
      <section className="px-4 py-10 md:py-16">
        <div className="mx-auto w-full max-w-md">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elegant)]">
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
                  Reset Staff Password
                </p>
              </div>
            </div>

            <div className="px-6 py-8">
              <div className="mb-4 flex items-center justify-center gap-2">
                <ShieldCheck className="h-5 w-5 text-gold" />
                <h1 className="text-center font-display text-2xl font-extrabold text-primary">
                  Forgot your password?
                </h1>
              </div>
              <p className="mb-6 text-center text-xs text-muted-foreground">
                Enter your Staff ID or email and the reset authorization code.
                Demo code:{" "}
                <span className="font-mono text-primary">
                  {STAFF_RESET_CODE}
                </span>
              </p>

              {success && (
                <div
                  role="status"
                  className="mb-5 flex items-start gap-2 rounded-md border border-gold/40 bg-gold/15 px-3 py-2.5 text-sm text-primary"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{success}</span>
                </div>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="space-y-4"
              >
                <Field
                  id="identifier"
                  label="Staff ID or Email"
                  icon={<Briefcase className="h-4 w-4" />}
                  error={errors.identifier?.message}
                  inputProps={{
                    placeholder: "e.g. STAFF/CONS/014",
                    autoComplete: "username",
                    ...register("identifier"),
                  }}
                />

                <Field
                  id="authCode"
                  label="Authorization Code"
                  icon={<KeyRound className="h-4 w-4" />}
                  error={errors.authCode?.message}
                  inputProps={{
                    placeholder: "Issued by the registry",
                    autoComplete: "off",
                    ...register("authCode"),
                  }}
                />

                <Field
                  id="newPassword"
                  label="New Password"
                  icon={<Lock className="h-4 w-4" />}
                  error={errors.newPassword?.message}
                  inputProps={{
                    type: "password",
                    placeholder: "At least 6 characters",
                    autoComplete: "new-password",
                    ...register("newPassword"),
                  }}
                />

                <Field
                  id="confirmPassword"
                  label="Confirm New Password"
                  icon={<Lock className="h-4 w-4" />}
                  error={errors.confirmPassword?.message}
                  inputProps={{
                    type: "password",
                    placeholder: "Re-enter password",
                    autoComplete: "new-password",
                    ...register("confirmPassword"),
                  }}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-primary px-8 py-3 font-display font-bold uppercase tracking-wide text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Updating password…" : "Reset Password"}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between text-xs">
                <Link
                  to="/staff"
                  className="font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
                >
                  ← Back to staff login
                </Link>
                <Link
                  to="/"
                  className="font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
                >
                  Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  id,
  label,
  icon,
  error,
  inputProps,
}: {
  id: string;
  label: string;
  icon?: React.ReactNode;
  error?: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement> &
    Record<string, unknown>;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        )}
        <input
          id={id}
          aria-invalid={!!error}
          {...inputProps}
          className={`w-full rounded-md border bg-muted/40 py-3 ${
            icon ? "pl-10" : "pl-3"
          } pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
            error
              ? "border-destructive focus:ring-destructive/40"
              : "border-border focus:ring-gold/50"
          }`}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
