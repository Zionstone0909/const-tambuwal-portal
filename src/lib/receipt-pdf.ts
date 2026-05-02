import { jsPDF } from "jspdf";
import logoUrl from "@/assets/cons-tambuwal-logo.png";

export type FeeCategory = "application" | "acceptance" | "tuition" | "hostel" | "library" | "other";

export interface ReceiptLineItem {
  description: string;
  amount: string;
}

export interface ReceiptData {
  category: FeeCategory;
  feeLabel: string;
  amount: string; // total e.g. "₦150,000"
  studentName: string;
  matric?: string;
  applicationNo?: string;
  programme?: string;
  session?: string;
  reference?: string;
  paidAt?: Date;
  lineItems?: ReceiptLineItem[];
  /** When true, opens the receipt in a new tab and triggers the browser's print dialog (A4 optimized) instead of downloading. */
  print?: boolean;
}

const CATEGORY_META: Record<FeeCategory, { title: string; subtitle: string; defaultLines: (label: string, amount: string) => ReceiptLineItem[] }> = {
  application: {
    title: "APPLICATION FEE RECEIPT",
    subtitle: "Admission Form & Processing Payment",
    defaultLines: (label, amount) => [
      { description: "Online Application Form", amount: "" },
      { description: "Processing & Verification Fee", amount: "" },
      { description: label, amount },
    ],
  },
  acceptance: {
    title: "ACCEPTANCE FEE RECEIPT",
    subtitle: "Offer of Admission Acceptance",
    defaultLines: (label, amount) => [
      { description: "Acceptance of Provisional Admission", amount: "" },
      { description: label, amount },
    ],
  },
  tuition: {
    title: "TUITION FEE RECEIPT",
    subtitle: "Semester Tuition Payment",
    defaultLines: (label, amount) => [
      { description: "Tuition Fee", amount: "" },
      { description: "Examination Fee", amount: "" },
      { description: "ICT & Development Levy", amount: "" },
      { description: label, amount },
    ],
  },
  hostel: {
    title: "HOSTEL FEE RECEIPT",
    subtitle: "On-Campus Accommodation",
    defaultLines: (label, amount) => [
      { description: "Hostel Bed Space", amount: "" },
      { description: "Utilities & Maintenance", amount: "" },
      { description: label, amount },
    ],
  },
  library: {
    title: "LIBRARY & ID CARD RECEIPT",
    subtitle: "Student ID & Library Access",
    defaultLines: (label, amount) => [
      { description: "Student ID Card", amount: "" },
      { description: "Library Access & Resources", amount: "" },
      { description: label, amount },
    ],
  },
  other: {
    title: "PAYMENT RECEIPT",
    subtitle: "Official Payment Receipt",
    defaultLines: (label, amount) => [{ description: label, amount }],
  },
};

let cachedLogo: string | null = null;
async function loadLogoDataUrl(): Promise<string | null> {
  if (cachedLogo) return cachedLogo;
  try {
    const res = await fetch(logoUrl);
    const blob = await res.blob();
    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    cachedLogo = dataUrl;
    return dataUrl;
  } catch {
    return null;
  }
}

export async function downloadReceiptPDF(data: ReceiptData) {
  const meta = CATEGORY_META[data.category];
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const ref = data.reference || `CONS-${data.category.toUpperCase().slice(0, 3)}-${Date.now().toString(36).toUpperCase()}`;
  const paidAt = data.paidAt || new Date();
  const lineItems = data.lineItems && data.lineItems.length > 0
    ? data.lineItems
    : meta.defaultLines(data.feeLabel, data.amount);

  const navy: [number, number, number] = [0, 51, 102];
  const gold: [number, number, number] = [212, 175, 55];
  const ink: [number, number, number] = [40, 40, 40];
  const muted: [number, number, number] = [110, 110, 110];
  const hairline: [number, number, number] = [225, 225, 225];

  // ---------- Header ----------
  doc.setFillColor(...navy);
  doc.rect(0, 0, pageW, 40, "F");

  const logo = await loadLogoDataUrl();
  if (logo) {
    // White circular badge so logo reads on navy
    doc.setFillColor(255, 255, 255);
    doc.circle(22, 20, 11, "F");
    try {
      doc.addImage(logo, "PNG", 13, 11, 18, 18, undefined, "FAST");
    } catch {
      /* ignore image errors */
    }
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("COLLEGE OF NURSING SCIENCES", 38, 17);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(255, 255, 255);
  doc.text("Tambuwal, Sokoto State · Nigeria", 38, 23);
  doc.setTextColor(...gold);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("OFFICIAL PAYMENT RECEIPT", 38, 30);

  // Right-side ref/date stack inside header
  doc.setFont("helvetica", "normal");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("RECEIPT NO.", pageW - 15, 14, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(ref, pageW - 15, 19, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("ISSUED", pageW - 15, 25, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(paidAt.toLocaleString(), pageW - 15, 30, { align: "right" });

  // Gold accent
  doc.setFillColor(...gold);
  doc.rect(0, 40, pageW, 2, "F");

  // ---------- Title ----------
  doc.setTextColor(...navy);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text(meta.title, pageW / 2, 56, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...muted);
  doc.text(meta.subtitle, pageW / 2, 62, { align: "center" });

  // ---------- Person card ----------
  const isApplication = data.category === "application";
  const cardY = 72;
  const cardH = 40;
  doc.setDrawColor(...hairline);
  doc.setFillColor(250, 250, 252);
  doc.roundedRect(15, cardY, pageW - 30, cardH, 2.5, 2.5, "FD");

  // Card label tab
  doc.setFillColor(...navy);
  doc.roundedRect(15, cardY, 60, 7, 2.5, 2.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(isApplication ? "APPLICANT INFORMATION" : "STUDENT INFORMATION", 20, cardY + 4.8);

  // Two-column key/value grid
  const colL = 22;
  const colR = pageW / 2 + 4;
  const rowY = cardY + 15;
  const lh = 7;
  const drawKV = (label: string, value: string, x: number, y: number) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(label.toUpperCase(), x, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...ink);
    doc.text(value || "—", x, y + 5);
  };

  drawKV("Full Name", data.studentName, colL, rowY);
  drawKV(
    isApplication ? "Application No" : "Matric No",
    isApplication ? (data.applicationNo || ref) : (data.matric || "—"),
    colR,
    rowY,
  );
  if (data.programme) drawKV("Programme", data.programme, colL, rowY + lh + 6);
  if (data.session) drawKV("Session", data.session, colR, rowY + lh + 6);

  // ---------- Line items ----------
  const tableTop = cardY + cardH + 10;
  const rowH = 8;
  const tableH = 9 + lineItems.length * rowH;

  // Table header bar
  doc.setFillColor(...navy);
  doc.rect(15, tableTop, pageW - 30, 9, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("DESCRIPTION", 20, tableTop + 6);
  doc.text("AMOUNT", pageW - 20, tableTop + 6, { align: "right" });

  // Table body
  doc.setDrawColor(...hairline);
  doc.setLineWidth(0.2);
  lineItems.forEach((line, i) => {
    const y = tableTop + 9 + i * rowH;
    if (i % 2 === 0) {
      doc.setFillColor(248, 249, 251);
      doc.rect(15, y, pageW - 30, rowH, "F");
    }
    doc.setTextColor(...ink);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(line.description, 20, y + 5.5);
    if (line.amount) {
      doc.setFont("helvetica", "bold");
      doc.text(line.amount, pageW - 20, y + 5.5, { align: "right" });
    } else {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...muted);
      doc.setFontSize(9);
      doc.text("included", pageW - 20, y + 5.5, { align: "right" });
    }
  });
  // Table border
  doc.setDrawColor(...hairline);
  doc.rect(15, tableTop, pageW - 30, tableH);

  // ---------- Total band ----------
  const bandY = tableTop + tableH + 6;
  doc.setFillColor(...gold);
  doc.rect(15, bandY, pageW - 30, 14, "F");
  doc.setTextColor(...navy);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("AMOUNT PAID", 20, bandY + 9);
  doc.setFontSize(15);
  doc.text(data.amount, pageW - 20, bandY + 9.5, { align: "right" });

  // ---------- Payment meta + PAID stamp ----------
  const metaY = bandY + 24;
  doc.setTextColor(...muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("PAYMENT METHOD", 20, metaY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...ink);
  doc.text("Paystack (Online)", 20, metaY + 5);

  doc.setTextColor(...muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("STATUS", 70, metaY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 130, 60);
  doc.text("PAID IN FULL", 70, metaY + 5);

  doc.setTextColor(...muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("REFERENCE", 120, metaY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...ink);
  doc.text(ref, 120, metaY + 5);

  // Rotated PAID stamp on the right
  const stampX = pageW - 35;
  const stampY = metaY + 4;
  doc.setDrawColor(0, 130, 60);
  doc.setLineWidth(1.2);
  doc.circle(stampX, stampY, 14);
  doc.circle(stampX, stampY, 11);
  doc.setTextColor(0, 130, 60);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("PAID", stampX, stampY + 1, { align: "center" });
  doc.setFontSize(6.5);
  doc.text(paidAt.toLocaleDateString(), stampX, stampY + 6, { align: "center" });

  // ---------- Footer ----------
  doc.setDrawColor(...hairline);
  doc.line(15, pageH - 26, pageW - 15, pageH - 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...navy);
  doc.text("College of Nursing Sciences, Tambuwal", 15, pageH - 20);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...muted);
  doc.setFontSize(8);
  doc.text("PMB 1015, Tambuwal · Sokoto State · Nigeria", 15, pageH - 15);
  doc.text("bursary@constambuwal.edu.ng · +234 800 000 0000", 15, pageH - 10);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.text(
    "Computer-generated receipt — no signature required. Verify with reference number.",
    pageW - 15,
    pageH - 10,
    { align: "right" },
  );

  // ---------- Page numbers (every page) ----------
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...muted);
    doc.text(`Page ${p} of ${total}`, pageW / 2, pageH - 5, { align: "center" });
  }

  const safeLabel = data.feeLabel.replace(/[^a-z0-9]+/gi, "_").toLowerCase();
  const filename = `receipt_${data.category}_${safeLabel}_${ref}.pdf`;

  if (data.print) {
    // Print-friendly path: open the PDF in a new tab and auto-trigger print.
    // jsPDF already produced an A4 document with print-safe margins (15mm) and standard print font sizes (7.5–17pt).
    doc.autoPrint({ variant: "non-conform" });
    const blobUrl = doc.output("bloburl");
    const w = window.open(blobUrl, "_blank");
    if (!w) {
      // Popup blocked → fall back to download so the user still gets the file.
      doc.save(filename);
    }
    return;
  }

  doc.save(filename);
}

/** Convenience wrapper for the print-friendly variant. */
export function printReceiptPDF(data: Omit<ReceiptData, "print">) {
  return downloadReceiptPDF({ ...data, print: true });
}
