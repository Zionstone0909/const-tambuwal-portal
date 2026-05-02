import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  GraduationCap,
  User as UserIcon,
  FileUp,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Trash2,
  FileText,
  ShieldCheck,
  CreditCard,
  Download,
  Receipt as ReceiptIcon,
} from "lucide-react";
import { PortalHeader } from "@/components/PortalHeader";
import { supabase } from "@/integrations/supabase/client";
import { PaystackCheckoutModal } from "@/components/PaystackCheckoutModal";
import { downloadReceiptPDF } from "@/lib/receipt-pdf";
import crest from "@/assets/cons-tambuwal-logo.png";

const APPLICATION_FEE_NGN = 10000;

export const Route = createFileRoute("/admission/apply")({
  head: () => ({
    meta: [
      { title: "Application Form — College of Nursing Sciences, Tambuwal" },
      {
        name: "description",
        content:
          "Complete your admission application: choose your programme, fill in your details, and upload required documents.",
      },
      {
        property: "og:title",
        content: "Admission Application Form — CONS Tambuwal",
      },
      {
        property: "og:description",
        content:
          "Submit your admission application at the College of Nursing Sciences, Tambuwal — programme, personal details, and supporting documents.",
      },
      { property: "og:image", content: "/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
  }),
  component: ApplyPage,
});

const PROGRAMMES = [
  "Basic General Nursing (RN)",
  "Basic Midwifery (RM)",
  "Post-Basic Midwifery",
  "Post-Basic Public Health Nursing",
  "Post-Basic Paediatric Nursing",
  "Post-Basic Critical Care Nursing",
];

const SESSIONS = ["2025/2026", "2026/2027"];

const REQUIRED_DOCS: { key: string; label: string; hint: string }[] = [
  { key: "passport", label: "Passport Photograph", hint: "Recent, white background, JPG/PNG, ≤ 2 MB" },
  { key: "birth_cert", label: "Birth Certificate", hint: "PDF or image, ≤ 5 MB" },
  { key: "ssce", label: "SSCE / WAEC / NECO Result", hint: "PDF or image, ≤ 5 MB" },
  { key: "id", label: "Government-issued ID", hint: "National ID, voter's card, or passport" },
];

const ACCEPT = ".pdf,.png,.jpg,.jpeg";
const MAX_BYTES = 5 * 1024 * 1024;
const BUCKET = "admission-documents";

const schema = z.object({
  programme: z.string().min(1, "Choose a programme"),
  level: z.string().min(1, "Select level"),
  session: z.string().min(1, "Select session"),
  nationality: z.string().trim().min(2).max(60),
  stateOfOrigin: z.string().trim().min(2).max(60),
  lga: z.string().trim().min(2).max(60),
  address: z.string().trim().min(5).max(300),
  jambNumber: z.string().trim().max(30).optional().or(z.literal("")),
  examSummary: z.string().trim().max(500).optional().or(z.literal("")),
  nokName: z.string().trim().min(2).max(80),
  nokPhone: z.string().trim().min(7).max(20).regex(/^[0-9+\-\s]+$/, "Only digits, +, - and spaces"),
  nokRelationship: z.string().trim().min(2).max(40),
  nokAddress: z.string().trim().min(5).max(300),
  refereeName: z.string().trim().min(2).max(80),
  refereePhone: z.string().trim().min(7).max(20).regex(/^[0-9+\-\s]+$/, "Only digits, +, - and spaces"),
  refereeEmail: z.string().trim().toLowerCase().email().max(255),
  declaration: z.literal(true, {
    errorMap: () => ({ message: "You must accept the declaration" }),
  }),
});

type FormState = {
  programme: string;
  level: string;
  session: string;
  nationality: string;
  stateOfOrigin: string;
  lga: string;
  address: string;
  jambNumber: string;
  examSummary: string;
  nokName: string;
  nokPhone: string;
  nokRelationship: string;
  nokAddress: string;
  refereeName: string;
  refereePhone: string;
  refereeEmail: string;
  declaration: boolean;
};

type DocRecord = { key: string; label: string; path: string; size: number };

const STEPS = [
  { id: 1, label: "Programme", icon: GraduationCap },
  { id: 2, label: "Details", icon: UserIcon },
  { id: 3, label: "Documents", icon: FileUp },
  { id: 4, label: "Payment", icon: CreditCard },
  { id: 5, label: "Review", icon: CheckCircle2 },
] as const;

type PaymentRecord = {
  reference: string;
  amount: number;
  paidAt: string; // ISO
};

const initialState: FormState = {
  programme: "",
  level: "ND I",
  session: SESSIONS[0],
  nationality: "Nigerian",
  stateOfOrigin: "",
  lga: "",
  address: "",
  jambNumber: "",
  examSummary: "",
  nokName: "",
  nokPhone: "",
  nokRelationship: "",
  nokAddress: "",
  refereeName: "",
  refereePhone: "",
  refereeEmail: "",
  declaration: false,
};

function ApplyPage() {
  const navigate = useNavigate({ from: "/admission/apply" });
  const [authChecked, setAuthChecked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [docs, setDocs] = useState<DocRecord[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  const paymentKey = (uid: string) => `cons_app_fee_${uid}`;

  // Auth + load existing application
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!data.user) {
        await navigate({ to: "/admission" });
        return;
      }
      setUserId(data.user.id);
      setUserEmail(data.user.email ?? "");
      setAuthChecked(true);

      // Load saved application-fee payment (client-side persistence)
      try {
        const raw = localStorage.getItem(paymentKey(data.user.id));
        if (raw) setPayment(JSON.parse(raw) as PaymentRecord);
      } catch { /* ignore */ }

      const { data: app } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (app) {
        setForm({
          programme: app.programme ?? "",
          level: app.level ?? "ND I",
          session: app.session ?? SESSIONS[0],
          nationality: app.nationality ?? "Nigerian",
          stateOfOrigin: app.state_of_origin ?? "",
          lga: app.lga ?? "",
          address: app.address ?? "",
          jambNumber: app.jamb_number ?? "",
          examSummary: app.exam_summary ?? "",
          nokName: app.next_of_kin_name ?? "",
          nokPhone: app.next_of_kin_phone ?? "",
          nokRelationship: app.next_of_kin_relationship ?? "",
          nokAddress: app.next_of_kin_address ?? "",
          refereeName: app.referee_name ?? "",
          refereePhone: app.referee_phone ?? "",
          refereeEmail: app.referee_email ?? "",
          declaration: app.declaration_accepted ?? false,
        });
        setDocs(Array.isArray(app.documents) ? (app.documents as unknown as DocRecord[]) : []);
        if (app.status === "submitted") setReadOnly(true);
      } else {
        // Prefill programme from applicants table
        const { data: applicant } = await supabase
          .from("applicants")
          .select("programme_of_interest")
          .eq("user_id", data.user.id)
          .maybeSingle();
        if (applicant?.programme_of_interest) {
          setForm((f) => ({ ...f, programme: applicant.programme_of_interest as string }));
        }
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key as string]) return e;
      const next = { ...e };
      delete next[key as string];
      return next;
    });
  };

  const persistDraft = async (overrideDocs?: DocRecord[]) => {
    if (!userId) return;
    setSaving(true);
    const payload = {
      user_id: userId,
      programme: form.programme || "Pending",
      level: form.level,
      session: form.session,
      nationality: form.nationality,
      state_of_origin: form.stateOfOrigin,
      lga: form.lga,
      address: form.address,
      jamb_number: form.jambNumber || null,
      exam_summary: form.examSummary || null,
      next_of_kin_name: form.nokName,
      next_of_kin_phone: form.nokPhone,
      next_of_kin_relationship: form.nokRelationship,
      next_of_kin_address: form.nokAddress,
      referee_name: form.refereeName,
      referee_phone: form.refereePhone,
      referee_email: form.refereeEmail,
      declaration_accepted: form.declaration,
      documents: (overrideDocs ?? docs) as unknown as never,
      status: "draft" as const,
    };
    const { error } = await supabase
      .from("applications")
      .upsert(payload, { onConflict: "user_id" });
    setSaving(false);
    if (error) toast.error("Could not save draft", { description: error.message });
  };

  const validateStep = (s: number): boolean => {
    const next: Record<string, string> = {};
    if (s === 1) {
      if (!form.programme) next.programme = "Choose a programme";
      if (!form.level) next.level = "Select level";
      if (!form.session) next.session = "Select session";
    }
    if (s === 2) {
      const subset = z.object({
        nationality: schema.shape.nationality,
        stateOfOrigin: schema.shape.stateOfOrigin,
        lga: schema.shape.lga,
        address: schema.shape.address,
        nokName: schema.shape.nokName,
        nokPhone: schema.shape.nokPhone,
        nokRelationship: schema.shape.nokRelationship,
        nokAddress: schema.shape.nokAddress,
        refereeName: schema.shape.refereeName,
        refereePhone: schema.shape.refereePhone,
        refereeEmail: schema.shape.refereeEmail,
      });
      const r = subset.safeParse(form);
      if (!r.success) {
        for (const issue of r.error.issues) {
          const k = issue.path[0] as string;
          if (!next[k]) next[k] = issue.message;
        }
      }
    }
    if (s === 3) {
      const required = REQUIRED_DOCS.map((d) => d.key);
      const missing = required.filter((k) => !docs.find((d) => d.key === k));
      if (missing.length) next.documents = `Upload: ${missing.join(", ")}`;
    }
    if (s === 4) {
      if (!payment) next.payment = "Application fee payment is required to continue.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = async () => {
    if (readOnly) {
      setStep((s) => Math.min(5, s + 1));
      return;
    }
    if (!validateStep(step)) return;
    await persistDraft();
    setStep((s) => Math.min(5, s + 1));
  };
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const onUpload = async (key: string, label: string, file: File) => {
    if (!userId) return;
    if (file.size > MAX_BYTES) {
      toast.error("File too large", { description: "Max 5 MB per file" });
      return;
    }
    setUploading(key);
    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const path = `${userId}/${key}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });
    if (error) {
      setUploading(null);
      toast.error("Upload failed", { description: error.message });
      return;
    }
    // Remove old of same key
    const old = docs.find((d) => d.key === key);
    if (old) await supabase.storage.from(BUCKET).remove([old.path]);
    const nextDocs = [
      ...docs.filter((d) => d.key !== key),
      { key, label, path, size: file.size },
    ];
    setDocs(nextDocs);
    setUploading(null);
    await persistDraft(nextDocs);
    toast.success(`${label} uploaded`);
  };

  const onRemove = async (key: string) => {
    const target = docs.find((d) => d.key === key);
    if (!target) return;
    await supabase.storage.from(BUCKET).remove([target.path]);
    const nextDocs = docs.filter((d) => d.key !== key);
    setDocs(nextDocs);
    await persistDraft(nextDocs);
  };

  const onSubmit = async () => {
    if (!userId) return;
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      toast.error("Please complete all required fields");
      return;
    }
    if (!payment) {
      toast.error("Payment required", { description: "Please pay the application fee before submitting." });
      setStep(4);
      return;
    }
    if (!form.declaration) {
      setErrors((e) => ({ ...e, declaration: "You must accept the declaration" }));
      return;
    }
    setSubmitting(true);
    const { error } = await supabase
      .from("applications")
      .update({ status: "submitted", submitted_at: new Date().toISOString() })
      .eq("user_id", userId);
    setSubmitting(false);
    if (error) {
      toast.error("Submission failed", { description: error.message });
      return;
    }
    setReadOnly(true);
    toast.success("Application submitted", {
      description: "We have received your application. You'll be notified after review.",
    });
  };

  const handlePaymentSuccess = (ref: string) => {
    if (!userId) return;
    const rec: PaymentRecord = {
      reference: ref,
      amount: APPLICATION_FEE_NGN,
      paidAt: new Date().toISOString(),
    };
    setPayment(rec);
    try { localStorage.setItem(paymentKey(userId), JSON.stringify(rec)); } catch { /* ignore */ }
    setPayOpen(false);
    setErrors((e) => { const n = { ...e }; delete n.payment; return n; });
    toast.success("Application fee paid", { description: `Reference: ${ref}` });
  };

  const handleDownloadAppReceipt = () => {
    if (!payment) {
      toast.error("No payment found", { description: "Please pay the application fee first." });
      return;
    }
    const fullName = [form.nokName ? "" : "", ""].join(""); // placeholder fix
    const studentName =
      [form.refereeName].filter(Boolean).length > 0
        ? userEmail.split("@")[0] || "Applicant"
        : userEmail.split("@")[0] || "Applicant";
    void fullName;
    downloadReceiptPDF({
      category: "application",
      feeLabel: "Application Fee",
      amount: `₦${payment.amount.toLocaleString()}`,
      studentName,
      applicationNo: userId ? `APP/${userId.slice(0, 8).toUpperCase()}` : undefined,
      programme: form.programme || undefined,
      session: form.session || undefined,
      reference: payment.reference,
      paidAt: new Date(payment.paidAt),
    });
  };

  const completion = useMemo(() => {
    let pts = 0;
    if (form.programme) pts += 1;
    const detailKeys: (keyof FormState)[] = [
      "stateOfOrigin",
      "lga",
      "address",
      "nokName",
      "nokPhone",
      "refereeEmail",
    ];
    pts += detailKeys.filter((k) => String(form[k]).trim().length > 0).length / detailKeys.length;
    pts += Math.min(1, docs.length / REQUIRED_DOCS.length);
    return Math.round((pts / 3) * 100);
  }, [form, docs]);

  if (!authChecked || loading) {
    return (
      <main className="min-h-screen bg-background">
        <PortalHeader />
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> <span className="ml-2 text-sm">Loading your application…</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/20">
      <PortalHeader />
      <section className="px-4 py-8 md:py-12">
        <div className="mx-auto w-full max-w-4xl">
          {/* Header card */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elegant)]">
            <div className="flex items-center gap-3 bg-primary px-6 py-5 text-primary-foreground">
              <img src={crest} alt="CONS Tambuwal crest" className="h-12 w-12 shrink-0 object-contain" />
              <div className="leading-tight">
                <p className="font-display text-base font-extrabold md:text-lg">Admission Application</p>
                <p className="text-gold text-sm">College of Nursing Sciences, Tambuwal</p>
              </div>
              <div className="ml-auto hidden md:block text-right">
                <p className="text-xs text-primary-foreground/70 uppercase tracking-wider">Completion</p>
                <p className="font-display text-xl font-extrabold text-gold">{completion}%</p>
              </div>
            </div>

            {readOnly && (
              <div className="flex items-center gap-2 bg-emerald-50 border-b border-emerald-200 px-6 py-3 text-sm text-emerald-800">
                <ShieldCheck className="h-4 w-4" />
                Your application has been submitted and is under review. It is now read-only.
              </div>
            )}

            {/* Stepper */}
            <div className="border-b border-border bg-muted/30 px-4 py-4 md:px-6">
              <ol className="flex items-center justify-between gap-2">
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const active = step === s.id;
                  const done = step > s.id;
                  return (
                    <li key={s.id} className="flex flex-1 items-center gap-2">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                          done
                            ? "border-primary bg-primary text-primary-foreground"
                            : active
                            ? "border-gold bg-gold text-primary"
                            : "border-border bg-card text-muted-foreground"
                        }`}
                      >
                        {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <div className="hidden sm:block">
                        <p
                          className={`text-xs font-bold uppercase tracking-wider ${
                            active ? "text-primary" : done ? "text-primary/80" : "text-muted-foreground"
                          }`}
                        >
                          Step {s.id}
                        </p>
                        <p className={`text-xs ${active ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</p>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`mx-2 hidden h-px flex-1 sm:block ${done ? "bg-primary" : "bg-border"}`} />
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="px-4 py-6 md:px-8 md:py-8">
              {step === 1 && (
                <Step1
                  form={form}
                  errors={errors}
                  update={update}
                  readOnly={readOnly}
                />
              )}
              {step === 2 && (
                <Step2 form={form} errors={errors} update={update} readOnly={readOnly} />
              )}
              {step === 3 && (
                <Step3
                  docs={docs}
                  errors={errors}
                  uploading={uploading}
                  readOnly={readOnly}
                  onUpload={onUpload}
                  onRemove={onRemove}
                />
              )}
              {step === 4 && (
                <StepPayment
                  payment={payment}
                  amount={APPLICATION_FEE_NGN}
                  errors={errors}
                  readOnly={readOnly}
                  onPay={() => setPayOpen(true)}
                  onDownload={handleDownloadAppReceipt}
                />
              )}
              {step === 5 && (
                <Step4
                  form={form}
                  docs={docs}
                  errors={errors}
                  update={update}
                  readOnly={readOnly}
                />
              )}

              {/* Footer actions */}
              <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 1}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-bold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>

                <p className="hidden text-xs text-muted-foreground sm:block">
                  {saving ? "Saving draft…" : readOnly ? "Submitted" : "Drafts auto-save as you go"}
                </p>

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition hover:brightness-110"
                  >
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={readOnly || submitting}
                    onClick={onSubmit}
                    className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-2.5 font-display text-sm font-extrabold uppercase tracking-wide text-primary transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                      </>
                    ) : readOnly ? (
                      <>Submitted</>
                    ) : (
                      <>Submit Application</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/admission"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
            >
              ← Back to Portal
            </Link>
          </div>
        </div>
      </section>

      <PaystackCheckoutModal
        open={payOpen}
        email={userEmail || "applicant@cons-tambuwal.edu.ng"}
        amountNGN={APPLICATION_FEE_NGN}
        description="Application Fee — CONS Tambuwal"
        onClose={() => setPayOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </main>
  );
}

function StepPayment({
  payment,
  amount,
  errors,
  readOnly,
  onPay,
  onDownload,
}: {
  payment: PaymentRecord | null;
  amount: number;
  errors: Record<string, string>;
  readOnly: boolean;
  onPay: () => void;
  onDownload: () => void;
}) {
  const paid = !!payment;
  return (
    <div>
      <h2 className="font-display text-xl font-extrabold text-primary">Application Fee</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        A non-refundable processing fee is required to submit your application.
      </p>

      <div className="mt-6 rounded-2xl border-2 border-border bg-card p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount Due</p>
            <p className="font-display text-3xl font-extrabold text-primary">₦{amount.toLocaleString()}</p>
            <p className="mt-1 text-xs text-muted-foreground">One-time payment · Application processing</p>
          </div>
          <div className={`flex h-14 w-14 items-center justify-center rounded-full ${paid ? "bg-emerald-100 text-emerald-700" : "bg-muted text-primary"}`}>
            {paid ? <CheckCircle2 className="h-7 w-7" /> : <CreditCard className="h-7 w-7" />}
          </div>
        </div>

        {paid && payment ? (
          <div className="mt-5 space-y-3">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <p className="font-bold">Payment received ✓</p>
              <p className="mt-0.5 text-xs">
                Reference: <span className="font-mono">{payment.reference}</span> ·{" "}
                Paid {new Date(payment.paidAt).toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              onClick={onDownload}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition hover:brightness-110"
            >
              <Download className="h-4 w-4" /> Download Application Fee Receipt
            </button>
          </div>
        ) : (
          <div className="mt-5">
            <button
              type="button"
              disabled={readOnly}
              onClick={onPay}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-display text-sm font-extrabold uppercase tracking-wide text-primary transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ReceiptIcon className="h-4 w-4" /> Pay Application Fee
            </button>
            {errors.payment && (
              <p className="mt-3 text-xs text-destructive">{errors.payment}</p>
            )}
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Secure checkout powered by Paystack. After payment, you can download your receipt and continue to Review.
      </p>
    </div>
  );
}


// --------- Steps ---------

function Step1({
  form,
  errors,
  update,
  readOnly,
}: {
  form: FormState;
  errors: Record<string, string>;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  readOnly: boolean;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-extrabold text-primary">Choose your programme</h2>
      <p className="mt-1 text-sm text-muted-foreground">Select the programme you want to apply for, the level, and the academic session.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {PROGRAMMES.map((p) => {
          const active = form.programme === p;
          return (
            <button
              key={p}
              type="button"
              disabled={readOnly}
              onClick={() => update("programme", p)}
              className={`group rounded-xl border-2 p-4 text-left transition ${
                active
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-card hover:border-primary/40"
              } ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    active ? "bg-primary text-primary-foreground" : "bg-muted text-primary"
                  }`}
                >
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{p}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {p.startsWith("Post-Basic") ? "For Registered Nurses/Midwives" : "Pre-service programme"}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {errors.programme && <p className="mt-2 text-xs text-destructive">{errors.programme}</p>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <SelectInput
          label="Level"
          value={form.level}
          onChange={(v) => update("level", v)}
          options={["ND I", "ND II", "HND I", "HND II", "Post-Basic"]}
          error={errors.level}
          disabled={readOnly}
        />
        <SelectInput
          label="Academic Session"
          value={form.session}
          onChange={(v) => update("session", v)}
          options={SESSIONS}
          error={errors.session}
          disabled={readOnly}
        />
      </div>
    </div>
  );
}

function Step2({
  form,
  errors,
  update,
  readOnly,
}: {
  form: FormState;
  errors: Record<string, string>;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  readOnly: boolean;
}) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-xl font-extrabold text-primary">Personal & contact details</h2>
        <p className="mt-1 text-sm text-muted-foreground">Provide your origin, contact address, and exam information.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <TextInput label="Nationality" value={form.nationality} onChange={(v) => update("nationality", v)} error={errors.nationality} disabled={readOnly} />
          <TextInput label="State of Origin" value={form.stateOfOrigin} onChange={(v) => update("stateOfOrigin", v)} error={errors.stateOfOrigin} disabled={readOnly} placeholder="e.g. Sokoto" />
          <TextInput label="LGA" value={form.lga} onChange={(v) => update("lga", v)} error={errors.lga} disabled={readOnly} placeholder="e.g. Tambuwal" />
          <TextInput label="JAMB Reg. No. (optional)" value={form.jambNumber} onChange={(v) => update("jambNumber", v)} error={errors.jambNumber} disabled={readOnly} />
          <div className="sm:col-span-2">
            <TextArea label="Contact Address" value={form.address} onChange={(v) => update("address", v)} error={errors.address} disabled={readOnly} />
          </div>
          <div className="sm:col-span-2">
            <TextArea
              label="Exam Results Summary (optional)"
              value={form.examSummary}
              onChange={(v) => update("examSummary", v)}
              error={errors.examSummary}
              disabled={readOnly}
              placeholder="e.g. SSCE: Eng B3, Maths C5, Bio B2, Chem C4, Phy C5 (Nov 2024 — WAEC)"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-extrabold text-primary">Next of Kin</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <TextInput label="Full Name" value={form.nokName} onChange={(v) => update("nokName", v)} error={errors.nokName} disabled={readOnly} />
          <TextInput label="Phone" value={form.nokPhone} onChange={(v) => update("nokPhone", v)} error={errors.nokPhone} disabled={readOnly} placeholder="+234…" />
          <TextInput label="Relationship" value={form.nokRelationship} onChange={(v) => update("nokRelationship", v)} error={errors.nokRelationship} disabled={readOnly} placeholder="e.g. Father" />
          <TextInput label="Address" value={form.nokAddress} onChange={(v) => update("nokAddress", v)} error={errors.nokAddress} disabled={readOnly} />
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-extrabold text-primary">Referee</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <TextInput label="Full Name" value={form.refereeName} onChange={(v) => update("refereeName", v)} error={errors.refereeName} disabled={readOnly} />
          <TextInput label="Phone" value={form.refereePhone} onChange={(v) => update("refereePhone", v)} error={errors.refereePhone} disabled={readOnly} />
          <div className="sm:col-span-2">
            <TextInput label="Email" value={form.refereeEmail} onChange={(v) => update("refereeEmail", v)} error={errors.refereeEmail} disabled={readOnly} type="email" />
          </div>
        </div>
      </section>
    </div>
  );
}

function Step3({
  docs,
  errors,
  uploading,
  readOnly,
  onUpload,
  onRemove,
}: {
  docs: DocRecord[];
  errors: Record<string, string>;
  uploading: string | null;
  readOnly: boolean;
  onUpload: (key: string, label: string, file: File) => void;
  onRemove: (key: string) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-extrabold text-primary">Upload supporting documents</h2>
      <p className="mt-1 text-sm text-muted-foreground">PDF, JPG, or PNG. Max 5 MB each. Files are stored securely and only visible to you and the admissions team.</p>

      {errors.documents && (
        <p className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">{errors.documents}</p>
      )}

      <div className="mt-5 grid gap-3">
        {REQUIRED_DOCS.map((d) => {
          const file = docs.find((x) => x.key === d.key);
          const isUploading = uploading === d.key;
          return (
            <div key={d.key} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${file ? "bg-emerald-100 text-emerald-700" : "bg-muted text-primary"}`}>
                {file ? <CheckCircle2 className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-foreground">{d.label}</p>
                <p className="text-xs text-muted-foreground">{file ? `${(file.size / 1024).toFixed(0)} KB · uploaded` : d.hint}</p>
              </div>
              <div className="flex items-center gap-2">
                {file && !readOnly && (
                  <button type="button" onClick={() => onRemove(d.key)} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                )}
                {!readOnly && (
                  <label className={`cursor-pointer rounded-md bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground transition hover:brightness-110 ${isUploading ? "opacity-60" : ""}`}>
                    {isUploading ? (
                      <span className="inline-flex items-center gap-1">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading
                      </span>
                    ) : file ? "Replace" : "Upload"}
                    <input
                      type="file"
                      accept={ACCEPT}
                      className="hidden"
                      disabled={isUploading}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) onUpload(d.key, d.label, f);
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Step4({
  form,
  docs,
  errors,
  update,
  readOnly,
}: {
  form: FormState;
  docs: DocRecord[];
  errors: Record<string, string>;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  readOnly: boolean;
}) {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-extrabold text-primary">Review & submit</h2>
      <p className="text-sm text-muted-foreground">Please review your application. Once submitted, it cannot be edited.</p>

      <ReviewBlock title="Programme">
        <Row k="Programme" v={form.programme || "—"} />
        <Row k="Level" v={form.level} />
        <Row k="Session" v={form.session} />
      </ReviewBlock>

      <ReviewBlock title="Personal & Contact">
        <Row k="Nationality" v={form.nationality} />
        <Row k="State / LGA" v={`${form.stateOfOrigin || "—"} · ${form.lga || "—"}`} />
        <Row k="Address" v={form.address || "—"} />
        <Row k="JAMB Reg. No." v={form.jambNumber || "—"} />
        {form.examSummary && <Row k="Exam Summary" v={form.examSummary} />}
      </ReviewBlock>

      <ReviewBlock title="Next of Kin">
        <Row k="Name" v={form.nokName || "—"} />
        <Row k="Phone" v={form.nokPhone || "—"} />
        <Row k="Relationship" v={form.nokRelationship || "—"} />
        <Row k="Address" v={form.nokAddress || "—"} />
      </ReviewBlock>

      <ReviewBlock title="Referee">
        <Row k="Name" v={form.refereeName || "—"} />
        <Row k="Phone" v={form.refereePhone || "—"} />
        <Row k="Email" v={form.refereeEmail || "—"} />
      </ReviewBlock>

      <ReviewBlock title="Documents">
        {docs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents uploaded.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {docs.map((d) => (
              <li key={d.key} className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> {d.label}
                <span className="text-xs text-muted-foreground">({(d.size / 1024).toFixed(0)} KB)</span>
              </li>
            ))}
          </ul>
        )}
      </ReviewBlock>

      <label className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-4 text-sm">
        <input
          type="checkbox"
          checked={form.declaration}
          disabled={readOnly}
          onChange={(e) => update("declaration", e.target.checked as FormState["declaration"])}
          className="mt-1 h-4 w-4 rounded border-border accent-primary"
        />
        <span className="text-muted-foreground">
          I declare that the information provided is true and accurate to the best of my knowledge,
          and I consent to its use for processing my admission application.
        </span>
      </label>
      {errors.declaration && <p className="text-xs text-destructive">{errors.declaration}</p>}
    </div>
  );
}

// --------- Inputs ---------

function TextInput({
  label,
  value,
  onChange,
  error,
  disabled,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={`w-full rounded-md border bg-muted/40 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 disabled:opacity-60 ${
          error ? "border-destructive focus:ring-destructive/40" : "border-border focus:ring-primary/40"
        }`}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  error,
  disabled,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <textarea
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        aria-invalid={!!error}
        className={`w-full rounded-md border bg-muted/40 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 disabled:opacity-60 ${
          error ? "border-destructive focus:ring-destructive/40" : "border-border focus:ring-primary/40"
        }`}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
  error,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-md border bg-muted/40 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 disabled:opacity-60 ${
          error ? "border-destructive focus:ring-destructive/40" : "border-border focus:ring-primary/40"
        }`}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function ReviewBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 text-sm">
      <span className="text-muted-foreground">{k}</span>
      <span className="col-span-2 break-words font-medium text-foreground">{v}</span>
    </div>
  );
}
