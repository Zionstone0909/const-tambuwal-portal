import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useSyncExternalStore } from "react";
import { z } from "zod";
import { PortalHeader } from "@/components/PortalHeader";
import { UserAvatar } from "@/components/UserAvatar";
import { PaystackCheckoutModal } from "@/components/PaystackCheckoutModal";
import { downloadReceiptPDF } from "@/lib/receipt-pdf";
import {
  GraduationCap,
  ClipboardList,
  BookOpen,
  CreditCard,
  FileText,
  Award,
  CalendarDays,
  Bell,
  TrendingUp,
  Wallet,
  LogOut,
  LayoutDashboard,
  MessageSquare,
  User,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Download,
  Send,
  Search,
  ChevronRight,
  MapPin,
  Megaphone,
  FileCheck,
  Receipt,
  
  Lock,
  Calendar,
  HeartPulse,
  Star,
  Home,
  Printer,
  Monitor,
  Phone,
  Mail,
  ScrollText,
  ShieldCheck,
  IdCard,
} from "lucide-react";

const dashboardSearchSchema = z.object({
  matric: z.string().trim().min(1).max(50).optional(),
  session: z.string().trim().min(1).max(20).default("2025/2026"),
  semester: z.string().trim().min(1).max(20).default("1st Semester"),
  view: z
    .enum([
      "home",
      "courses",
      "assignments",
      "timetable",
      "results",
      "messages",
      "announcements",
      "registration",
      "payments",
      "profile",
      "biodata",
      "health",
      "assessment",
      "hostel",
      "print-course-form",
      "online-learning",
      "print-exam-docs",
      "phone",
      "email",
      "transcript",
      "clearance",
    ])
    .optional()
    .default("home"),
});

export const Route = createFileRoute("/admission/dashboard")({
  validateSearch: (search) => dashboardSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Student Portal — CONS Tambuwal" },
      {
        name: "description",
        content:
          "Your CONS Tambuwal student portal: courses, assignments, timetable, results, messaging, and more — everything you need for school in one place.",
      },
    ],
  }),
  component: DashboardPage,
});

type ViewKey =
  | "home"
  | "courses"
  | "assignments"
  | "timetable"
  | "results"
  | "messages"
  | "announcements"
  | "registration"
  | "payments"
  | "profile"
  | "biodata"
  | "health"
  | "assessment"
  | "hostel"
  | "print-course-form"
  | "online-learning"
  | "print-exam-docs"
  | "phone"
  | "email"
  | "transcript"
  | "clearance";

type NavGroup = {
  group: string;
  items: { key: ViewKey; label: string; icon: typeof LayoutDashboard }[];
};

const navGroups: NavGroup[] = [
  {
    group: "Main",
    items: [
      { key: "home", label: "Dashboard", icon: LayoutDashboard },
      { key: "profile", label: "Profile Page", icon: User },
      { key: "biodata", label: "Update Biodata", icon: IdCard },
    ],
  },
  {
    group: "Academics",
    items: [
      { key: "courses", label: "My Courses", icon: BookOpen },
      { key: "assignments", label: "Assignments", icon: ClipboardList },
      { key: "timetable", label: "Timetable", icon: CalendarDays },
      { key: "registration", label: "Course Registration", icon: FileCheck },
      { key: "print-course-form", label: "Print Course Form", icon: Printer },
      { key: "online-learning", label: "Online Learning", icon: Monitor },
      { key: "assessment", label: "Teaching Assessment", icon: Star },
    ],
  },
  {
    group: "Records",
    items: [
      { key: "results", label: "Check Results", icon: Award },
      { key: "print-exam-docs", label: "Print Exam Docs", icon: ScrollText },
      { key: "transcript", label: "Transcript", icon: FileText },
    ],
  },
  {
    group: "Welfare",
    items: [
      { key: "health", label: "Health Centre", icon: HeartPulse },
      { key: "hostel", label: "Hostel Application", icon: Home },
      { key: "payments", label: "Payments", icon: CreditCard },
      { key: "clearance", label: "Clearance", icon: ShieldCheck },
    ],
  },
  {
    group: "Communication",
    items: [
      { key: "messages", label: "Messages", icon: MessageSquare },
      { key: "announcements", label: "Announcements", icon: Megaphone },
      { key: "phone", label: "Update Phone", icon: Phone },
      { key: "email", label: "Check Email", icon: Mail },
    ],
  },
];

const navItems = navGroups.flatMap((g) => g.items);

// ---------- mock data ----------
const courses = [
  { code: "NUR 201", title: "Foundations of Nursing", lecturer: "Dr. A. Bello", units: 3, progress: 72, color: "primary" },
  { code: "NUR 203", title: "Anatomy & Physiology II", lecturer: "Mrs. H. Sani", units: 4, progress: 58, color: "gold" },
  { code: "NUR 205", title: "Microbiology for Nurses", lecturer: "Dr. M. Yusuf", units: 2, progress: 81, color: "primary" },
  { code: "NUR 207", title: "Pharmacology I", lecturer: "Dr. F. Ibrahim", units: 3, progress: 40, color: "gold" },
  { code: "NUR 209", title: "Community Health", lecturer: "Mr. K. Aliyu", units: 2, progress: 65, color: "primary" },
  { code: "GST 201", title: "Nigerian Peoples & Culture", lecturer: "Mrs. R. Ojo", units: 2, progress: 90, color: "gold" },
];

const assignments = [
  { course: "NUR 207", title: "Drug classification report", due: "2 days", status: "pending", urgent: true },
  { course: "NUR 203", title: "Cardiovascular system diagram", due: "5 days", status: "pending", urgent: false },
  { course: "NUR 201", title: "Nursing theory essay", due: "Submitted", status: "submitted", urgent: false },
  { course: "NUR 205", title: "Bacterial culture lab report", due: "1 week", status: "pending", urgent: false },
  { course: "GST 201", title: "Cultural values presentation", due: "Graded · 18/20", status: "graded", urgent: false },
];

const timetable = [
  { day: "Mon", slots: [{ time: "08:00", code: "NUR 201", room: "LT 1" }, { time: "11:00", code: "NUR 207", room: "Lab B" }] },
  { day: "Tue", slots: [{ time: "09:00", code: "NUR 203", room: "LT 2" }, { time: "13:00", code: "GST 201", room: "Hall 3" }] },
  { day: "Wed", slots: [{ time: "08:00", code: "NUR 205", room: "Lab A" }, { time: "10:00", code: "NUR 209", room: "LT 1" }] },
  { day: "Thu", slots: [{ time: "08:00", code: "NUR 201", room: "LT 1" }, { time: "12:00", code: "NUR 207", room: "Lab B" }] },
  { day: "Fri", slots: [{ time: "09:00", code: "NUR 203", room: "LT 2" }] },
];

const results = [
  { code: "NUR 201", title: "Medical-Surgical Nursing I", ca: 26, exam: 55, total: 81, grade: "A" },
  { code: "NUR 203", title: "Pharmacology", ca: 24, exam: 50, total: 74, grade: "B" },
  { code: "NUR 205", title: "Microbiology", ca: 23, exam: 49, total: 72, grade: "B" },
  { code: "NUR 207", title: "Community Health Nursing", ca: 27, exam: 54, total: 81, grade: "A" },
  { code: "GST 201", title: "Nigerian Peoples & Culture", ca: 25, exam: 56, total: 81, grade: "A" },
];

type ResultStatus = "Published" | "Provisional" | "Pending Senate Approval";

type SemesterResult = {
  session: string;
  semester: "First" | "Second";
  level: string;
  gpa: number;
  status: ResultStatus;
  submittedOn: string; // ISO date
  updatedOn: string; // ISO date
  courses: { code: string; title: string; unit: number; ca: number; exam: number; total: number; grade: string }[];
};

const pastResults: SemesterResult[] = [
  {
    session: "2024/2025",
    semester: "First",
    level: "200 Level",
    gpa: 4.45,
    status: "Provisional",
    submittedOn: "2025-03-04",
    updatedOn: "2025-04-12",
    courses: [
      { code: "NUR 201", title: "Medical-Surgical Nursing I", unit: 3, ca: 26, exam: 55, total: 81, grade: "A" },
      { code: "NUR 203", title: "Pharmacology", unit: 2, ca: 24, exam: 50, total: 74, grade: "B" },
      { code: "NUR 205", title: "Microbiology", unit: 2, ca: 23, exam: 49, total: 72, grade: "B" },
      { code: "NUR 207", title: "Community Health Nursing", unit: 3, ca: 27, exam: 54, total: 81, grade: "A" },
      { code: "GST 201", title: "Nigerian Peoples & Culture", unit: 2, ca: 25, exam: 56, total: 81, grade: "A" },
    ],
  },
  {
    session: "2023/2024",
    semester: "Second",
    level: "100 Level",
    gpa: 4.20,
    status: "Published",
    submittedOn: "2024-08-19",
    updatedOn: "2024-09-02",
    courses: [
      { code: "NUR 102", title: "Foundations of Nursing II", unit: 3, ca: 25, exam: 52, total: 77, grade: "A" },
      { code: "NUR 104", title: "Anatomy II", unit: 3, ca: 22, exam: 48, total: 70, grade: "B" },
      { code: "NUR 106", title: "Physiology II", unit: 2, ca: 24, exam: 50, total: 74, grade: "B" },
      { code: "GST 102", title: "Communication in English", unit: 2, ca: 26, exam: 55, total: 81, grade: "A" },
    ],
  },
  {
    session: "2023/2024",
    semester: "First",
    level: "100 Level",
    gpa: 4.10,
    status: "Published",
    submittedOn: "2024-02-15",
    updatedOn: "2024-03-01",
    courses: [
      { code: "NUR 101", title: "Intro to Nursing", unit: 3, ca: 28, exam: 56, total: 84, grade: "A" },
      { code: "NUR 103", title: "Anatomy I", unit: 3, ca: 25, exam: 48, total: 73, grade: "B" },
      { code: "NUR 105", title: "Biochemistry", unit: 2, ca: 22, exam: 52, total: 74, grade: "B" },
      { code: "GST 101", title: "Use of English", unit: 2, ca: 27, exam: 58, total: 85, grade: "A" },
    ],
  },
];

function formatResultDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}

function statusBadgeClasses(status: ResultStatus): string {
  switch (status) {
    case "Published":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Provisional":
      return "bg-gold/20 text-primary border-gold/40";
    case "Pending Senate Approval":
      return "bg-orange-100 text-orange-800 border-orange-200";
  }
}

function gradeFromTotal(total: number): string {
  if (total >= 70) return "A";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 45) return "D";
  if (total >= 40) return "E";
  return "F";
}

function gradePoint(grade: string): number {
  return { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 }[grade] ?? 0;
}

const announcements = [
  { date: "12 Apr", tag: "Academic", title: "2nd Semester course registration closes 30 April." },
  { date: "08 Apr", tag: "Exams", title: "Mid-semester test schedule has been published." },
  { date: "01 Apr", tag: "Library", title: "Library extended opening hours during exams." },
  { date: "28 Mar", tag: "Bursary", title: "Tuition fee deadline extended by two weeks." },
];

const messages = [
  { from: "Dr. A. Bello", role: "NUR 201 Lecturer", preview: "Please review chapter 4 before our next class…", time: "10:24", unread: true },
  { from: "Mrs. H. Sani", role: "NUR 203 Lecturer", preview: "Lab session moved to Thursday 2pm.", time: "Yesterday", unread: true },
  { from: "Bursary Office", role: "Administration", preview: "Your fee receipt is now available.", time: "Mon", unread: false },
];

// ---------- shared payment state (demo) ----------
const tuitionPaid = {
  value: false,
  listeners: new Set<() => void>(),
  notify() {
    this.listeners.forEach((l) => l());
  },
};
function useTuitionPaid() {
  return useSyncExternalStore(
    (cb) => {
      tuitionPaid.listeners.add(cb);
      return () => tuitionPaid.listeners.delete(cb);
    },
    () => tuitionPaid.value,
    () => tuitionPaid.value,
  );
}

// ---------- main ----------
const navRef: { setView: ((v: ViewKey) => void) | null } = { setView: null };

function DashboardPage() {
  const { matric, session, semester, view } = Route.useSearch();
  const navigate = Route.useNavigate();
  const displayMatric = matric || "CONS/2025/001";
  const [activeView, setActiveView] = useState<ViewKey>(view);

  const setView = (v: ViewKey) => {
    setActiveView(v);
    navigate({ search: (prev: z.infer<typeof dashboardSearchSchema>) => ({ ...prev, view: v }) });
  };
  navRef.setView = setView;

  return (
    <main className="min-h-screen bg-muted/30">
      <PortalHeader />

      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
            <div className="p-5 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <div className="flex items-center gap-3">
                <UserAvatar
                  userKey={`student:${displayMatric}`}
                  initials="IA"
                  sizeClassName="h-12 w-12"
                  textClassName="text-lg"
                />
                <div className="min-w-0">
                  <p className="font-display font-bold truncate">Ibrahim Akanni</p>
                  <p className="text-xs text-primary-foreground/80 truncate">{displayMatric}</p>
                </div>
              </div>
            </div>
            <nav className="p-2 max-h-[calc(100vh-220px)] overflow-y-auto">
              {navGroups.map((group) => (
                <div key={group.group} className="mb-2">
                  <p className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                    {group.group}
                  </p>
                  {group.items.map(({ key, label, icon: Icon }) => {
                    const active = activeView === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setView(key)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                          active
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-foreground/80 hover:bg-muted hover:text-primary"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </button>
                    );
                  })}
                </div>
              ))}
              <div className="my-2 border-t border-border" />
              <Link
                to="/admission"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-destructive hover:bg-destructive/10 transition"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <section className="min-w-0">
          {activeView === "home" && <HomeView matric={displayMatric} session={session} semester={semester} onNavigate={setView} />}
          {activeView === "courses" && <CoursesView />}
          {activeView === "assignments" && <AssignmentsView />}
          {activeView === "timetable" && <TimetableView />}
          {activeView === "results" && <ResultsView matric={displayMatric} />}
          {activeView === "messages" && <MessagesView />}
          {activeView === "announcements" && <AnnouncementsView />}
          {activeView === "registration" && <RegistrationView />}
          {activeView === "payments" && <PaymentsView matric={displayMatric} />}
          {activeView === "profile" && <ProfileView matric={displayMatric} />}
          {activeView === "biodata" && <BiodataModule matric={displayMatric} />}
          {activeView === "health" && <HealthModule />}
          {activeView === "assessment" && <AssessmentModule />}
          {activeView === "hostel" && <HostelModule />}
          {activeView === "print-course-form" && <PrintCourseFormModule matric={displayMatric} session={session} semester={semester} />}
          {activeView === "online-learning" && <OnlineLearningModule />}
          {activeView === "print-exam-docs" && <PrintExamDocsModule matric={displayMatric} />}
          {activeView === "phone" && <PhoneModule />}
          {activeView === "email" && <EmailModule />}
          {activeView === "transcript" && <TranscriptModule matric={displayMatric} />}
          {activeView === "clearance" && <ClearanceModule />}
        </section>
      </div>
    </main>
  );
}

// ---------- Home / Dashboard ----------
function HomeView({
  matric,
  session,
  semester,
  onNavigate,
}: {
  matric: string;
  session: string;
  semester: string;
  onNavigate: (v: ViewKey) => void;
}) {
  const cgpa = 4.32;
  const cgpaPct = (cgpa / 5) * 100;
  const nextClass = { code: "NUR 207", title: "Pharmacology I", time: "11:00 AM", room: "Lab B", in: "in 2 hours" };
  const dueAssignment = assignments.find((a) => a.urgent);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 p-6 md:p-8 text-primary-foreground shadow-[var(--shadow-elegant)] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative">
          <p className="text-gold text-xs uppercase tracking-[0.2em] font-bold">Welcome back</p>
          <h1 className="font-display font-extrabold text-2xl md:text-4xl mt-1">Ibrahim Akanni 👋</h1>
          <p className="mt-2 text-primary-foreground/80 text-sm md:text-base">
            {matric} · General Nursing Sciences · {session} · {semester}
          </p>
        </div>
      </div>

      {/* Smart widgets row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Next class */}
        <div className="rounded-2xl border border-border bg-card p-5 hover:shadow-[var(--shadow-elegant)] transition">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Next Class</p>
            <span className="text-[10px] uppercase tracking-wide font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">
              {nextClass.in}
            </span>
          </div>
          <div className="mt-3 flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center">
              <PlayCircle className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-extrabold text-lg text-primary truncate">
                {nextClass.code} · {nextClass.title}
              </p>
              <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{nextClass.time}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{nextClass.room}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment alert */}
        <div className="rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/10 to-card p-5 hover:shadow-[var(--shadow-elegant)] transition">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Assignment Due</p>
            <span className="text-[10px] uppercase tracking-wide font-bold bg-destructive/10 text-destructive px-2 py-1 rounded-full">
              Due in {dueAssignment?.due}
            </span>
          </div>
          <div className="mt-3 flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gold to-gold/70 text-primary flex items-center justify-center">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display font-extrabold text-lg text-primary truncate">{dueAssignment?.title}</p>
              <p className="text-sm text-muted-foreground">{dueAssignment?.course}</p>
              <button
                type="button"
                onClick={() => onNavigate("assignments")}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-gold transition"
              >
                Submit now <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GPA progress + stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Cumulative GPA</p>
              <p className="font-display font-extrabold text-4xl text-primary mt-1">{cgpa.toFixed(2)} <span className="text-base text-muted-foreground font-medium">/ 5.00</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Class</p>
              <p className="font-display font-bold text-gold">First Class</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary via-primary to-gold transition-all"
                style={{ width: `${cgpaPct}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              <span>2.0 Pass</span>
              <span>3.5 Upper</span>
              <span>4.5 First Class</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <MiniStat icon={BookOpen} label="Courses" value="9" />
          <MiniStat icon={GraduationCap} label="Level" value="200" />
          <MiniStat icon={ClipboardList} label="Assignments" value="4" />
          <MiniStat icon={Wallet} label="Fees Due" value="₦0" />
        </div>
      </div>

      {/* Quick access */}
      <div>
        <h2 className="font-display font-extrabold text-lg text-primary uppercase tracking-tight mb-3">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { v: "courses" as ViewKey, icon: BookOpen, label: "Courses" },
            { v: "assignments" as ViewKey, icon: ClipboardList, label: "Submit" },
            { v: "timetable" as ViewKey, icon: CalendarDays, label: "Timetable" },
            { v: "results" as ViewKey, icon: Award, label: "Results" },
            { v: "messages" as ViewKey, icon: MessageSquare, label: "Messages" },
            { v: "payments" as ViewKey, icon: CreditCard, label: "Pay Fees" },
          ].map(({ v, icon: Icon, label }) => (
            <button
              key={v}
              type="button"
              onClick={() => onNavigate(v)}
              className="group p-4 rounded-xl border border-border bg-card hover:border-gold hover:shadow-[var(--shadow-elegant)] transition text-center"
            >
              <div className="mx-auto h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-2 text-xs font-bold text-primary">{label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Announcements preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-extrabold text-lg text-primary uppercase tracking-tight flex items-center gap-2">
              <Bell className="h-4 w-4 text-gold" /> Announcements
            </h2>
            <button onClick={() => onNavigate("announcements")} className="text-xs font-bold text-primary hover:text-gold">View all</button>
          </div>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {announcements.slice(0, 3).map((a) => (
              <div key={a.title} className="p-4 flex gap-3">
                <div className="shrink-0 h-12 w-12 rounded-lg bg-primary/10 text-primary flex flex-col items-center justify-center text-[10px] font-bold uppercase tracking-wide leading-tight">
                  {a.date.split(" ")[0]}
                  <span className="text-primary/70">{a.date.split(" ")[1]}</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gold">{a.tag}</span>
                  <p className="text-sm text-foreground leading-snug">{a.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-extrabold text-lg text-primary uppercase tracking-tight flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gold" /> Upcoming Deadlines
            </h2>
          </div>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {assignments.filter(a => a.status === "pending").slice(0, 3).map((a) => (
              <div key={a.title} className="p-4 flex items-center gap-3">
                <div className="shrink-0 h-10 w-10 rounded-lg bg-gold/20 text-primary flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.course} · Due in {a.due}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type ModuleAction = { label: string; panel: React.ReactNode };

function PlaceholderView({
  icon: Icon,
  title,
  subtitle,
  actions,
}: {
  icon: typeof BookOpen;
  title: string;
  subtitle: string;
  actions: ModuleAction[];
}) {
  const [active, setActive] = useState(0);
  const current = actions[active];
  return (
    <div>
      <SectionHeader title={title} subtitle={subtitle} />
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-4 px-6 py-5 bg-gradient-to-br from-primary/5 via-card to-gold/5 border-b border-border">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center shrink-0">
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-extrabold text-primary">{title}</p>
            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 px-6 py-3 border-b border-border bg-muted/30">
          {actions.map((a, i) => (
            <button
              key={a.label}
              type="button"
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                i === active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border text-primary hover:border-gold bg-card"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
        <div className="p-6">{current.panel}</div>
      </div>
    </div>
  );
}

function FormField({
  label,
  type = "text",
  defaultValue,
  placeholder,
  options,
  textarea,
  readOnly,
}: {
  label: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  options?: string[];
  textarea?: boolean;
  readOnly?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{label}</span>
      {options ? (
        <select
          defaultValue={defaultValue}
          className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-gold"
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : textarea ? (
        <textarea
          defaultValue={defaultValue}
          placeholder={placeholder}
          rows={4}
          readOnly={readOnly}
          className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-gold"
        />
      ) : (
        <input
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`mt-1 w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-gold ${readOnly ? "opacity-70 cursor-not-allowed" : ""}`}
        />
      )}
    </label>
  );
}

function FormPanel({
  title,
  description,
  children,
  submitLabel = "Save Changes",
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  submitLabel?: string;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert(`${title}: submitted successfully (demo).`);
      }}
      className="space-y-5"
    >
      <div>
        <h3 className="font-display font-extrabold text-lg text-primary">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
      <div className="pt-2 flex flex-wrap gap-2 border-t border-border">
        <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition">
          <CheckCircle2 className="h-4 w-4" /> {submitLabel}
        </button>
        <button type="reset" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-primary text-sm font-bold hover:border-gold transition">
          Reset
        </button>
      </div>
    </form>
  );
}

function InfoList({ items }: { items: { label: string; value: string; status?: "ok" | "warn" | "pending" }[] }) {
  return (
    <div className="rounded-xl border border-border divide-y divide-border">
      {items.map((it) => (
        <div key={it.label} className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground">{it.label}</p>
            <p className="text-sm text-foreground font-semibold truncate">{it.value}</p>
          </div>
          {it.status && (
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${it.status === "ok" ? "bg-primary/10 text-primary" : it.status === "warn" ? "bg-destructive/10 text-destructive" : "bg-gold/20 text-primary"}`}>
              {it.status === "ok" ? "Completed" : it.status === "warn" ? "Action needed" : "Pending"}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function PrintPreview({ title, rows, footerNote }: { title: string; rows: { label: string; value: string }[]; footerNote?: string }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-dashed border-border bg-background p-6">
        <div className="text-center mb-5">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold">College of Nursing Sciences · Tambuwal</p>
          <h3 className="font-display font-extrabold text-xl text-primary mt-1">{title}</h3>
          <p className="text-[11px] text-muted-foreground">2025/2026 Academic Session</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rows.map((r) => (
            <div key={r.label} className="flex justify-between gap-3 border-b border-border/60 pb-1.5">
              <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">{r.label}</span>
              <span className="text-sm text-foreground font-semibold text-right">{r.value}</span>
            </div>
          ))}
        </div>
        {footerNote && <p className="text-[11px] text-muted-foreground mt-5 text-center italic">{footerNote}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition">
          <Printer className="h-4 w-4" /> Print
        </button>
        <button type="button" onClick={() => alert("Download started (demo).")} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-primary text-sm font-bold hover:border-gold transition">
          <Download className="h-4 w-4" /> Download PDF
        </button>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: typeof BookOpen; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Icon className="h-4 w-4 text-gold" />
      <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{label}</p>
      <p className="font-display font-extrabold text-xl text-primary">{value}</p>
    </div>
  );
}

// ---------- Section header ----------
function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
      <div>
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-primary tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ---------- Courses ----------
function CoursesView() {
  return (
    <div>
      <SectionHeader
        title="My Courses"
        subtitle="Open a course to access notes, videos, outline and resources."
        action={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search courses..."
              className="pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-card focus:outline-none focus:border-gold w-full sm:w-64"
            />
          </div>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {courses.map((c) => (
          <article
            key={c.code}
            className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-gold hover:shadow-[var(--shadow-elegant)] transition"
          >
            <div className={`h-2 bg-gradient-to-r ${c.color === "primary" ? "from-primary to-primary/60" : "from-gold to-gold/60"}`} />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold tracking-wider text-gold uppercase">{c.code} · {c.units} units</p>
                  <h3 className="font-display font-extrabold text-lg text-primary mt-0.5 truncate">{c.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{c.lecturer}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition">
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-[11px] font-semibold text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{c.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full ${c.color === "primary" ? "bg-primary" : "bg-gold"}`}
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition">
                  <PlayCircle className="h-3.5 w-3.5" /> Open
                </button>
                <button className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-border text-primary hover:border-gold transition">
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// ---------- Assignments ----------
function AssignmentsView() {
  return (
    <div>
      <SectionHeader title="Assignments & Submissions" subtitle="Upload your work, track deadlines and view grades." />
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border bg-muted/30">
          <div className="col-span-5">Assignment</div>
          <div className="col-span-2">Course</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3 text-right">Action</div>
        </div>
        {assignments.map((a) => (
          <div key={a.title} className="grid grid-cols-12 items-center px-5 py-4 border-b border-border last:border-0 hover:bg-muted/20 transition">
            <div className="col-span-5 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.due}</p>
            </div>
            <div className="col-span-2 text-xs font-bold text-primary">{a.course}</div>
            <div className="col-span-2">
              {a.status === "submitted" && (
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">
                  <CheckCircle2 className="h-3 w-3" /> Submitted
                </span>
              )}
              {a.status === "graded" && (
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-gold/20 text-primary px-2 py-1 rounded-full">
                  <Award className="h-3 w-3" /> Graded
                </span>
              )}
              {a.status === "pending" && (
                <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${a.urgent ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
                  <Clock className="h-3 w-3" /> Pending
                </span>
              )}
            </div>
            <div className="col-span-3 flex justify-end">
              {a.status === "pending" ? (
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition">
                  <Upload className="h-3.5 w-3.5" /> Upload
                </button>
              ) : (
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-primary text-xs font-bold hover:border-gold transition">
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Timetable ----------
function TimetableView() {
  return (
    <div>
      <SectionHeader title="Class Timetable" subtitle="Your weekly lecture schedule and exam timetable." />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {timetable.map((d) => (
          <div key={d.day} className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="bg-primary text-primary-foreground px-4 py-2 text-center font-display font-extrabold text-sm uppercase tracking-wider">
              {d.day}
            </div>
            <div className="p-3 space-y-2 min-h-[120px]">
              {d.slots.map((s) => (
                <div key={s.time + s.code} className="rounded-lg border-l-4 border-gold bg-muted/40 px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{s.time}</p>
                  <p className="text-sm font-bold text-primary">{s.code}</p>
                  <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />{s.room}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Results ----------
function ResultsView({ matric }: { matric: string }) {
  const semesterKey = (s: SemesterResult) => `${s.session} • ${s.semester} Semester`;
  const [selected, setSelected] = useState<string>(semesterKey(pastResults[0]));
  const current = pastResults.find((s) => semesterKey(s) === selected) ?? pastResults[0];

  const totalUnits = current.courses.reduce((s, c) => s + c.unit, 0);
  const totalScore = current.courses.reduce((s, c) => s + c.total, 0);
  const avg = (totalScore / current.courses.length).toFixed(1);
  const qualityPoints = current.courses.reduce((s, c) => s + gradePoint(c.grade) * c.unit, 0);
  const computedGpa = totalUnits > 0 ? (qualityPoints / totalUnits).toFixed(2) : "0.00";

  const cgpa = (
    pastResults.reduce((s, r) => s + r.gpa, 0) / pastResults.length
  ).toFixed(2);

  const printTranscript = () => window.print();

  const downloadTranscriptPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 40;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("College of Nursing Sciences \u00B7 Tambuwal", pageWidth / 2, 50, { align: "center" });
    doc.setFontSize(11);
    doc.text("Official Transcript Excerpt \u2014 Semester Result", pageWidth / 2, 68, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      `${current.session}  \u00B7  ${current.semester} Semester  \u00B7  Status: ${current.status}`,
      pageWidth / 2,
      84,
      { align: "center" },
    );
    doc.text(
      `Submitted: ${formatResultDate(current.submittedOn)}  \u00B7  Last updated: ${formatResultDate(current.updatedOn)}`,
      pageWidth / 2,
      98,
      { align: "center" },
    );

    // Student meta
    doc.setFontSize(10);
    let y = 124;
    const metaLines: Array<[string, string]> = [
      ["Matric Number", matric],
      ["Level", current.level],
      ["Session", current.session],
      ["Semester", current.semester],
    ];
    metaLines.forEach(([label, value], i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = marginX + col * ((pageWidth - marginX * 2) / 2);
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, x, y + row * 16);
      doc.setFont("helvetica", "normal");
      doc.text(value, x + 90, y + row * 16);
    });
    y += Math.ceil(metaLines.length / 2) * 16 + 8;

    // Courses table
    autoTable(doc, {
      startY: y,
      head: [["Code", "Course", "Unit", "CA", "Exam", "Total", "Grade"]],
      body: current.courses.map((r) => [
        r.code,
        r.title,
        String(r.unit),
        String(r.ca),
        String(r.exam),
        String(r.total),
        r.grade || gradeFromTotal(r.total),
      ]),
      styles: { fontSize: 9, cellPadding: 5 },
      headStyles: { fillColor: [30, 58, 95], textColor: 255, fontStyle: "bold" },
      columnStyles: {
        0: { cellWidth: 60, fontStyle: "bold" },
        2: { halign: "center", cellWidth: 35 },
        3: { halign: "center", cellWidth: 35 },
        4: { halign: "center", cellWidth: 40 },
        5: { halign: "center", cellWidth: 45, fontStyle: "bold" },
        6: { halign: "center", cellWidth: 45, fontStyle: "bold" },
      },
      margin: { left: marginX, right: marginX },
    });

    // Summary
    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 18;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Summary", marginX, finalY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const summary: Array<[string, string]> = [
      ["Total Units", String(totalUnits)],
      ["Average Score", `${avg}%`],
      ["Semester GPA", computedGpa],
      ["Cumulative GPA", cgpa],
    ];
    summary.forEach(([label, value], i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = marginX + col * ((pageWidth - marginX * 2) / 2);
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, x, finalY + 18 + row * 16);
      doc.setFont("helvetica", "normal");
      doc.text(value, x + 110, finalY + 18 + row * 16);
    });

    // Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()} \u00B7 System-generated transcript excerpt \u2014 valid only with official seal.`,
      pageWidth / 2,
      pageHeight - 30,
      { align: "center" },
    );

    const safe = (s: string) => s.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
    doc.save(`transcript-${safe(matric)}-${safe(current.session)}-${safe(current.semester)}.pdf`);
  };

  return (
    <div>
      <SectionHeader
        title="Results & GPA"
        subtitle="View current and past semester results, scores and grades."
        action={
          <div className="flex gap-2 print:hidden">
            <button
              type="button"
              onClick={printTranscript}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition"
            >
              <Printer className="h-4 w-4" /> Print
            </button>
            <button
              type="button"
              onClick={downloadTranscriptPdf}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-primary text-sm font-bold hover:border-gold transition"
            >
              <Download className="h-4 w-4" /> Download PDF
            </button>
          </div>
        }
      />

      {/* Semester selector */}
      <div className="print:hidden">
      <div className="rounded-2xl border border-border bg-card p-4 mb-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Select Semester</div>
        <div className="flex flex-wrap gap-2">
          {pastResults.map((s) => {
            const k = semesterKey(s);
            const active = k === selected;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setSelected(k)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary/50"
                }`}
              >
                {s.session} · {s.semester} · {s.level}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-5">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Semester GPA</p>
          <p className="font-display font-extrabold text-3xl text-primary mt-1">{computedGpa}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">CGPA</p>
          <p className="font-display font-extrabold text-3xl text-primary mt-1">{cgpa}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Average Score</p>
          <p className="font-display font-extrabold text-3xl text-primary mt-1">{avg}%</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Total Units</p>
          <p className="font-display font-extrabold text-3xl text-primary mt-1">{totalUnits}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="font-display font-extrabold text-base text-foreground">{current.session} — {current.semester} Semester</p>
              <p className="text-xs text-muted-foreground">{current.level}</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Official Transcript Excerpt</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
              {current.session} · {current.semester} Semester
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusBadgeClasses(current.status)}`}>
              {current.status}
            </span>
            <span>Submitted: <span className="font-semibold text-foreground">{formatResultDate(current.submittedOn)}</span></span>
            <span>Last updated: <span className="font-semibold text-foreground">{formatResultDate(current.updatedOn)}</span></span>
          </div>
        </div>
        <div className="grid grid-cols-12 px-5 py-3 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border bg-muted/20">
          <div className="col-span-2">Code</div>
          <div className="col-span-4">Course</div>
          <div className="col-span-1 text-center">Unit</div>
          <div className="col-span-1 text-center">CA</div>
          <div className="col-span-1 text-center">Exam</div>
          <div className="col-span-2 text-center">Total</div>
          <div className="col-span-1 text-right">Grade</div>
        </div>
        {current.courses.map((r) => {
          const grade = r.grade || gradeFromTotal(r.total);
          return (
            <div key={r.code} className="grid grid-cols-12 items-center px-5 py-3.5 border-b border-border last:border-0">
              <div className="col-span-2 text-sm font-bold text-primary">{r.code}</div>
              <div className="col-span-4 text-sm text-foreground">{r.title}</div>
              <div className="col-span-1 text-center text-sm">{r.unit}</div>
              <div className="col-span-1 text-center text-sm">{r.ca}</div>
              <div className="col-span-1 text-center text-sm">{r.exam}</div>
              <div className="col-span-2 text-center text-sm font-semibold">{r.total}</div>
              <div className="col-span-1 text-right">
                <span className={`inline-flex items-center justify-center h-7 w-7 rounded-full font-display font-extrabold text-sm ${grade === "A" ? "bg-gold text-primary" : "bg-primary/10 text-primary"}`}>
                  {grade}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Past semesters summary */}
      <div className="mt-6 rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30">
          <p className="font-display font-extrabold text-base text-foreground">Past Semesters Summary</p>
          <p className="text-xs text-muted-foreground">Click any row to view full breakdown above.</p>
        </div>
        {pastResults.map((s) => {
          const k = semesterKey(s);
          const active = k === selected;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setSelected(k)}
              className={`w-full px-5 py-3.5 border-b border-border last:border-0 text-left transition ${
                active ? "bg-primary/5" : "hover:bg-muted/30"
              }`}
            >
              <div className="grid grid-cols-12 items-center">
                <div className="col-span-3 text-sm font-bold text-foreground">{s.session}</div>
                <div className="col-span-3 text-sm">{s.semester} Semester</div>
                <div className="col-span-2 text-sm text-muted-foreground">{s.level}</div>
                <div className="col-span-2 text-sm text-center">{s.courses.length} courses</div>
                <div className="col-span-2 text-right">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    GPA {s.gpa.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusBadgeClasses(s.status)}`}>
                  {s.status}
                </span>
                <span>Submitted: <span className="font-semibold text-foreground">{formatResultDate(s.submittedOn)}</span></span>
                <span>Last updated: <span className="font-semibold text-foreground">{formatResultDate(s.updatedOn)}</span></span>
              </div>
            </button>
          );
        })}
      </div>
      </div>

      {/* Print-only transcript excerpt */}
      <div className="hidden print:block">
        <div className="p-0">
          <div className="text-center border-b-2 border-primary pb-5">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold">Federal Republic of Nigeria</p>
            <h3 className="font-display font-extrabold text-xl text-primary mt-1">
              College of Nursing Sciences · Tambuwal
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">Official Transcript Excerpt — Semester Result</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {current.session} · {current.semester} Semester · Status: <span className="font-semibold text-foreground">{current.status}</span> · Submitted: <span className="font-semibold text-foreground">{formatResultDate(current.submittedOn)}</span> · Last updated: <span className="font-semibold text-foreground">{formatResultDate(current.updatedOn)}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-5 text-sm">
            {[
              { label: "Name", value: "Ibrahim Akanni" },
              { label: "Matric No.", value: matric },
              { label: "Department", value: "General Nursing" },
              { label: "Level", value: current.level },
              { label: "Session", value: current.session },
              { label: "Semester", value: `${current.semester} Semester` },
            ].map((r) => (
              <div key={r.label} className="flex justify-between gap-3 border-b border-border/60 pb-1.5">
                <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">{r.label}</span>
                <span className="text-foreground font-semibold text-right">{r.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <div className="grid grid-cols-12 px-4 py-2.5 text-[10px] uppercase tracking-wider font-bold text-muted-foreground bg-muted/40 border-b border-border">
              <div className="col-span-1">S/N</div>
              <div className="col-span-2">Code</div>
              <div className="col-span-4">Course Title</div>
              <div className="col-span-1 text-center">Unit</div>
              <div className="col-span-1 text-center">CA</div>
              <div className="col-span-1 text-center">Exam</div>
              <div className="col-span-1 text-center">Total</div>
              <div className="col-span-1 text-center">Grade</div>
            </div>
            {current.courses.map((c, i) => {
              const grade = c.grade || gradeFromTotal(c.total);
              return (
                <div key={c.code} className="grid grid-cols-12 items-center px-4 py-2.5 text-sm border-b border-border last:border-0">
                  <div className="col-span-1 text-muted-foreground">{i + 1}</div>
                  <div className="col-span-2 font-bold text-primary">{c.code}</div>
                  <div className="col-span-4">{c.title}</div>
                  <div className="col-span-1 text-center">{c.unit}</div>
                  <div className="col-span-1 text-center">{c.ca}</div>
                  <div className="col-span-1 text-center">{c.exam}</div>
                  <div className="col-span-1 text-center font-semibold">{c.total}</div>
                  <div className="col-span-1 text-center font-display font-extrabold">{grade}</div>
                </div>
              );
            })}
            <div className="grid grid-cols-12 items-center px-4 py-2.5 text-sm bg-muted/30">
              <div className="col-span-7 text-right font-bold uppercase tracking-wider text-[11px] text-muted-foreground">Totals</div>
              <div className="col-span-1 text-center font-display font-extrabold text-primary">{totalUnits}</div>
              <div className="col-span-3" />
              <div className="col-span-1 text-center font-display font-extrabold text-primary">GPA {computedGpa}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
            <div className="border border-border rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Semester GPA</p>
              <p className="font-display font-extrabold text-lg text-primary">{computedGpa}</p>
            </div>
            <div className="border border-border rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">CGPA</p>
              <p className="font-display font-extrabold text-lg text-primary">{cgpa}</p>
            </div>
            <div className="border border-border rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Average Score</p>
              <p className="font-display font-extrabold text-lg text-primary">{avg}%</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-10 pt-4">
            <div className="border-t border-foreground/40 pt-1.5 text-xs text-muted-foreground">Examination Officer's Signature & Date</div>
            <div className="border-t border-foreground/40 pt-1.5 text-xs text-muted-foreground">Head of Department's Signature & Date</div>
          </div>

          <p className="mt-6 text-center text-[10px] text-muted-foreground">
            Generated on {new Date().toLocaleDateString()} · This is a system-generated transcript excerpt and is valid only with official seal.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------- Messages ----------
function MessagesView() {
  const [active, setActive] = useState(0);
  return (
    <div>
      <SectionHeader title="Messages" subtitle="Chat with lecturers and receive direct announcements." />
      <div className="rounded-2xl border border-border bg-card overflow-hidden grid grid-cols-1 md:grid-cols-[300px_1fr] min-h-[480px]">
        <div className="border-r border-border">
          {messages.map((m, i) => (
            <button
              key={m.from}
              type="button"
              onClick={() => setActive(i)}
              className={`w-full text-left px-4 py-3 border-b border-border flex gap-3 transition ${active === i ? "bg-primary/5" : "hover:bg-muted/30"}`}
            >
              <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground font-display font-extrabold flex items-center justify-center text-sm shrink-0">
                {m.from.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-primary truncate">{m.from}</p>
                  <span className="text-[10px] text-muted-foreground shrink-0">{m.time}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{m.preview}</p>
              </div>
              {m.unread && <span className="h-2 w-2 rounded-full bg-gold mt-2 shrink-0" />}
            </button>
          ))}
        </div>
        <div className="flex flex-col">
          <div className="px-5 py-3 border-b border-border">
            <p className="font-display font-bold text-primary">{messages[active].from}</p>
            <p className="text-xs text-muted-foreground">{messages[active].role}</p>
          </div>
          <div className="flex-1 p-5 space-y-3 bg-muted/20 overflow-y-auto">
            <div className="max-w-md rounded-2xl rounded-tl-sm bg-card border border-border p-3 text-sm">
              {messages[active].preview}
            </div>
            <div className="ml-auto max-w-md rounded-2xl rounded-tr-sm bg-primary text-primary-foreground p-3 text-sm">
              Thank you, I will review it.
            </div>
          </div>
          <div className="p-3 border-t border-border flex gap-2">
            <input
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-card focus:outline-none focus:border-gold"
            />
            <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition">
              <Send className="h-4 w-4" /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Announcements ----------
function AnnouncementsView() {
  return (
    <div>
      <SectionHeader title="Announcements" subtitle="Department updates, school notices, and course-specific alerts." />
      <div className="space-y-3">
        {announcements.map((a) => (
          <div key={a.title} className="rounded-xl border border-border bg-card p-5 flex gap-4 hover:border-gold transition">
            <div className="shrink-0 h-14 w-14 rounded-lg bg-primary/10 text-primary flex flex-col items-center justify-center text-xs font-bold uppercase tracking-wide leading-tight">
              {a.date.split(" ")[0]}
              <span className="text-primary/70">{a.date.split(" ")[1]}</span>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-gold">{a.tag}</span>
              <p className="text-sm text-foreground mt-0.5">{a.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Registration ----------
function RegistrationView() {
  const paid = useTuitionPaid();

  if (!paid) {
    return (
      <div>
        <SectionHeader title="Course Registration" subtitle="Pay your school fees to unlock course registration." />
        <div className="rounded-2xl border-2 border-dashed border-gold/50 bg-gold/5 p-8 text-center">
          <Lock className="h-10 w-10 mx-auto text-gold" />
          <h3 className="mt-3 font-display font-extrabold text-xl text-primary">School fees not paid</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            You must pay your tuition fee for {`2025/2026`} before you can register your courses for the semester.
          </p>
          <button
            type="button"
            onClick={() => navRef.setView?.("payments")}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition"
          >
            <CreditCard className="h-4 w-4" /> Go to Payments
          </button>
        </div>
      </div>
    );
  }

  return <CourseRegistrationForm />;
}

// Available courses pool for registration
const availableCourses = [
  { code: "NUR 201", title: "Foundations of Nursing", units: 3, semester: "First", required: true },
  { code: "NUR 203", title: "Anatomy & Physiology II", units: 4, semester: "First", required: true },
  { code: "NUR 205", title: "Microbiology for Nurses", units: 2, semester: "First", required: true },
  { code: "NUR 207", title: "Pharmacology I", units: 3, semester: "First", required: true },
  { code: "NUR 209", title: "Community Health", units: 2, semester: "First", required: false },
  { code: "GST 201", title: "Nigerian Peoples & Culture", units: 2, semester: "First", required: true },
  { code: "NUR 211", title: "Medical-Surgical Nursing I", units: 3, semester: "First", required: false },
  { code: "GST 203", title: "Use of English II", units: 2, semester: "First", required: false },
  { code: "NUR 213", title: "Nursing Ethics & Jurisprudence", units: 2, semester: "First", required: false },
];

const MIN_UNITS = 12;
const MAX_UNITS = 24;

function CourseRegistrationForm() {
  const [session, setSession] = useState("2025/2026");
  const [semester, setSemester] = useState("First Semester");
  const [level, setLevel] = useState("200 Level");
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(availableCourses.filter((c) => c.required).map((c) => c.code)),
  );
  const [declaration, setDeclaration] = useState(false);
  const [submitted, setSubmitted] = useState<null | { ref: string; date: string }>(null);

  const totalUnits = availableCourses
    .filter((c) => selected.has(c.code))
    .reduce((s, c) => s + c.units, 0);

  const toggle = (code: string) => {
    const c = availableCourses.find((x) => x.code === code);
    if (c?.required) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const validationError =
    selected.size === 0
      ? "Select at least one course"
      : totalUnits < MIN_UNITS
        ? `Minimum credit units is ${MIN_UNITS} (currently ${totalUnits})`
        : totalUnits > MAX_UNITS
          ? `Maximum credit units is ${MAX_UNITS} (currently ${totalUnits})`
          : !declaration
            ? "You must accept the declaration"
            : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validationError) return;
    setSubmitted({
      ref: `REG-${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toLocaleString(),
    });
  };

  if (submitted) {
    return (
      <div>
        <SectionHeader title="Course Registration" subtitle="Your courses have been submitted." />
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-display font-extrabold text-2xl text-primary">Registration Submitted</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {session} · {semester} · {level}
          </p>
          <div className="mt-5 inline-flex flex-col gap-1 text-left bg-muted/30 rounded-lg px-5 py-3">
            <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Reference</p>
            <p className="font-mono text-sm font-bold text-primary">{submitted.ref}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Submitted: {submitted.date}</p>
            <p className="text-[11px] text-muted-foreground">{selected.size} courses · {totalUnits} units</p>
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => alert("Course registration form printed (demo).")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition"
            >
              <Printer className="h-4 w-4" /> Print Form
            </button>
            <button
              onClick={() => setSubmitted(null)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-primary text-sm font-bold hover:border-gold transition"
            >
              Edit Registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Course Registration"
        subtitle={`${selected.size} courses selected · ${totalUnits} credit units (min ${MIN_UNITS}, max ${MAX_UNITS})`}
      />
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Session / semester / level */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-display font-extrabold text-base text-primary mb-4">Academic Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SelectField label="Session" value={session} onChange={setSession} options={["2024/2025", "2025/2026", "2026/2027"]} />
            <SelectField label="Semester" value={semester} onChange={setSemester} options={["First Semester", "Second Semester"]} />
            <SelectField label="Level" value={level} onChange={setLevel} options={["100 Level", "200 Level", "300 Level", "400 Level"]} />
          </div>
        </div>

        {/* Courses */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-extrabold text-base text-primary">Available Courses</h3>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${totalUnits >= MIN_UNITS && totalUnits <= MAX_UNITS ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
              {totalUnits} / {MAX_UNITS} units
            </span>
          </div>
          <div className="grid grid-cols-12 px-5 py-3 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border bg-muted/30">
            <div className="col-span-1"></div>
            <div className="col-span-2">Code</div>
            <div className="col-span-6">Course Title</div>
            <div className="col-span-2 text-center">Units</div>
            <div className="col-span-1 text-right">Type</div>
          </div>
          {availableCourses.map((c) => {
            const checked = selected.has(c.code);
            return (
              <label
                key={c.code}
                className={`grid grid-cols-12 items-center px-5 py-3.5 border-b border-border last:border-0 cursor-pointer hover:bg-muted/20 transition ${c.required ? "opacity-95" : ""}`}
              >
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={c.required}
                    onChange={() => toggle(c.code)}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                </div>
                <div className="col-span-2 text-sm font-bold text-primary">{c.code}</div>
                <div className="col-span-6 text-sm text-foreground">{c.title}</div>
                <div className="col-span-2 text-center text-sm font-semibold">{c.units}</div>
                <div className="col-span-1 text-right">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${c.required ? "text-destructive" : "text-muted-foreground"}`}>
                    {c.required ? "Core" : "Elective"}
                  </span>
                </div>
              </label>
            );
          })}
        </div>

        {/* Declaration */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={declaration}
              onChange={(e) => setDeclaration(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
            />
            <span className="text-sm text-foreground">
              I declare that the courses selected above are accurate and conform to my approved programme of study.
              I understand that registration is final once submitted and any changes must be approved by my Head of Department.
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className={`text-xs font-semibold ${validationError ? "text-destructive" : "text-muted-foreground"}`}>
            {validationError || "All requirements met. You can submit your registration."}
          </p>
          <button
            type="submit"
            disabled={!!validationError}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <FileCheck className="h-4 w-4" /> Submit Registration
          </button>
        </div>
      </form>
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

// ---------- Payments ----------
type PayCategory = "application" | "tuition" | "acceptance" | "hostel" | "library";
type PayItem = { label: string; amount: string; amountValue: number; status: "paid" | "pending"; key: PayCategory };

function PaymentsView({ matric }: { matric: string }) {
  const [items, setItems] = useState<PayItem[]>([
    { key: "application", label: "Application Fee — 2025/2026", amount: "₦10,000", amountValue: 10000, status: "paid" },
    { key: "acceptance", label: "Acceptance Fee", amount: "₦25,000", amountValue: 25000, status: "paid" },
    { key: "tuition", label: "Tuition Fee — 2025/2026", amount: "₦150,000", amountValue: 150000, status: tuitionPaid.value ? "paid" : "pending" },
    { key: "hostel", label: "Hostel Accommodation", amount: "₦40,000", amountValue: 40000, status: "pending" },
    { key: "library", label: "Library & ID Card", amount: "₦5,000", amountValue: 5000, status: "paid" },
  ]);
  const [checkout, setCheckout] = useState<PayItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = (key: PayItem["key"]) => {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, status: "paid" } : it)));
    if (key === "tuition") {
      tuitionPaid.value = true;
      tuitionPaid.notify();
    }
    setCheckout(null);
  };

  const buildReceiptPayload = (it: PayItem) => {
    const isApplication = it.key === "application";
    return {
      category: it.key,
      feeLabel: it.label,
      amount: it.amount,
      studentName: "Ibrahim Akanni",
      matric: isApplication ? undefined : matric,
      applicationNo: isApplication ? `APP/2025/${matric.split("/").pop() || "0001"}` : undefined,
      programme: "B.NSc Nursing Sciences",
      session: "2025/2026",
    };
  };

  const downloadReceipt = (it: PayItem) => {
    if (it.status !== "paid") {
      setError(`Cannot download receipt for "${it.label}" — this fee has not been paid yet. Please complete payment first.`);
      setTimeout(() => setError(null), 5000);
      return;
    }
    setError(null);
    downloadReceiptPDF(buildReceiptPayload(it));
  };

  const printReceipt = (it: PayItem) => {
    if (it.status !== "paid") {
      setError(`Cannot print receipt for "${it.label}" — this fee has not been paid yet.`);
      setTimeout(() => setError(null), 5000);
      return;
    }
    setError(null);
    downloadReceiptPDF({ ...buildReceiptPayload(it), print: true });
  };

  return (
    <div>
      <SectionHeader title="Payments" subtitle="View invoices, pay fees and download receipts." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Total Paid</p>
          <p className="font-display font-extrabold text-2xl text-primary mt-1">₦180,000</p>
        </div>
        <div className="rounded-2xl border border-gold/40 bg-gold/5 p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Outstanding</p>
          <p className="font-display font-extrabold text-2xl text-primary mt-1">₦40,000</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Receipts</p>
          <p className="font-display font-extrabold text-2xl text-primary mt-1">3 available</p>
        </div>
      </div>
      {error && (
        <div role="alert" className="mb-4 flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Receipt className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{it.label}</p>
              <p className="text-xs text-muted-foreground">{it.amount}</p>
            </div>
            {it.status === "paid" ? (
              <div className="flex items-center gap-2">
                <button onClick={() => downloadReceipt(it)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-primary text-xs font-bold hover:border-gold transition">
                  <Download className="h-3.5 w-3.5" /> Receipt
                </button>
                <button onClick={() => printReceipt(it)} title="Print (A4)" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-primary text-xs font-bold hover:border-gold transition">
                  <Printer className="h-3.5 w-3.5" /> Print
                </button>
              </div>
            ) : (
              <button onClick={() => setCheckout(it)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold text-primary text-xs font-bold hover:brightness-95 transition">
                <CreditCard className="h-3.5 w-3.5" /> Pay Now
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Receipt History — Application Fee & Tuition Fee */}
      <div className="mt-6">
        <h3 className="font-display font-extrabold text-base text-primary uppercase tracking-tight mb-3 flex items-center gap-2">
          <Receipt className="h-4 w-4" /> Receipt History
        </h3>
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {items
            .filter((it) => it.key === "application" || it.key === "tuition")
            .map((it) => {
              const paid = it.status === "paid";
              return (
                <div key={`receipt-${it.key}`} className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${paid ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                    <Receipt className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {it.key === "application" ? "Application Fee Receipt" : "Tuition Fee Receipt"}
                    </p>
                    <p className="text-xs text-muted-foreground">{it.label} · {it.amount}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${paid ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                    {paid ? "Paid" : "Unpaid"}
                  </span>
                  {paid ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => downloadReceipt(it)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:brightness-110 transition"
                      >
                        <Download className="h-3.5 w-3.5" /> Download
                      </button>
                      <button
                        onClick={() => printReceipt(it)}
                        title="Print on A4"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-primary text-xs font-bold hover:border-gold transition"
                      >
                        <Printer className="h-3.5 w-3.5" /> Print
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-muted-foreground italic">Pay to unlock</span>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      <PaystackCheckoutModal
        open={!!checkout}
        email="student@constambuwal.edu.ng"
        amountNGN={checkout?.amountValue ?? 0}
        description={checkout?.label}
        onClose={() => setCheckout(null)}
        onSuccess={() => checkout && handleSuccess(checkout.key)}
      />
    </div>
  );
}

// ---------- Profile ----------
function ProfileView({ matric }: { matric: string }) {
  return (
    <div>
      <SectionHeader title="Profile" subtitle="Update your personal information and account security." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <div className="flex justify-center">
            <UserAvatar
              userKey={`student:${matric}`}
              initials="IA"
              sizeClassName="h-28 w-28"
              textClassName="text-4xl"
              fallbackClassName="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground"
              editable
            />
          </div>
          <p className="mt-4 font-display font-extrabold text-lg text-primary">Ibrahim Akanni</p>
          <p className="text-xs text-muted-foreground">{matric}</p>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Tap the camera to upload a new photo. It updates everywhere instantly.
          </p>
        </div>
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" value="Ibrahim Akanni" />
            <Field label="Matric Number" value={matric} readOnly />
            <Field label="Email" value="ibrahim.a@cons.edu.ng" />
            <Field label="Phone" value="+234 803 000 0000" />
            <Field label="Department" value="General Nursing" readOnly />
            <Field label="Level" value="200" readOnly />
          </div>
          <div className="pt-4 border-t border-border flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition">
              Save Changes
            </button>
            <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-primary text-sm font-bold hover:border-gold transition">
              <Lock className="h-4 w-4" /> Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, readOnly }: { label: string; value: string; readOnly?: boolean }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{label}</span>
      <input
        defaultValue={value}
        readOnly={readOnly}
        className={`mt-1 w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-gold ${readOnly ? "opacity-70 cursor-not-allowed" : ""}`}
      />
    </label>
  );
}

// ===================== OAU MODULES =====================

function BiodataModule({ matric }: { matric: string }) {
  return (
    <PlaceholderView
      icon={IdCard}
      title="Update Biodata Information"
      subtitle="Keep your personal records and next-of-kin details up to date."
      actions={[
        {
          label: "Edit personal details",
          panel: (
            <FormPanel title="Personal Details" description="Information that appears on your student ID and transcript.">
              <FormField label="Surname" defaultValue="Akanni" />
              <FormField label="First Name" defaultValue="Ibrahim" />
              <FormField label="Other Names" defaultValue="Olawale" />
              <FormField label="Matric Number" defaultValue={matric} readOnly />
              <FormField label="Date of Birth" type="date" defaultValue="2005-04-12" />
              <FormField label="Gender" options={["Male", "Female"]} />
              <FormField label="Marital Status" options={["Single", "Married", "Other"]} />
              <FormField label="State of Origin" defaultValue="Sokoto" />
              <FormField label="LGA" defaultValue="Tambuwal" />
              <FormField label="Nationality" defaultValue="Nigerian" />
            </FormPanel>
          ),
        },
        {
          label: "Update next of kin",
          panel: (
            <FormPanel title="Next of Kin" description="Person to contact in case of emergency.">
              <FormField label="Full Name" placeholder="e.g. Mrs. Aisha Akanni" />
              <FormField label="Relationship" options={["Parent", "Guardian", "Sibling", "Spouse", "Other"]} />
              <FormField label="Phone Number" type="tel" placeholder="+234..." />
              <FormField label="Email" type="email" placeholder="name@example.com" />
              <FormField label="Address" textarea placeholder="House address" />
            </FormPanel>
          ),
        },
        {
          label: "Update sponsor information",
          panel: (
            <FormPanel title="Sponsor Information" description="The person funding your education.">
              <FormField label="Sponsor Name" />
              <FormField label="Occupation" />
              <FormField label="Phone Number" type="tel" />
              <FormField label="Email" type="email" />
              <FormField label="Office Address" textarea />
            </FormPanel>
          ),
        },
      ]}
    />
  );
}

function HealthModule() {
  return (
    <PlaceholderView
      icon={HeartPulse}
      title="Health Centre Registration"
      subtitle="Register at the campus health centre and view your medical record."
      actions={[
        {
          label: "Register at Health Centre",
          panel: (
            <FormPanel title="Health Centre Registration" submitLabel="Submit Registration">
              <FormField label="Blood Group" options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} />
              <FormField label="Genotype" options={["AA", "AS", "SS", "AC", "SC"]} />
              <FormField label="Height (cm)" type="number" />
              <FormField label="Weight (kg)" type="number" />
              <FormField label="Allergies" placeholder="None / list allergies" />
              <FormField label="Existing Medical Conditions" textarea placeholder="None / details" />
              <FormField label="Emergency Contact Name" />
              <FormField label="Emergency Contact Phone" type="tel" />
            </FormPanel>
          ),
        },
        {
          label: "View medical history",
          panel: (
            <InfoList
              items={[
                { label: "Last visit", value: "12 Mar 2026 — Routine check", status: "ok" },
                { label: "Vaccination", value: "Yellow fever (booster) — 02 Feb 2026", status: "ok" },
                { label: "Chronic condition", value: "None recorded" },
                { label: "Pending lab result", value: "Malaria parasite test", status: "pending" },
              ]}
            />
          ),
        },
        {
          label: "Book appointment",
          panel: (
            <FormPanel title="Book an Appointment" submitLabel="Book Appointment">
              <FormField label="Preferred Date" type="date" />
              <FormField label="Preferred Time" options={["Morning (8–11)", "Afternoon (12–3)", "Evening (4–6)"]} />
              <FormField label="Department" options={["General OPD", "Dental", "Counselling", "Lab"]} />
              <FormField label="Reason" textarea placeholder="Briefly describe your symptoms" />
            </FormPanel>
          ),
        },
      ]}
    />
  );
}

function AssessmentModule() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const items = ["Course content", "Lecturer's clarity", "Punctuality", "Assessment fairness", "Engagement"];
  return (
    <PlaceholderView
      icon={Star}
      title="Teaching Assessment"
      subtitle="Rate the quality of teaching for each course this semester."
      actions={[
        {
          label: "Begin assessment",
          panel: (
            <div className="space-y-5">
              <FormField label="Select Course" options={courses.map((c) => `${c.code} — ${c.title}`)} />
              <div className="rounded-xl border border-border divide-y divide-border">
                {items.map((q) => (
                  <div key={q} className="flex items-center justify-between gap-4 px-4 py-3">
                    <p className="text-sm font-semibold text-foreground">{q}</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setRatings((r) => ({ ...r, [q]: n }))}
                          className={`h-8 w-8 rounded-md flex items-center justify-center transition ${
                            (ratings[q] ?? 0) >= n ? "bg-gold text-primary" : "bg-muted text-muted-foreground hover:bg-gold/40"
                          }`}
                        >
                          <Star className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <FormField label="Additional Comments" textarea placeholder="Optional feedback to the lecturer." />
              <button
                type="button"
                onClick={() => alert("Assessment submitted (demo).")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition"
              >
                <CheckCircle2 className="h-4 w-4" /> Submit Assessment
              </button>
            </div>
          ),
        },
        {
          label: "View completed assessments",
          panel: (
            <InfoList
              items={courses.slice(0, 4).map((c, i) => ({
                label: `${c.code} — ${c.title}`,
                value: i % 2 === 0 ? "Submitted on 02 Apr 2026" : "Not yet submitted",
                status: i % 2 === 0 ? "ok" : "pending",
              }))}
            />
          ),
        },
      ]}
    />
  );
}

function HostelModule() {
  return (
    <PlaceholderView
      icon={Home}
      title="Hostel Application"
      subtitle="Apply for on-campus accommodation and check allocation status."
      actions={[
        {
          label: "Apply for hostel",
          panel: (
            <FormPanel title="Hostel Application Form" submitLabel="Submit Application">
              <FormField label="Hostel Preference 1" options={["Block A — Female", "Block B — Female", "Block C — Male", "Block D — Male"]} />
              <FormField label="Hostel Preference 2" options={["Block A — Female", "Block B — Female", "Block C — Male", "Block D — Male"]} />
              <FormField label="Room Type" options={["Single", "Double", "Quadruple"]} />
              <FormField label="Special Needs" placeholder="e.g. ground floor, accessible bathroom" />
              <FormField label="Roommate Request (Matric No.)" placeholder="Optional" />
            </FormPanel>
          ),
        },
        {
          label: "Check allocation",
          panel: (
            <InfoList
              items={[
                { label: "Application status", value: "Approved", status: "ok" },
                { label: "Allocated block", value: "Block A — Female" },
                { label: "Room number", value: "A-204 (Bed 2)" },
                { label: "Resume date", value: "Mon, 28 Apr 2026" },
                { label: "Hostel fee", value: "₦40,000 — Outstanding", status: "warn" },
              ]}
            />
          ),
        },
        {
          label: "Pay hostel fee",
          panel: (
            <FormPanel title="Pay Hostel Fee" submitLabel="Proceed to Payment">
              <FormField label="Amount" defaultValue="₦40,000" readOnly />
              <FormField label="Payment Method" options={["Card", "Bank Transfer", "USSD"]} />
              <FormField label="Phone for receipt" type="tel" />
              <FormField label="Email for receipt" type="email" defaultValue="ibrahim.a@cons.edu.ng" />
            </FormPanel>
          ),
        },
      ]}
    />
  );
}

function PrintCourseFormModule({ matric, session, semester }: { matric: string; session: string; semester: string }) {
  const paid = useTuitionPaid();
  const totalUnits = courses.reduce((s, c) => s + c.units, 0);

  if (!paid) {
    return (
      <div>
        <SectionHeader title="Print Course Registration Form" subtitle="Available after fees are paid and courses are registered." />
        <div className="rounded-2xl border-2 border-dashed border-gold/50 bg-gold/5 p-8 text-center">
          <Lock className="h-10 w-10 mx-auto text-gold" />
          <h3 className="mt-3 font-display font-extrabold text-xl text-primary">No registered courses yet</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Pay your school fees and register your courses to print your course registration form.
          </p>
          <button
            type="button"
            onClick={() => navRef.setView?.("payments")}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition"
          >
            <CreditCard className="h-4 w-4" /> Go to Payments
          </button>
        </div>
      </div>
    );
  }

  const printForm = () => window.print();

  return (
    <div>
      <SectionHeader
        title="Print Course Registration Form"
        subtitle={`${session} · ${semester} · ${courses.length} courses · ${totalUnits} units`}
        action={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={printForm}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition"
            >
              <Printer className="h-4 w-4" /> Print
            </button>
            <button
              type="button"
              onClick={() => alert("PDF downloaded (demo).")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-primary text-sm font-bold hover:border-gold transition"
            >
              <Download className="h-4 w-4" /> Download PDF
            </button>
          </div>
        }
      />
      <div className="rounded-2xl border-2 border-dashed border-border bg-card p-6 md:p-8 print:border-0 print:p-0">
        {/* Letterhead */}
        <div className="text-center border-b-2 border-primary pb-5">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold">Federal Republic of Nigeria</p>
          <h3 className="font-display font-extrabold text-xl md:text-2xl text-primary mt-1">
            College of Nursing Sciences · Tambuwal
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1">Course Registration Form</p>
        </div>

        {/* Student details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-5 text-sm">
          {[
            { label: "Name", value: "Ibrahim Akanni" },
            { label: "Matric No.", value: matric },
            { label: "Department", value: "General Nursing" },
            { label: "Level", value: "200" },
            { label: "Session", value: session },
            { label: "Semester", value: semester },
          ].map((r) => (
            <div key={r.label} className="flex justify-between gap-3 border-b border-border/60 pb-1.5">
              <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">{r.label}</span>
              <span className="text-foreground font-semibold text-right">{r.value}</span>
            </div>
          ))}
        </div>

        {/* Registered courses table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-12 px-4 py-2.5 text-[10px] uppercase tracking-wider font-bold text-muted-foreground bg-muted/40 border-b border-border">
            <div className="col-span-1">S/N</div>
            <div className="col-span-3">Code</div>
            <div className="col-span-6">Course Title</div>
            <div className="col-span-2 text-center">Units</div>
          </div>
          {courses.map((c, i) => (
            <div key={c.code} className="grid grid-cols-12 items-center px-4 py-3 text-sm border-b border-border last:border-0">
              <div className="col-span-1 text-muted-foreground">{i + 1}</div>
              <div className="col-span-3 font-bold text-primary">{c.code}</div>
              <div className="col-span-6 text-foreground">{c.title}</div>
              <div className="col-span-2 text-center font-semibold">{c.units}</div>
            </div>
          ))}
          <div className="grid grid-cols-12 items-center px-4 py-3 text-sm bg-muted/30">
            <div className="col-span-10 text-right font-bold uppercase tracking-wider text-[11px] text-muted-foreground">Total Units</div>
            <div className="col-span-2 text-center font-display font-extrabold text-primary">{totalUnits}</div>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10 pt-4">
          <div>
            <div className="border-t border-foreground/40 pt-1.5 text-xs text-muted-foreground">Student's Signature & Date</div>
          </div>
          <div>
            <div className="border-t border-foreground/40 pt-1.5 text-xs text-muted-foreground">Level Adviser's Signature & Date</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OnlineLearningModule() {
  const live = [
    { course: "NUR 207", topic: "Pharmacology — Antibiotics", time: "Today · 2:00 PM" },
    { course: "NUR 203", topic: "Cardiovascular system", time: "Tomorrow · 10:00 AM" },
  ];
  const recordings = [
    { course: "NUR 201", topic: "Nursing theories — Lecture 4", duration: "48 min" },
    { course: "NUR 205", topic: "Microbiology — Bacteria classification", duration: "55 min" },
    { course: "GST 201", topic: "Nigerian Cultures — Module 2", duration: "42 min" },
  ];
  return (
    <PlaceholderView
      icon={Monitor}
      title="Online Learning"
      subtitle="Join virtual classes, watch recordings and access e-learning materials."
      actions={[
        {
          label: "Join live class",
          panel: (
            <div className="space-y-3">
              {live.map((l) => (
                <div key={l.course + l.topic} className="flex items-center gap-3 p-4 rounded-xl border border-border">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <PlayCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-primary">{l.course} — {l.topic}</p>
                    <p className="text-xs text-muted-foreground">{l.time}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Joining ${l.course} live class (demo).`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition"
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          ),
        },
        {
          label: "Browse recordings",
          panel: (
            <div className="space-y-3">
              {recordings.map((r) => (
                <div key={r.topic} className="flex items-center gap-3 p-4 rounded-xl border border-border">
                  <div className="h-10 w-10 rounded-lg bg-gold/20 text-primary flex items-center justify-center">
                    <PlayCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-primary">{r.course} — {r.topic}</p>
                    <p className="text-xs text-muted-foreground">{r.duration}</p>
                  </div>
                  <button type="button" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-primary text-xs font-bold hover:border-gold transition">
                    <PlayCircle className="h-3.5 w-3.5" /> Watch
                  </button>
                </div>
              ))}
            </div>
          ),
        },
        {
          label: "E-library",
          panel: (
            <div className="space-y-3">
              {["Foundations of Nursing — 5th Ed.", "Anatomy & Physiology Atlas", "Clinical Pharmacology Handbook"].map((t) => (
                <div key={t} className="flex items-center gap-3 p-4 rounded-xl border border-border">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <p className="flex-1 text-sm font-semibold text-foreground">{t}</p>
                  <button type="button" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-primary text-xs font-bold hover:border-gold transition">
                    <Download className="h-3.5 w-3.5" /> Open
                  </button>
                </div>
              ))}
            </div>
          ),
        },
      ]}
    />
  );
}

function PrintExamDocsModule({ matric }: { matric: string }) {
  return (
    <PlaceholderView
      icon={ScrollText}
      title="Print Examination Documentation"
      subtitle="Print your exam slip, attendance card and seat allocation."
      actions={[
        {
          label: "Print exam slip",
          panel: (
            <PrintPreview
              title="Examination Slip"
              footerNote="Bring this slip and your ID card to every examination."
              rows={[
                { label: "Name", value: "Ibrahim Akanni" },
                { label: "Matric No.", value: matric },
                { label: "Level", value: "200" },
                { label: "Department", value: "General Nursing" },
                { label: "Exam Period", value: "May 12 – May 30, 2026" },
                { label: "Number of Papers", value: "6" },
              ]}
            />
          ),
        },
        {
          label: "Print attendance card",
          panel: (
            <PrintPreview
              title="Examination Attendance Card"
              rows={[
                { label: "Name", value: "Ibrahim Akanni" },
                { label: "Matric No.", value: matric },
                { label: "Photo", value: "✓ on file" },
                { label: "Signature", value: "Required at venue" },
              ]}
            />
          ),
        },
        {
          label: "View exam venue",
          panel: (
            <InfoList
              items={[
                { label: "NUR 201 — May 12, 9:00 AM", value: "Hall A, Seat 24" },
                { label: "NUR 203 — May 14, 9:00 AM", value: "Hall B, Seat 11" },
                { label: "NUR 205 — May 16, 1:00 PM", value: "Lab A, Seat 7" },
                { label: "NUR 207 — May 19, 9:00 AM", value: "Hall A, Seat 24" },
                { label: "NUR 209 — May 22, 1:00 PM", value: "Hall C, Seat 33" },
                { label: "GST 201 — May 26, 9:00 AM", value: "Main Hall, Seat 102" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

function PhoneModule() {
  return (
    <PlaceholderView
      icon={Phone}
      title="Update Phone Number"
      subtitle="Change the phone number associated with your portal account."
      actions={[
        {
          label: "Update phone number",
          panel: (
            <FormPanel title="New Phone Number" submitLabel="Send OTP">
              <FormField label="Current Phone" defaultValue="+234 803 000 0000" readOnly />
              <FormField label="New Phone Number" type="tel" placeholder="+234..." />
              <FormField label="Network" options={["MTN", "Airtel", "Glo", "9mobile"]} />
              <FormField label="Account Password" type="password" placeholder="Confirm with password" />
            </FormPanel>
          ),
        },
        {
          label: "Verify by OTP",
          panel: (
            <FormPanel title="Verify OTP" description="Enter the 6-digit code sent to your new number." submitLabel="Verify">
              <FormField label="OTP Code" placeholder="••••••" />
              <FormField label="New Phone" defaultValue="+234 ..." readOnly />
            </FormPanel>
          ),
        },
      ]}
    />
  );
}

function EmailModule() {
  const inbox = [
    { from: "Bursary Office", subject: "Fee receipt available", time: "10:24 AM", unread: true },
    { from: "Dean of Students", subject: "End-of-semester address", time: "Yesterday", unread: true },
    { from: "Library", subject: "Book due reminder", time: "Mon", unread: false },
    { from: "ICT Helpdesk", subject: "Wi-Fi maintenance window", time: "Last week", unread: false },
  ];
  return (
    <PlaceholderView
      icon={Mail}
      title="Check Email"
      subtitle="Open your student email inbox provided by the institution."
      actions={[
        {
          label: "Open inbox",
          panel: (
            <div className="rounded-xl border border-border divide-y divide-border">
              {inbox.map((m) => (
                <div key={m.subject} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition cursor-pointer">
                  <Mail className={`h-4 w-4 ${m.unread ? "text-gold" : "text-muted-foreground"}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm truncate ${m.unread ? "font-bold text-primary" : "text-foreground"}`}>{m.from}</p>
                    <p className="text-xs text-muted-foreground truncate">{m.subject}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{m.time}</span>
                </div>
              ))}
            </div>
          ),
        },
        {
          label: "Compose new email",
          panel: (
            <FormPanel title="New Message" submitLabel="Send Email">
              <FormField label="To" placeholder="recipient@cons.edu.ng" type="email" />
              <FormField label="Cc" placeholder="optional" type="email" />
              <FormField label="Subject" placeholder="Message subject" />
              <FormField label="Priority" options={["Normal", "High", "Low"]} />
              <div className="md:col-span-2">
                <FormField label="Message" textarea placeholder="Type your message..." />
              </div>
            </FormPanel>
          ),
        },
      ]}
    />
  );
}

function TranscriptModule({ matric }: { matric: string }) {
  return (
    <PlaceholderView
      icon={FileText}
      title="Transcript Request"
      subtitle="Request an official academic transcript to be sent to an institution."
      actions={[
        {
          label: "Request transcript",
          panel: (
            <FormPanel title="Transcript Request" submitLabel="Submit Request">
              <FormField label="Student Name" defaultValue="Ibrahim Akanni" readOnly />
              <FormField label="Matric No." defaultValue={matric} readOnly />
              <FormField label="Type" options={["Official (sealed)", "Student copy", "Notarised"]} />
              <FormField label="Number of Copies" type="number" defaultValue="1" />
              <FormField label="Delivery Method" options={["Courier", "Pickup", "Email to Institution"]} />
              <FormField label="Recipient Institution" placeholder="University / Employer name" />
              <div className="md:col-span-2">
                <FormField label="Recipient Address" textarea placeholder="Full mailing address" />
              </div>
            </FormPanel>
          ),
        },
        {
          label: "Track request status",
          panel: (
            <InfoList
              items={[
                { label: "REQ-2026-0142 · Univ. of Ibadan", value: "Dispatched on 10 Apr 2026", status: "ok" },
                { label: "REQ-2026-0098 · Lagos Business School", value: "In production at Registry", status: "pending" },
                { label: "REQ-2025-1009 · Personal copy", value: "Awaiting payment", status: "warn" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

function ClearanceModule() {
  return (
    <PlaceholderView
      icon={ShieldCheck}
      title="Clearance"
      subtitle="Complete admission, semester and graduation clearance steps."
      actions={[
        {
          label: "Admission clearance",
          panel: (
            <InfoList
              items={[
                { label: "O'Level Result Verification", value: "Verified", status: "ok" },
                { label: "JAMB Result Verification", value: "Verified", status: "ok" },
                { label: "Birth Certificate", value: "Uploaded", status: "ok" },
                { label: "Medical Fitness Certificate", value: "Awaiting upload", status: "warn" },
              ]}
            />
          ),
        },
        {
          label: "Semester clearance",
          panel: (
            <InfoList
              items={[
                { label: "Tuition Fee", value: "Paid in full", status: "ok" },
                { label: "Course Registration", value: "Submitted", status: "ok" },
                { label: "Library Returns", value: "1 book outstanding", status: "warn" },
                { label: "Hostel Clearance", value: "Pending", status: "pending" },
              ]}
            />
          ),
        },
        {
          label: "Final year clearance",
          panel: (
            <FormPanel title="Final Year Clearance" submitLabel="Submit for Review">
              <FormField label="Project Submitted" options={["Yes", "No"]} />
              <FormField label="Library Clearance" options={["Cleared", "Pending"]} />
              <FormField label="Bursary Clearance" options={["Cleared", "Pending"]} />
              <FormField label="Department Clearance" options={["Cleared", "Pending"]} />
              <FormField label="Hostel Clearance" options={["Cleared", "Pending", "Not applicable"]} />
              <FormField label="Alumni Registration" options={["Done", "Not yet"]} />
            </FormPanel>
          ),
        },
      ]}
    />
  );
}

