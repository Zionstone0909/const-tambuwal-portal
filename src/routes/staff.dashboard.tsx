import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PortalHeader } from "@/components/PortalHeader";
import { UserAvatar } from "@/components/UserAvatar";
import {
  BookOpen,
  Users,
  ClipboardCheck,
  Megaphone,
  CalendarDays,
  FileText,
  Settings,
  LogOut,
  Upload,
  PlusCircle,
  GraduationCap,
  Pin,
  PinOff,
  Trash2,
  Send,
  IdCard,
  Wallet,
  Plane,
  Mail,
  Star,
  ScrollText,
  UserCheck,
  FileSignature,
  ChevronRight,
} from "lucide-react";
import {
  ALL_STAFF_COURSES,
  type StaffCourse,
  type StaffSession,
  type StaffAnnouncement,
  type AnnouncementAudience,
  useStaffSession,
} from "@/lib/staff-session";

export const Route = createFileRoute("/staff/dashboard")({
  head: () => ({
    meta: [
      { title: "Staff Dashboard — CONS Tambuwal" },
      {
        name: "description",
        content:
          "CONS Tambuwal staff dashboard: manage courses, students, results, attendance and academic communications.",
      },
    ],
  }),
  component: StaffDashboard,
});

type Section =
  | "overview"
  | "courses"
  | "students"
  | "results"
  | "attendance"
  | "announcements"
  | "schedule"
  | "publications"
  | "profile"
  | "biodata"
  | "allocation"
  | "supervision"
  | "assessment"
  | "payslip"
  | "leave"
  | "memo"
  | "directory"
  | "transcript-approval"
  | "email";

const menu: { id: Section; label: string; icon: typeof BookOpen }[] = [
  { id: "overview", label: "Overview", icon: GraduationCap },
  { id: "biodata", label: "Bio Data", icon: IdCard },
  { id: "courses", label: "My Courses", icon: BookOpen },
  { id: "allocation", label: "Course Allocation", icon: FileSignature },
  { id: "students", label: "Students", icon: Users },
  { id: "results", label: "Upload Results", icon: ClipboardCheck },
  { id: "transcript-approval", label: "Transcript Approval", icon: ScrollText },
  { id: "attendance", label: "Attendance", icon: CalendarDays },
  { id: "supervision", label: "Project Supervision", icon: UserCheck },
  { id: "assessment", label: "Teaching Assessment", icon: Star },
  { id: "schedule", label: "Timetable", icon: CalendarDays },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "memo", label: "Memo / Circulars", icon: FileText },
  { id: "directory", label: "Staff Directory", icon: Users },
  { id: "email", label: "Staff Email", icon: Mail },
  { id: "publications", label: "Publications", icon: FileText },
  { id: "payslip", label: "Payslip", icon: Wallet },
  { id: "leave", label: "Leave Application", icon: Plane },
  { id: "profile", label: "Profile & Settings", icon: Settings },
];

const ROSTER = [
  { matric: "CONS/2023/012", name: "Aisha Bello", level: "200" },
  { matric: "CONS/2023/045", name: "Yusuf Sani", level: "200" },
  { matric: "CONS/2023/078", name: "Maryam Ibrahim", level: "200" },
  { matric: "CONS/2022/103", name: "David Okon", level: "300" },
  { matric: "CONS/2022/118", name: "Khadija Musa", level: "300" },
  { matric: "CONS/2021/154", name: "Fatima Lawal", level: "400" },
  { matric: "CONS/2021/177", name: "Samuel Eze", level: "400" },
];

function getCoursesForDepartment(department: string): StaffCourse[] {
  const direct = ALL_STAFF_COURSES.filter((c) => c.department === department);
  if (direct.length > 0) return direct;
  // Fallback: every staff member sees the foundational nursing courses so the
  // dashboard never feels empty for departments without dedicated courses.
  return ALL_STAFF_COURSES.filter(
    (c) => c.department === "General Nursing Sciences",
  );
}

function StaffDashboard() {
  const staff = useStaffSession((s) => s.staff);
  const signOut = useStaffSession((s) => s.signOut);
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("overview");
  const [hydrated, setHydrated] = useState(false);

  // Avoid SSR hydration mismatch — the persisted session only exists in the browser.
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !staff) {
      navigate({ to: "/staff" });
    }
  }, [hydrated, staff, navigate]);

  const courses = useMemo(
    () => (staff ? getCoursesForDepartment(staff.department) : []),
    [staff],
  );

  if (!hydrated || !staff) {
    return (
      <main className="min-h-screen bg-background">
        <PortalHeader />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-sm text-muted-foreground">
          Loading staff session…
        </div>
      </main>
    );
  }

  const handleLogout = () => {
    signOut();
    navigate({ to: "/staff" });
  };

  return (
    <main className="min-h-screen bg-background">
      <PortalHeader />

      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6 grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <div className="bg-primary text-primary-foreground px-4 py-3 rounded-t-lg flex items-center gap-3">
            <UserAvatar
              userKey={`staff:${staff.staffId}`}
              initials={getInitials(staff.name)}
              sizeClassName="h-11 w-11"
              textClassName="text-sm"
            />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold truncate">
                {staff.title}
              </p>
              <p className="font-display font-bold text-sm leading-tight mt-0.5 truncate">
                {staff.name}
              </p>
              <p className="text-[11px] text-primary-foreground/70 mt-0.5 truncate">
                {staff.department}
              </p>
            </div>
          </div>
          <nav className="border border-t-0 border-border bg-card rounded-b-lg overflow-hidden">
            <ul>
              {menu.map(({ id, label, icon: Icon }) => {
                const active = section === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => setSection(id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm border-b border-border/60 last:border-0 transition ${
                        active
                          ? "bg-gold/20 text-primary font-semibold"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{label}</span>
                    </button>
                  </li>
                );
              })}
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <section className="col-span-12 md:col-span-9 lg:col-span-10">
          {section === "overview" && (
            <Overview staff={staff} courses={courses} onJump={setSection} />
          )}
          {section === "courses" && <CoursesPanel courses={courses} />}
          {section === "students" && <StudentsPanel courses={courses} />}
          {section === "results" && <ResultsPanel courses={courses} />}
          {section === "attendance" && <AttendancePanel courses={courses} />}
          {section === "announcements" && (
            <AnnouncementsPanel staff={staff} courses={courses} />
          )}
          {section === "schedule" && <TimetablePanel courses={courses} />}
          {section === "publications" && <PublicationsPanel staff={staff} />}
          {section === "profile" && <ProfilePanel staff={staff} />}
          {section === "biodata" && <BiodataPanel staff={staff} />}
          {section === "allocation" && <AllocationPanel courses={courses} />}
          {section === "supervision" && <SupervisionPanel />}
          {section === "assessment" && <TeachingAssessmentPanel courses={courses} />}
          {section === "payslip" && <PayslipPanel staff={staff} />}
          {section === "leave" && <LeavePanel />}
          {section === "memo" && <MemoPanel />}
          {section === "directory" && <DirectoryPanel />}
          {section === "transcript-approval" && <TranscriptApprovalPanel />}
          {section === "email" && <StaffEmailPanel />}
        </section>
      </div>
    </main>
  );
}

function PanelHeader({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-5">
      <h1 className="font-display font-extrabold text-2xl md:text-3xl text-primary">{title}</h1>
      {desc && <p className="text-sm text-muted-foreground mt-1">{desc}</p>}
    </div>
  );
}

function Overview({
  staff,
  courses,
  onJump,
}: {
  staff: StaffSession;
  courses: StaffCourse[];
  onJump: (s: Section) => void;
}) {
  const stats = [
    { label: "Courses", value: courses.length, icon: BookOpen },
    {
      label: "Total Students",
      value: courses.reduce((sum, c) => sum + c.students, 0),
      icon: Users,
    },
    { label: "Pending Results", value: 2, icon: ClipboardCheck },
    { label: "Announcements", value: 5, icon: Megaphone },
  ];
  return (
    <div>
      <PanelHeader
        title={`Welcome, ${staff.name}`}
        desc={`${staff.department} · ${staff.staffId}`}
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              {label}
            </p>
            <p className="mt-1 font-display font-extrabold text-2xl text-primary">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <button
          onClick={() => onJump("results")}
          className="text-left p-5 rounded-xl border border-border bg-card hover:border-gold hover:shadow-[var(--shadow-elegant)] transition"
        >
          <Upload className="h-6 w-6 text-gold" />
          <h3 className="mt-3 font-display font-bold text-primary">Upload Results</h3>
          <p className="text-sm text-muted-foreground mt-1">Enter CA & exam scores.</p>
        </button>
        <button
          onClick={() => onJump("courses")}
          className="text-left p-5 rounded-xl border border-border bg-card hover:border-gold hover:shadow-[var(--shadow-elegant)] transition"
        >
          <PlusCircle className="h-6 w-6 text-gold" />
          <h3 className="mt-3 font-display font-bold text-primary">Add Course Material</h3>
          <p className="text-sm text-muted-foreground mt-1">Upload notes, slides or videos.</p>
        </button>
        <button
          onClick={() => onJump("announcements")}
          className="text-left p-5 rounded-xl border border-border bg-card hover:border-gold hover:shadow-[var(--shadow-elegant)] transition"
        >
          <Megaphone className="h-6 w-6 text-gold" />
          <h3 className="mt-3 font-display font-bold text-primary">Post Announcement</h3>
          <p className="text-sm text-muted-foreground mt-1">Notify your class instantly.</p>
        </button>
      </div>
    </div>
  );
}

function CoursesPanel({ courses }: { courses: StaffCourse[] }) {
  return (
    <div>
      <PanelHeader title="My Courses" desc="Courses you teach this semester." />
      {courses.length === 0 ? (
        <EmptyState message="No courses are assigned to your department yet." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((c) => (
            <div key={c.code} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-mono text-gold font-bold tracking-wider">{c.code}</p>
                  <h3 className="font-display font-bold text-primary text-lg mt-0.5">{c.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Level {c.level}</p>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1">
                  <Users className="h-3 w-3" />
                  {c.students}
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 rounded-md bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-2 hover:brightness-110 transition">
                  Manage
                </button>
                <button className="flex-1 rounded-md border border-border text-primary text-xs font-bold uppercase tracking-wider py-2 hover:bg-muted transition">
                  Materials
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StudentsPanel({ courses }: { courses: StaffCourse[] }) {
  // Build a synthetic enrollment list from the staff's courses + roster.
  const rows = useMemo(() => {
    if (courses.length === 0) return [];
    return ROSTER.map((s, i) => {
      const course = courses[i % courses.length];
      const ca = 18 + ((i * 3) % 12);
      const exam = 38 + ((i * 7) % 25);
      return { ...s, course, ca, exam };
    });
  }, [courses]);

  return (
    <div>
      <PanelHeader title="Students" desc="Students enrolled in your courses." />
      {rows.length === 0 ? (
        <EmptyState message="No students enrolled yet." />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Matric No</th>
                  <th className="text-left px-4 py-3 font-semibold">Name</th>
                  <th className="text-left px-4 py-3 font-semibold">Course</th>
                  <th className="text-right px-4 py-3 font-semibold">CA / 30</th>
                  <th className="text-right px-4 py-3 font-semibold">Exam / 70</th>
                  <th className="text-right px-4 py-3 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => {
                  const total = r.ca + r.exam;
                  return (
                    <tr key={r.matric} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono text-xs">{r.matric}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.course.code}</td>
                      <td className="px-4 py-3 text-right">{r.ca}</td>
                      <td className="px-4 py-3 text-right">{r.exam}</td>
                      <td className="px-4 py-3 text-right font-bold text-primary">{total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultsPanel({ courses }: { courses: StaffCourse[] }) {
  return (
    <div>
      <PanelHeader title="Upload Results" desc="Record CA and examination scores." />
      <form
        onSubmit={(e) => e.preventDefault()}
        className="rounded-xl border border-border bg-card p-5 md:p-6 space-y-4 max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Course
            </label>
            <select className="mt-1 w-full rounded-md border border-border bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
              {courses.map((c) => (
                <option key={c.code}>
                  {c.code} — {c.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Matric No
            </label>
            <input
              type="text"
              placeholder="CONS/2023/012"
              className="mt-1 w-full rounded-md border border-border bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              CA Score (max 30)
            </label>
            <input
              type="number"
              min={0}
              max={30}
              className="mt-1 w-full rounded-md border border-border bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Exam Score (max 70)
            </label>
            <input
              type="number"
              min={0}
              max={70}
              className="mt-1 w-full rounded-md border border-border bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-full bg-primary px-6 py-2.5 text-primary-foreground font-display font-bold text-xs uppercase tracking-wider hover:brightness-110 transition"
          >
            Save Result
          </button>
          <button
            type="button"
            className="rounded-full border border-border px-6 py-2.5 text-primary font-display font-bold text-xs uppercase tracking-wider hover:bg-muted transition inline-flex items-center gap-2"
          >
            <Upload className="h-3.5 w-3.5" />
            Bulk Upload (CSV)
          </button>
        </div>
      </form>
    </div>
  );
}

function ProfilePanel({ staff }: { staff: StaffSession }) {
  const rows: [string, string][] = [
    ["Staff ID", staff.staffId],
    ["Name", staff.name],
    ["Title", staff.title],
    ["Department", staff.department],
    ["Email", staff.email],
  ];
  return (
    <div>
      <PanelHeader title="Profile & Settings" desc="Your account information." />
      <div className="rounded-xl border border-border bg-card overflow-hidden max-w-2xl">
        <div className="flex items-center gap-4 px-4 py-5 border-b border-border bg-muted/30">
          <UserAvatar
            userKey={`staff:${staff.staffId}`}
            initials={getInitials(staff.name)}
            sizeClassName="h-20 w-20"
            textClassName="text-2xl"
            fallbackClassName="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground"
            editable
          />
          <div className="min-w-0">
            <p className="font-display font-extrabold text-lg text-primary truncate">{staff.name}</p>
            <p className="text-xs text-muted-foreground truncate">{staff.title} · {staff.department}</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Tap the camera to upload a photo. It appears everywhere on your dashboard.
            </p>
          </div>
        </div>
        <dl className="divide-y divide-border">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[140px_1fr] gap-3 px-4 py-3 text-sm">
              <dt className="font-semibold text-primary">{k}</dt>
              <dd className="text-foreground break-all">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Placeholder({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <PanelHeader title={title} desc={desc} />
      <EmptyState message="This section is ready for content. Connect Lovable Cloud to enable real data." />
    </div>
  );
}

/* ---------- Announcements ---------- */

function AnnouncementsPanel({
  staff,
  courses,
}: {
  staff: StaffSession;
  courses: StaffCourse[];
}) {
  const addAnnouncement = useStaffSession((s) => s.addAnnouncement);
  const deleteAnnouncement = useStaffSession((s) => s.deleteAnnouncement);
  const announcements = useStaffSession((s) =>
    s.getAnnouncementsForStaff(staff.staffId),
  );

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<AnnouncementAudience>("department");
  const [courseCode, setCourseCode] = useState<string>(courses[0]?.code ?? "");
  const [pinned, setPinned] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    const b = body.trim();
    if (t.length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }
    if (b.length < 5) {
      setError("Message must be at least 5 characters.");
      return;
    }
    if (audience === "course" && !courseCode) {
      setError("Pick a course for course-scoped announcements.");
      return;
    }
    setError(null);
    addAnnouncement({
      staffId: staff.staffId,
      authorName: staff.name,
      department: staff.department,
      title: t,
      body: b,
      audience,
      courseCode: audience === "course" ? courseCode : undefined,
      pinned,
    });
    setTitle("");
    setBody("");
    setPinned(false);
  };

  return (
    <div>
      <PanelHeader
        title="Announcements"
        desc={`Notices you have posted as ${staff.name}. Visible to students and your department.`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-5">
        {/* Composer */}
        <form
          onSubmit={submit}
          className="rounded-xl border border-border bg-card p-5 shadow-sm h-fit"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-md bg-gold/20 text-gold grid place-items-center">
              <Megaphone className="h-4 w-4" />
            </div>
            <h2 className="font-display font-bold text-primary">
              New Announcement
            </h2>
          </div>

          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            placeholder="e.g. NUR 305 — Mid-semester test rescheduled"
            className="w-full rounded-md border border-border bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 mb-3"
          />

          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Message
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={1000}
            rows={5}
            placeholder="Write your announcement…"
            className="w-full rounded-md border border-border bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 mb-3 resize-y"
          />

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Audience
              </label>
              <select
                value={audience}
                onChange={(e) =>
                  setAudience(e.target.value as AnnouncementAudience)
                }
                className="w-full rounded-md border border-border bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="department">My Department</option>
                <option value="course">Specific Course</option>
                <option value="all">All Students</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Course
              </label>
              <select
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                disabled={audience !== "course"}
                className="w-full rounded-md border border-border bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-50"
              >
                {courses.length === 0 && <option value="">— none —</option>}
                {courses.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-foreground mb-4">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-[hsl(var(--primary))]"
            />
            Pin to top
          </label>

          {error && (
            <p className="mb-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-primary-foreground transition hover:brightness-110"
          >
            <Send className="h-4 w-4" />
            Post Announcement
          </button>
        </form>

        {/* Feed */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-primary">
              Your Announcements
            </h2>
            <span className="text-xs text-muted-foreground">
              {announcements.length} total
            </span>
          </div>

          {announcements.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
              <Megaphone className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                You haven't posted any announcements yet.
              </p>
            </div>
          )}

          {announcements.map((a) => (
            <AnnouncementCard
              key={a.id}
              announcement={a}
              onDelete={() => deleteAnnouncement(a.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AnnouncementCard({
  announcement,
  onDelete,
}: {
  announcement: StaffAnnouncement;
  onDelete: () => void;
}) {
  const audienceLabel =
    announcement.audience === "all"
      ? "All Students"
      : announcement.audience === "course"
      ? `Course • ${announcement.courseCode}`
      : `Dept • ${announcement.department}`;

  const date = new Date(announcement.createdAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <article
      className={`rounded-xl border bg-card p-4 shadow-sm transition ${
        announcement.pinned
          ? "border-gold/60 bg-gold/5"
          : "border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {announcement.pinned ? (
              <Pin className="h-3.5 w-3.5 text-gold" />
            ) : (
              <PinOff className="h-3.5 w-3.5 text-muted-foreground/60" />
            )}
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
              {audienceLabel}
            </span>
          </div>
          <h3 className="font-display font-bold text-primary leading-snug">
            {announcement.title}
          </h3>
        </div>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete announcement"
          className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-2 text-sm text-foreground/80 whitespace-pre-wrap">
        {announcement.body}
      </p>
      <p className="mt-3 text-[11px] text-muted-foreground">
        {announcement.authorName} • {date}
      </p>
    </article>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

// ===================== STAFF OAU MODULES =====================

type StaffAction = { label: string; panel: React.ReactNode };

function StaffModule({ title, desc, actions }: { title: string; desc: string; actions: StaffAction[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <PanelHeader title={title} desc={desc} />
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex flex-wrap gap-2 px-5 py-3 border-b border-border bg-muted/30">
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
        <div className="p-5">{actions[active].panel}</div>
      </div>
    </div>
  );
}

function StaffField({
  label,
  type = "text",
  defaultValue,
  options,
  textarea,
  readOnly,
  placeholder,
}: {
  label: string;
  type?: string;
  defaultValue?: string;
  options?: string[];
  textarea?: boolean;
  readOnly?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{label}</span>
      {options ? (
        <select defaultValue={defaultValue} className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-gold">
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : textarea ? (
        <textarea defaultValue={defaultValue} placeholder={placeholder} rows={4} readOnly={readOnly} className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-gold" />
      ) : (
        <input type={type} defaultValue={defaultValue} placeholder={placeholder} readOnly={readOnly} className={`mt-1 w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-gold ${readOnly ? "opacity-70 cursor-not-allowed" : ""}`} />
      )}
    </label>
  );
}

function StaffForm({ title, children, submitLabel = "Save Changes" }: { title: string; children: React.ReactNode; submitLabel?: string }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert(`${title}: submitted (demo).`);
      }}
      className="space-y-4"
    >
      <h3 className="font-display font-extrabold text-lg text-primary">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
      <div className="pt-2 flex flex-wrap gap-2 border-t border-border">
        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition">
          {submitLabel}
        </button>
        <button type="reset" className="px-4 py-2 rounded-lg border border-border text-primary text-sm font-bold hover:border-gold transition">
          Reset
        </button>
      </div>
    </form>
  );
}

function StaffList({ items }: { items: { primary: string; secondary?: string; status?: string }[] }) {
  return (
    <div className="rounded-xl border border-border divide-y divide-border">
      {items.map((it) => (
        <div key={it.primary} className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="text-sm font-bold text-primary truncate">{it.primary}</p>
            {it.secondary && <p className="text-xs text-muted-foreground truncate">{it.secondary}</p>}
          </div>
          {it.status && (
            <span className="text-[10px] uppercase tracking-wider font-bold bg-gold/20 text-primary px-2 py-1 rounded-full shrink-0">{it.status}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function BiodataPanel({ staff }: { staff: StaffSession }) {
  return (
    <StaffModule
      title="Bio Data"
      desc="View and update your personal and employment biodata."
      actions={[
        {
          label: "Personal information",
          panel: (
            <StaffForm title="Personal Information">
              <StaffField label="Full Name" defaultValue={staff.name} />
              <StaffField label="Staff ID" defaultValue={staff.staffId} readOnly />
              <StaffField label="Date of Birth" type="date" />
              <StaffField label="Gender" options={["Male", "Female"]} />
              <StaffField label="Marital Status" options={["Single", "Married", "Other"]} />
              <StaffField label="Nationality" defaultValue="Nigerian" />
              <StaffField label="State of Origin" defaultValue="Sokoto" />
              <StaffField label="LGA" defaultValue="Tambuwal" />
            </StaffForm>
          ),
        },
        {
          label: "Employment details",
          panel: (
            <StaffForm title="Employment Details">
              <StaffField label="Department" defaultValue={staff.department} readOnly />
              <StaffField label="Title / Rank" defaultValue={staff.title} readOnly />
              <StaffField label="Date of First Appointment" type="date" />
              <StaffField label="Grade Level" defaultValue="CONUASS 4" />
              <StaffField label="Employment Type" options={["Permanent", "Contract", "Visiting"]} />
              <StaffField label="Office Phone" type="tel" />
            </StaffForm>
          ),
        },
        {
          label: "Next of kin",
          panel: (
            <StaffForm title="Next of Kin">
              <StaffField label="Full Name" />
              <StaffField label="Relationship" />
              <StaffField label="Phone" type="tel" />
              <StaffField label="Email" type="email" />
              <StaffField label="Address" textarea />
            </StaffForm>
          ),
        },
      ]}
    />
  );
}

function AllocationPanel({ courses }: { courses: StaffCourse[] }) {
  return (
    <StaffModule
      title="Course Allocation"
      desc="Courses allocated to you for the current academic session."
      actions={[
        {
          label: "Current allocation",
          panel: <AllocationCurrentList courses={courses} />,
        },
        {
          label: "Request additional course",
          panel: (
            <StaffForm title="Request Additional Course" submitLabel="Submit Request">
              <StaffField label="Course Code" placeholder="e.g. NUR 311" />
              <StaffField label="Course Title" />
              <StaffField label="Semester" options={["1st Semester", "2nd Semester"]} />
              <StaffField label="Reason" textarea />
            </StaffForm>
          ),
        },
      ]}
    />
  );
}

function AllocationCurrentList({ courses }: { courses: StaffCourse[] }) {
  const [openCode, setOpenCode] = useState<string | null>(null);

  if (courses.length === 0) {
    return <EmptyState message="No courses allocated yet." />;
  }

  // Build deterministic applicant list per course from the shared ROSTER.
  const applicantsFor = (course: StaffCourse) => {
    const seedChar = course.code.charCodeAt(course.code.length - 1);
    const count = Math.max(3, Math.min(course.students, ROSTER.length * 3));
    return Array.from({ length: count }, (_, i) => {
      const base = ROSTER[(i + seedChar) % ROSTER.length];
      const year = 2021 + ((i + seedChar) % 4);
      const serial = String(((i + seedChar) * 13) % 999).padStart(3, "0");
      return {
        matric: `CONS/${year}/${serial}`,
        name: base.name,
        level: course.level,
        status: i % 7 === 0 ? "Pending" : "Approved",
      };
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
      {courses.map((c) => {
        const isOpen = openCode === c.code;
        const applicants = applicantsFor(c);
        const approved = applicants.filter((a) => a.status === "Approved").length;
        const pending = applicants.length - approved;
        return (
          <div key={c.code}>
            <button
              type="button"
              onClick={() => setOpenCode(isOpen ? null : c.code)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left hover:bg-muted/40 transition"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">
                  {c.code} — {c.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Level {c.level} · {applicants.length} students applied
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {applicants.length}
                </span>
                <ChevronRight
                  className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`}
                />
              </div>
            </button>
            {isOpen && (
              <div className="bg-muted/20 border-t border-border px-4 py-3">
                <div className="flex flex-wrap items-center gap-3 mb-3 text-xs">
                  <span className="font-semibold text-foreground">
                    {applicants.length} students applied
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-primary font-semibold">
                    {approved} approved
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-foreground font-semibold">
                    {pending} pending
                  </span>
                </div>
                <div className="overflow-x-auto rounded-lg border border-border bg-background">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-[10px] uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="text-left px-3 py-2 font-semibold">#</th>
                        <th className="text-left px-3 py-2 font-semibold">Matric No</th>
                        <th className="text-left px-3 py-2 font-semibold">Name</th>
                        <th className="text-left px-3 py-2 font-semibold">Level</th>
                        <th className="text-right px-3 py-2 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {applicants.map((a, idx) => (
                        <tr key={`${c.code}-${a.matric}-${idx}`} className="hover:bg-muted/30">
                          <td className="px-3 py-2 text-muted-foreground">{idx + 1}</td>
                          <td className="px-3 py-2 font-mono text-xs">{a.matric}</td>
                          <td className="px-3 py-2 font-medium text-foreground">{a.name}</td>
                          <td className="px-3 py-2 text-muted-foreground">{a.level}</td>
                          <td className="px-3 py-2 text-right">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                a.status === "Approved"
                                  ? "bg-primary/15 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SupervisionPanel() {
  return (
    <StaffModule
      title="Project Supervision"
      desc="Manage final-year and postgraduate students under your supervision."
      actions={[
        {
          label: "Supervisees",
          panel: (
            <StaffList
              items={[
                { primary: "Aisha Bello — CONS/2021/154", secondary: "Topic: Effect of telehealth on rural maternal care", status: "Chapter 3" },
                { primary: "Yusuf Sani — CONS/2021/177", secondary: "Topic: Nurse burnout in tertiary hospitals", status: "Chapter 2" },
                { primary: "Maryam Ibrahim — CONS/2021/180", secondary: "Topic: Pain management in paediatrics", status: "Proposal" },
              ]}
            />
          ),
        },
        {
          label: "Schedule meeting",
          panel: (
            <StaffForm title="Schedule Supervision Meeting" submitLabel="Schedule">
              <StaffField label="Student" options={["Aisha Bello", "Yusuf Sani", "Maryam Ibrahim"]} />
              <StaffField label="Date" type="date" />
              <StaffField label="Time" type="time" />
              <StaffField label="Mode" options={["In-person", "Virtual"]} />
              <div className="md:col-span-2">
                <StaffField label="Agenda" textarea placeholder="What will be discussed?" />
              </div>
            </StaffForm>
          ),
        },
        {
          label: "Submit grade",
          panel: (
            <StaffForm title="Submit Project Grade" submitLabel="Submit Grade">
              <StaffField label="Student" options={["Aisha Bello", "Yusuf Sani", "Maryam Ibrahim"]} />
              <StaffField label="Defence Score (0-100)" type="number" />
              <StaffField label="Project Score (0-100)" type="number" />
              <StaffField label="Recommendation" options={["Pass", "Pass with corrections", "Fail"]} />
            </StaffForm>
          ),
        },
      ]}
    />
  );
}

function TeachingAssessmentPanel({ courses }: { courses: StaffCourse[] }) {
  return (
    <StaffModule
      title="Teaching Assessment"
      desc="Review student feedback and your teaching evaluation reports."
      actions={[
        {
          label: "Summary by course",
          panel: (
            <StaffList
              items={courses.map((c, i) => ({
                primary: `${c.code} — ${c.title}`,
                secondary: `${c.students} students · ${28 + i} responses`,
                status: `${(4.1 + i * 0.1).toFixed(1)} / 5.0`,
              }))}
            />
          ),
        },
        {
          label: "Detailed feedback",
          panel: (
            <div className="space-y-3">
              {[
                "Very engaging lectures and clear examples.",
                "Lecturer is punctual and well-prepared.",
                "Could share slides earlier before class.",
                "Assessment was fair and well-structured.",
              ].map((c) => (
                <div key={c} className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-foreground">
                  “{c}”
                </div>
              ))}
            </div>
          ),
        },
        {
          label: "Download report",
          panel: (
            <div className="text-center py-6">
              <FileText className="h-10 w-10 mx-auto text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">Your full teaching evaluation report is ready.</p>
              <button type="button" onClick={() => alert("Report downloaded (demo).")} className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition">
                Download PDF
              </button>
            </div>
          ),
        },
      ]}
    />
  );
}

function PayslipPanel({ staff }: { staff: StaffSession }) {
  const months = ["April 2026", "March 2026", "February 2026", "January 2026"];
  return (
    <StaffModule
      title="Payslip"
      desc="View and download your monthly payslip and tax statements."
      actions={[
        {
          label: "Latest payslip",
          panel: (
            <div className="rounded-xl border-2 border-dashed border-border p-6">
              <div className="text-center mb-5">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold">CONS Tambuwal · Bursary</p>
                <h3 className="font-display font-extrabold text-xl text-primary mt-1">Payslip — April 2026</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <Row label="Name" value={staff.name} />
                <Row label="Staff ID" value={staff.staffId} />
                <Row label="Department" value={staff.department} />
                <Row label="Grade" value="CONUASS 4" />
                <Row label="Basic Salary" value="₦320,000.00" />
                <Row label="Allowances" value="₦95,500.00" />
                <Row label="Gross Pay" value="₦415,500.00" />
                <Row label="Tax (PAYE)" value="₦42,300.00" />
                <Row label="Pension (8%)" value="₦25,600.00" />
                <Row label="Net Pay" value="₦347,600.00" />
              </div>
              <div className="mt-5 flex justify-center gap-2">
                <button type="button" onClick={() => window.print()} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition">
                  Print
                </button>
                <button type="button" onClick={() => alert("PDF downloaded (demo).")} className="px-4 py-2 rounded-lg border border-border text-primary text-sm font-bold hover:border-gold transition">
                  Download PDF
                </button>
              </div>
            </div>
          ),
        },
        {
          label: "Past payslips",
          panel: (
            <StaffList items={months.map((m) => ({ primary: m, secondary: "Net ₦347,600", status: "Available" }))} />
          ),
        },
        {
          label: "Tax statement",
          panel: (
            <StaffForm title="Request Annual Tax Statement" submitLabel="Request Statement">
              <StaffField label="Tax Year" options={["2025", "2024", "2023"]} />
              <StaffField label="Delivery" options={["Email", "Pickup at Bursary"]} />
            </StaffForm>
          ),
        },
      ]}
    />
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border/60 pb-1.5">
      <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

function LeavePanel() {
  return (
    <StaffModule
      title="Leave Application"
      desc="Apply for annual, casual, study or sabbatical leave."
      actions={[
        {
          label: "Apply for leave",
          panel: (
            <StaffForm title="Leave Application" submitLabel="Submit Application">
              <StaffField label="Leave Type" options={["Annual", "Casual", "Study", "Sick", "Sabbatical"]} />
              <StaffField label="Number of Days" type="number" />
              <StaffField label="Start Date" type="date" />
              <StaffField label="End Date" type="date" />
              <StaffField label="Address During Leave" textarea />
              <StaffField label="Person to Hand Over To" />
              <div className="md:col-span-2">
                <StaffField label="Reason" textarea />
              </div>
            </StaffForm>
          ),
        },
        {
          label: "Leave history",
          panel: (
            <StaffList
              items={[
                { primary: "Annual leave — 14 days", secondary: "12 Dec 2025 → 26 Dec 2025", status: "Approved" },
                { primary: "Casual leave — 2 days", secondary: "08 Aug 2025 → 09 Aug 2025", status: "Approved" },
                { primary: "Study leave — 30 days", secondary: "Pending HOD review", status: "Pending" },
              ]}
            />
          ),
        },
        {
          label: "Leave balance",
          panel: (
            <StaffList
              items={[
                { primary: "Annual leave", secondary: "Balance: 16 of 30 days" },
                { primary: "Casual leave", secondary: "Balance: 5 of 7 days" },
                { primary: "Sick leave", secondary: "Balance: 14 of 14 days" },
                { primary: "Sabbatical", secondary: "Eligible after Aug 2027" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

function MemoPanel() {
  return (
    <StaffModule
      title="Memo / Circulars"
      desc="Internal memos, circulars and official communications."
      actions={[
        {
          label: "Inbox",
          panel: (
            <StaffList
              items={[
                { primary: "Provost — Senate meeting reminder", secondary: "Mon, 22 Apr 2026", status: "New" },
                { primary: "Bursar — Salary review committee", secondary: "Fri, 18 Apr 2026", status: "New" },
                { primary: "Registrar — Examination malpractice circular", secondary: "Tue, 15 Apr 2026" },
                { primary: "HOD — Departmental retreat agenda", secondary: "Mon, 14 Apr 2026" },
              ]}
            />
          ),
        },
        {
          label: "Compose memo",
          panel: (
            <StaffForm title="Compose Memo" submitLabel="Send Memo">
              <StaffField label="To" placeholder="HOD / Department / All Staff" />
              <StaffField label="Cc" placeholder="Optional" />
              <StaffField label="Subject" />
              <StaffField label="Reference" placeholder="e.g. CONS/HR/2026/014" />
              <div className="md:col-span-2">
                <StaffField label="Body" textarea placeholder="Write the memo content..." />
              </div>
            </StaffForm>
          ),
        },
      ]}
    />
  );
}

function DirectoryPanel() {
  const staffList = [
    { name: "Dr. (Mrs.) SAFIYA IBRAHIM", role: "Provost", phone: "+234 803 100 0001", email: "provost@cons.edu.ng" },
    { name: "Dr. A. Bello", role: "HOD, General Nursing", phone: "+234 803 100 0002", email: "abello@cons.edu.ng" },
    { name: "Mrs. H. Sani", role: "Lecturer II", phone: "+234 803 100 0003", email: "hsani@cons.edu.ng" },
    { name: "Mr. R. Ojo", role: "Bursar", phone: "+234 803 100 0004", email: "bursar@cons.edu.ng" },
  ];
  return (
    <StaffModule
      title="Staff Directory"
      desc="Browse contact details for academic and non-academic staff."
      actions={[
        {
          label: "Browse all",
          panel: (
            <StaffList items={staffList.map((s) => ({ primary: `${s.name} — ${s.role}`, secondary: `${s.phone} · ${s.email}` }))} />
          ),
        },
        {
          label: "Search",
          panel: (
            <StaffForm title="Search Directory" submitLabel="Search">
              <StaffField label="Name" placeholder="e.g. Aliyu" />
              <StaffField label="Department" options={["All", "General Nursing", "Bursary", "Registry", "ICT"]} />
              <StaffField label="Role" options={["All", "Academic", "Administrative", "Technical"]} />
            </StaffForm>
          ),
        },
      ]}
    />
  );
}

function TranscriptApprovalPanel() {
  return (
    <StaffModule
      title="Transcript Approval"
      desc="Approve student transcript and result release requests."
      actions={[
        {
          label: "Pending requests",
          panel: (
            <div className="space-y-3">
              {[
                { matric: "CONS/2021/154", name: "Aisha Bello", to: "University of Ibadan" },
                { matric: "CONS/2021/177", name: "Yusuf Sani", to: "Lagos Business School" },
              ].map((r) => (
                <div key={r.matric} className="flex items-center justify-between gap-3 p-4 rounded-xl border border-border">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-primary">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.matric} → {r.to}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button type="button" onClick={() => alert("Approved (demo).")} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition">
                      Approve
                    </button>
                    <button type="button" onClick={() => alert("Rejected (demo).")} className="px-3 py-1.5 rounded-lg border border-destructive text-destructive text-xs font-bold hover:bg-destructive/10 transition">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ),
        },
        {
          label: "Approval history",
          panel: (
            <StaffList
              items={[
                { primary: "REQ-2025-2210 · David Okon", secondary: "Approved on 02 Mar 2026", status: "Approved" },
                { primary: "REQ-2025-1980 · Fatima Lawal", secondary: "Approved on 18 Feb 2026", status: "Approved" },
                { primary: "REQ-2025-1822 · Samuel Eze", secondary: "Rejected — incomplete clearance", status: "Rejected" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

function StaffEmailPanel() {
  const inbox = [
    { from: "Provost Office", subject: "Senate meeting reminder", time: "10:24 AM", unread: true },
    { from: "Bursary", subject: "April salary credited", time: "Yesterday", unread: true },
    { from: "Registry", subject: "Examination roster", time: "Mon", unread: false },
    { from: "ICT Helpdesk", subject: "Email quota notice", time: "Last week", unread: false },
  ];
  return (
    <StaffModule
      title="Staff Email"
      desc="Open your official institutional email inbox."
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
          label: "Compose new",
          panel: (
            <StaffForm title="New Email" submitLabel="Send Email">
              <StaffField label="To" type="email" placeholder="recipient@cons.edu.ng" />
              <StaffField label="Cc" type="email" placeholder="optional" />
              <StaffField label="Subject" />
              <StaffField label="Priority" options={["Normal", "High", "Low"]} />
              <div className="md:col-span-2">
                <StaffField label="Message" textarea placeholder="Type your message..." />
              </div>
            </StaffForm>
          ),
        },
      ]}
    />
  );
}

function AttendancePanel({ courses }: { courses: StaffCourse[] }) {
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", day: "2-digit", month: "short", year: "numeric" });
  return (
    <StaffModule
      title="Attendance"
      desc="Mark and review class attendance per course."
      actions={[
        {
          label: "Mark today's attendance",
          panel: (
            <StaffForm title={`Mark Attendance — ${today}`} submitLabel="Save Attendance">
              <StaffField label="Course" options={courses.map((c) => `${c.code} — ${c.title}`)} />
              <StaffField label="Date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
              <StaffField label="Topic Taught" placeholder="e.g. Antibiotics: Mechanism of Action" />
              <StaffField label="Class Type" options={["Lecture", "Clinical", "Lab", "Tutorial"]} />
              <StaffField label="Total Students Present" type="number" placeholder="0" />
              <StaffField label="Total Students Absent" type="number" placeholder="0" />
              <StaffField label="Notes" textarea placeholder="Optional notes about today's class" />
            </StaffForm>
          ),
        },
        {
          label: "Recent sessions",
          panel: (
            <StaffList
              items={[
                { primary: "NUR 201 — Medical-Surgical Nursing I", secondary: "Mon, 14 Apr · 42 / 45 present", status: "Recorded" },
                { primary: "NUR 203 — Pharmacology", secondary: "Tue, 15 Apr · 38 / 45 present", status: "Recorded" },
                { primary: "NUR 207 — Community Health Nursing", secondary: "Wed, 16 Apr · Pending", status: "Pending" },
              ]}
            />
          ),
        },
        {
          label: "Attendance summary",
          panel: (
            <StaffList
              items={courses.map((c) => ({
                primary: `${c.code} — ${c.title}`,
                secondary: `${c.students} students enrolled · 12 sessions held`,
                status: "92% avg",
              }))}
            />
          ),
        },
      ]}
    />
  );
}

function TimetablePanel({ courses }: { courses: StaffCourse[] }) {
  const slots = [
    { day: "Monday", time: "08:00 – 10:00", room: "LT 1", course: courses[0]?.code ?? "—", title: courses[0]?.title ?? "" },
    { day: "Tuesday", time: "10:00 – 12:00", room: "Lab B", course: courses[1]?.code ?? "—", title: courses[1]?.title ?? "" },
    { day: "Wednesday", time: "13:00 – 15:00", room: "LT 2", course: courses[0]?.code ?? "—", title: courses[0]?.title ?? "" },
    { day: "Thursday", time: "08:00 – 10:00", room: "LT 1", course: courses[2]?.code ?? courses[0]?.code ?? "—", title: courses[2]?.title ?? courses[0]?.title ?? "" },
    { day: "Friday", time: "11:00 – 13:00", room: "Hall 3", course: courses[1]?.code ?? "—", title: courses[1]?.title ?? "" },
  ];
  return (
    <StaffModule
      title="Timetable"
      desc="Your weekly lecture and clinical schedule."
      actions={[
        {
          label: "Weekly schedule",
          panel: (
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-12 px-4 py-2.5 text-[10px] uppercase tracking-wider font-bold text-muted-foreground bg-muted/40 border-b border-border">
                <div className="col-span-2">Day</div>
                <div className="col-span-3">Time</div>
                <div className="col-span-2">Room</div>
                <div className="col-span-2">Course</div>
                <div className="col-span-3">Topic</div>
              </div>
              {slots.map((s) => (
                <div key={s.day + s.time} className="grid grid-cols-12 items-center px-4 py-3 text-sm border-b border-border last:border-0">
                  <div className="col-span-2 font-bold text-primary">{s.day}</div>
                  <div className="col-span-3">{s.time}</div>
                  <div className="col-span-2 text-muted-foreground">{s.room}</div>
                  <div className="col-span-2 font-semibold">{s.course}</div>
                  <div className="col-span-3 text-muted-foreground truncate">{s.title}</div>
                </div>
              ))}
            </div>
          ),
        },
        {
          label: "Examination timetable",
          panel: (
            <StaffList
              items={[
                { primary: "NUR 201 — Medical-Surgical Nursing I", secondary: "12 May 2026 · 09:00 · Hall A", status: "Confirmed" },
                { primary: "NUR 203 — Pharmacology", secondary: "15 May 2026 · 13:00 · Hall B", status: "Confirmed" },
                { primary: "NUR 207 — Community Health Nursing", secondary: "18 May 2026 · 09:00 · Hall A", status: "Pending" },
              ]}
            />
          ),
        },
        {
          label: "Request schedule change",
          panel: (
            <StaffForm title="Request Timetable Change" submitLabel="Submit Request">
              <StaffField label="Course" options={courses.map((c) => `${c.code} — ${c.title}`)} />
              <StaffField label="Current Slot" placeholder="e.g. Mon 08:00 – 10:00, LT 1" />
              <StaffField label="Preferred Slot" placeholder="e.g. Wed 10:00 – 12:00, LT 2" />
              <StaffField label="Reason" textarea placeholder="Briefly explain the need for the change" />
            </StaffForm>
          ),
        },
      ]}
    />
  );
}

function PublicationsPanel({ staff }: { staff: StaffSession }) {
  const samples = [
    { primary: "Hand hygiene compliance among nursing students in northern Nigeria", secondary: "African Journal of Nursing · 2024 · DOI: 10.1234/ajn.2024.045", status: "Published" },
    { primary: "Community-based maternal care interventions: a Tambuwal case study", secondary: "Sokoto Health Review · 2023", status: "Published" },
    { primary: "Pharmacology pedagogy in nursing education", secondary: "Conference paper · WANS 2025 · Under review", status: "Under review" },
  ];
  return (
    <StaffModule
      title="Publications"
      desc="Manage your research output and academic profile."
      actions={[
        {
          label: "My publications",
          panel: <StaffList items={samples} />,
        },
        {
          label: "Add new publication",
          panel: (
            <StaffForm title="Add Publication" submitLabel="Add Publication">
              <StaffField label="Title" placeholder="Full title of the work" />
              <StaffField label="Authors" defaultValue={staff.name} placeholder="Comma-separated authors" />
              <StaffField label="Type" options={["Journal Article", "Conference Paper", "Book Chapter", "Book", "Thesis"]} />
              <StaffField label="Year" type="number" placeholder="2025" />
              <StaffField label="Venue / Journal" placeholder="Journal or conference name" />
              <StaffField label="DOI / URL" placeholder="https://doi.org/..." />
              <StaffField label="Abstract" textarea placeholder="Short abstract or summary" />
            </StaffForm>
          ),
        },
        {
          label: "Academic profile",
          panel: (
            <StaffForm title="Academic Profile" submitLabel="Save Profile">
              <StaffField label="ORCID" placeholder="0000-0000-0000-0000" />
              <StaffField label="Google Scholar" placeholder="https://scholar.google.com/citations?user=" />
              <StaffField label="ResearchGate" placeholder="https://www.researchgate.net/profile/" />
              <StaffField label="Areas of Research" textarea placeholder="e.g. community health, maternal care, nursing education" />
            </StaffForm>
          ),
        },
      ]}
    />
  );
}

