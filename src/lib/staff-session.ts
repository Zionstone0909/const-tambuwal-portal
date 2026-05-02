import { create } from "zustand";
import { persist } from "zustand/middleware";

export type StaffSession = {
  staffId: string;
  name: string;
  title: string;
  department: string;
  email: string;
};

export type StaffAccount = StaffSession & {
  /** Plain-text password — DEMO ONLY. Do not use in production. */
  password: string;
  createdAt: number;
};

export type ResetResult =
  | { ok: true; staffId: string }
  | { ok: false; error: string };

type StaffStore = {
  staff: StaffSession | null;
  /** Registry of staff accounts (seeded; registration UI removed). */
  accounts: StaffAccount[];
  signIn: (s: StaffSession) => void;
  signOut: () => void;
  findAccount: (staffId: string, password: string) => StaffAccount | null;
  /** Look up an account by Staff ID OR email (case-insensitive). */
  findAccountByIdentifier: (identifier: string) => StaffAccount | null;
  /** Reset password for an existing account. */
  resetPassword: (identifier: string, newPassword: string) => ResetResult;
  /** Per-staff announcements, keyed by Staff ID. */
  announcements: StaffAnnouncement[];
  addAnnouncement: (
    input: Omit<StaffAnnouncement, "id" | "createdAt">,
  ) => StaffAnnouncement;
  deleteAnnouncement: (id: string) => void;
  getAnnouncementsForStaff: (staffId: string) => StaffAnnouncement[];
};

export type AnnouncementAudience = "all" | "department" | "course";

export type StaffAnnouncement = {
  id: string;
  staffId: string;
  authorName: string;
  department: string;
  title: string;
  body: string;
  audience: AnnouncementAudience;
  /** Course code when audience === "course"; otherwise empty. */
  courseCode?: string;
  /** Optional pin to keep on top of the list. */
  pinned: boolean;
  createdAt: number;
};

/** Authorization code required to reset a staff password (demo). */
export const STAFF_RESET_CODE = "CONS-RESET-2025";

/**
 * Lightweight staff session store, persisted in localStorage.
 * Used by the staff login page and read by the staff dashboard
 * so we can render the correct name, department, and filtered courses.
 */
export const useStaffSession = create<StaffStore>()(
  persist(
    (set, get) => ({
      staff: null,
      accounts: [],
      signIn: (s) => set({ staff: s }),
      signOut: () => set({ staff: null }),
      findAccount: (staffId, password) => {
        const id = staffId.trim().toLowerCase();
        return (
          get().accounts.find(
            (a) => a.staffId.toLowerCase() === id && a.password === password,
          ) ?? null
        );
      },
      findAccountByIdentifier: (identifier) => {
        const key = identifier.trim().toLowerCase();
        if (!key) return null;
        return (
          get().accounts.find(
            (a) =>
              a.staffId.toLowerCase() === key ||
              a.email.toLowerCase() === key,
          ) ?? null
        );
      },
      resetPassword: (identifier, newPassword) => {
        const key = identifier.trim().toLowerCase();
        const accounts = get().accounts;
        const idx = accounts.findIndex(
          (a) =>
            a.staffId.toLowerCase() === key ||
            a.email.toLowerCase() === key,
        );
        if (idx === -1) {
          return {
            ok: false,
            error: "No registered account matches that Staff ID or email.",
          };
        }
        const updated = [...accounts];
        updated[idx] = { ...updated[idx], password: newPassword };
        set({ accounts: updated });
        return { ok: true, staffId: updated[idx].staffId };
      },
      announcements: [],
      addAnnouncement: (input) => {
        const announcement: StaffAnnouncement = {
          ...input,
          id:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `ann_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          createdAt: Date.now(),
        };
        set({ announcements: [announcement, ...get().announcements] });
        return announcement;
      },
      deleteAnnouncement: (id) => {
        set({
          announcements: get().announcements.filter((a) => a.id !== id),
        });
      },
      getAnnouncementsForStaff: (staffId) => {
        const key = staffId.toLowerCase();
        return get()
          .announcements.filter((a) => a.staffId.toLowerCase() === key)
          .sort((a, b) => {
            if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
            return b.createdAt - a.createdAt;
          });
      },
    }),
    {
      name: "cons-staff-session",
    },
  ),
);

/**
 * Demo course catalogue. Each course is tagged with the department that
 * "owns" it so the staff dashboard can show only the relevant courses.
 */
export type StaffCourse = {
  code: string;
  title: string;
  level: string;
  students: number;
  department: string;
};

export const ALL_STAFF_COURSES: StaffCourse[] = [
  { code: "NUR 201", title: "Foundations of Nursing Practice", level: "200", students: 84, department: "General Nursing Sciences" },
  { code: "NUR 213", title: "Anatomy & Physiology II", level: "200", students: 84, department: "Anatomy & Physiology" },
  { code: "NUR 305", title: "Medical-Surgical Nursing I", level: "300", students: 62, department: "Medical-Surgical Nursing" },
  { code: "NUR 307", title: "Pharmacology in Nursing", level: "300", students: 62, department: "Pharmacology" },
  { code: "NUR 411", title: "Community Health Nursing", level: "400", students: 47, department: "Community Health Nursing" },
  { code: "MID 202", title: "Principles of Midwifery", level: "200", students: 58, department: "Midwifery" },
  { code: "MID 314", title: "Antenatal & Postnatal Care", level: "300", students: 51, department: "Midwifery" },
  { code: "PHN 301", title: "Public Health Practice", level: "300", students: 44, department: "Public Health Nursing" },
  { code: "MHN 320", title: "Mental Health Nursing", level: "300", students: 39, department: "Mental Health & Psychiatric Nursing" },
  { code: "PED 410", title: "Paediatric Nursing Care", level: "400", students: 36, department: "Paediatric Nursing" },
  { code: "MCH 405", title: "Maternal & Child Health Nursing", level: "400", students: 41, department: "Maternal & Child Health" },
  { code: "CCN 415", title: "Critical Care Nursing", level: "400", students: 28, department: "Critical Care Nursing" },
  { code: "MIC 210", title: "Microbiology for Nurses", level: "200", students: 84, department: "Microbiology" },
  { code: "EDU 401", title: "Nursing Education & Research Methods", level: "400", students: 47, department: "Nursing Education & Research" },
];

/** Build a plausible "Dr. <Surname>" display name from a Staff ID. */
export function deriveStaffName(staffId: string): { name: string; title: string } {
  const tail = staffId.split(/[\/\-]/).filter(Boolean).pop() ?? "Staff";
  const surnames = [
    "Akanni", "Bello", "Sani", "Ibrahim", "Lawal", "Okon",
    "Yusuf", "Aliyu", "Adamu", "Garba", "Suleiman", "Hassan",
  ];
  const idx = Math.abs(hashCode(tail)) % surnames.length;
  return { name: `Dr. ${surnames[idx]}`, title: "Lecturer" };
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}
