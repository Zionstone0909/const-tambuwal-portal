import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { PortalHeader } from "@/components/PortalHeader";
import { supabase } from "@/integrations/supabase/client";
import crest from "@/assets/cons-tambuwal-logo.png";

export const Route = createFileRoute("/admission/register")({
  head: () => ({
    meta: [
      { title: "Apply for Admission — College of Nursing Sciences, Tambuwal" },
      {
        name: "description",
        content:
          "Create an applicant account to apply for admission into the College of Nursing Sciences, Tambuwal.",
      },
      {
        property: "og:title",
        content: "Apply for Admission — CONS Tambuwal",
      },
      {
        property: "og:description",
        content:
          "Register a new applicant account and start your admission application at CONS Tambuwal.",
      },
      { property: "og:image", content: "/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
  }),
  component: RegisterPage,
});

const PROGRAMMES = [
  "Basic General Nursing (RN)",
  "Basic Midwifery (RM)",
  "Post-Basic Midwifery",
  "Post-Basic Public Health Nursing",
  "Post-Basic Paediatric Nursing",
  "Post-Basic Critical Care Nursing",
];

const QUALIFICATIONS = [
  "SSCE / WAEC / NECO",
  "NCE",
  "OND / HND",
  "Diploma in Nursing (RN/RM)",
  "Bachelor's Degree",
];

const schema = z
  .object({
    surname: z
      .string()
      .trim()
      .nonempty({ message: "Surname is required" })
      .min(2, { message: "Surname must be at least 2 characters" })
      .max(60),
    firstName: z
      .string()
      .trim()
      .nonempty({ message: "First name is required" })
      .min(2)
      .max(60),
    otherName: z.string().trim().max(60).optional().or(z.literal("")),
    gender: z.enum(["Female", "Male"], {
      errorMap: () => ({ message: "Please select a gender" }),
    }),
    dateOfBirth: z
      .string()
      .nonempty({ message: "Date of birth is required" })
      .refine((v) => !Number.isNaN(Date.parse(v)), {
        message: "Enter a valid date",
      }),
    phone: z
      .string()
      .trim()
      .nonempty({ message: "Phone is required" })
      .min(7)
      .max(20)
      .regex(/^[0-9+\-\s]+$/, { message: "Only digits, +, - and spaces allowed" }),
    email: z.string().trim().toLowerCase().email().max(255),
    programmeOfInterest: z.string().min(1, { message: "Please pick a programme" }),
    priorQualification: z
      .string()
      .min(1, { message: "Please pick your highest qualification" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(72, { message: "Password must be 72 characters or fewer" }),
    confirmPassword: z.string(),
    agree: z.literal(true, {
      errorMap: () => ({ message: "You must accept the declaration" }),
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof schema>;

function RegisterPage() {
  const navigate = useNavigate({ from: "/admission/register" });
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      surname: "",
      firstName: "",
      otherName: "",
      dateOfBirth: "",
      phone: "",
      email: "",
      programmeOfInterest: "",
      priorQualification: "",
      password: "",
      confirmPassword: "",
    } as Partial<FormValues> as FormValues,
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const redirectUrl = `${window.location.origin}/admission`;

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          surname: values.surname,
          first_name: values.firstName,
          other_name: values.otherName || null,
          gender: values.gender,
          date_of_birth: values.dateOfBirth,
          phone: values.phone,
          programme_of_interest: values.programmeOfInterest,
          prior_qualification: values.priorQualification,
        },
      },
    });

    if (error) {
      const friendly = error.message.toLowerCase().includes("already")
        ? "An account with this email already exists. Try signing in instead."
        : error.message;
      setServerError(friendly);
      return;
    }

    toast.success("Application account created", {
      description:
        "Check your email to confirm your address, then sign in to complete your application.",
    });

    await navigate({ to: "/admission/apply" });
  };

  return (
    <main className="min-h-screen bg-background">
      <PortalHeader />
      <section className="px-4 py-10 md:py-14">
        <div className="mx-auto w-full max-w-2xl">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elegant)]">
            <div className="flex items-center gap-3 bg-primary px-6 py-5 text-primary-foreground">
              <img
                src={crest}
                alt="CONS Tambuwal crest"
                className="h-12 w-12 shrink-0 object-contain"
              />
              <div className="leading-tight">
                <p className="font-display text-base font-extrabold md:text-lg">
                  Apply for Admission
                </p>
                <p className="text-gold text-sm">
                  College of Nursing Sciences, Tambuwal
                </p>
              </div>
            </div>

            <div className="px-6 py-8">
              <h1 className="mb-1 font-display text-2xl font-extrabold text-primary">
                Create your applicant account
              </h1>
              <p className="mb-6 text-sm text-muted-foreground">
                Fill the form below to begin your admission application. You will
                receive a confirmation email after registration.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                <Field
                  label="Surname"
                  error={errors.surname?.message}
                  inputProps={{
                    ...register("surname"),
                    autoComplete: "family-name",
                    placeholder: "e.g. Bello",
                  }}
                />
                <Field
                  label="First Name"
                  error={errors.firstName?.message}
                  inputProps={{
                    ...register("firstName"),
                    autoComplete: "given-name",
                    placeholder: "e.g. Aisha",
                  }}
                />
                <Field
                  label="Other Name (optional)"
                  error={errors.otherName?.message}
                  inputProps={{
                    ...register("otherName"),
                    autoComplete: "additional-name",
                    placeholder: "Middle name",
                  }}
                />
                <SelectField
                  label="Gender"
                  error={errors.gender?.message}
                  selectProps={register("gender")}
                  options={["", "Female", "Male"]}
                  placeholder="Select gender"
                />
                <Field
                  label="Date of Birth"
                  error={errors.dateOfBirth?.message}
                  inputProps={{
                    ...register("dateOfBirth"),
                    type: "date",
                    autoComplete: "bday",
                  }}
                />
                <Field
                  label="Phone"
                  error={errors.phone?.message}
                  inputProps={{
                    ...register("phone"),
                    type: "tel",
                    autoComplete: "tel",
                    placeholder: "+234 800 000 0000",
                  }}
                />
                <div className="md:col-span-2">
                  <Field
                    label="Email"
                    error={errors.email?.message}
                    inputProps={{
                      ...register("email"),
                      type: "email",
                      autoComplete: "email",
                      placeholder: "you@example.com",
                    }}
                  />
                </div>
                <SelectField
                  label="Programme of Interest"
                  error={errors.programmeOfInterest?.message}
                  selectProps={register("programmeOfInterest")}
                  options={["", ...PROGRAMMES]}
                  placeholder="Select programme"
                />
                <SelectField
                  label="Highest Qualification"
                  error={errors.priorQualification?.message}
                  selectProps={register("priorQualification")}
                  options={["", ...QUALIFICATIONS]}
                  placeholder="Select qualification"
                />
                <Field
                  label="Password"
                  error={errors.password?.message}
                  inputProps={{
                    ...register("password"),
                    type: "password",
                    autoComplete: "new-password",
                    placeholder: "At least 8 characters",
                  }}
                />
                <Field
                  label="Confirm Password"
                  error={errors.confirmPassword?.message}
                  inputProps={{
                    ...register("confirmPassword"),
                    type: "password",
                    autoComplete: "new-password",
                    placeholder: "Re-enter password",
                  }}
                />

                <div className="md:col-span-2">
                  <label className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      {...register("agree")}
                      className="mt-1 h-4 w-4 rounded border-border accent-primary"
                    />
                    <span className="text-muted-foreground">
                      I confirm the information provided is accurate and I
                      consent to its use for processing my admission application.
                    </span>
                  </label>
                  {errors.agree && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.agree.message}
                    </p>
                  )}
                </div>

                {serverError && (
                  <div className="md:col-span-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {serverError}
                  </div>
                )}

                <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 pt-2">
                  <Link
                    to="/admission"
                    className="text-sm text-primary underline underline-offset-2 hover:text-gold"
                  >
                    Already have an account? Sign in
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-gold px-8 py-2.5 font-display font-bold uppercase tracking-wide text-primary transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Submitting…" : "Create Account"}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
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

function Field({
  label,
  error,
  inputProps,
}: {
  label: string;
  error?: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement> &
    ReturnType<ReturnType<typeof useForm<FormValues>>["register"]>;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        {...inputProps}
        aria-invalid={!!error}
        className={`w-full rounded-md border bg-muted/40 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
          error
            ? "border-destructive focus:ring-destructive/40"
            : "border-border focus:ring-primary/40"
        }`}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  error,
  selectProps,
  options,
  placeholder,
}: {
  label: string;
  error?: string;
  selectProps: ReturnType<ReturnType<typeof useForm<FormValues>>["register"]>;
  options: string[];
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <select
        {...selectProps}
        aria-invalid={!!error}
        className={`w-full rounded-md border bg-muted/40 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 ${
          error
            ? "border-destructive focus:ring-destructive/40"
            : "border-border focus:ring-primary/40"
        }`}
      >
        {options.map((opt) =>
          opt === "" ? (
            <option key="placeholder" value="">
              {placeholder}
            </option>
          ) : (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ),
        )}
      </select>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
