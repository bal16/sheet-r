"use server";

import { auth } from "@/lib/auth";
import { checkSheetAccess } from "@/lib/google";
import type { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { headers } from "next/headers";

// Add minimal sheet typings to avoid `any`
export type SheetRow = {
  get: (key: string) => string;
  assign: (data: Record<string, string>) => void;
  save: () => Promise<void>;
  delete: () => Promise<void>;
};

export type SpeweekEvent = {
  id: string;
  theme: string;
  added_month_year: string;
  movies: { id: string; title_year: string; is_watched: boolean }[];
};

// --- 0. SECURITY HELPER ---
// Fungsi ini memastikan hanya user yang punya akses Editor yang bisa tulis data
export async function ensureAuthorized() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized: Login required");

  const hasAccess = await checkSheetAccess(session.user.email);
  if (!hasAccess)
    throw new Error("Unauthorized: Insufficient Sheet Permissions");

  return session.user;
}

// Helper: resolve a sheet by title (case-insensitive), ensure metadata loaded
export async function getSheetByTitleCI(
  doc: GoogleSpreadsheet,
  title: string
): Promise<GoogleSpreadsheetWorksheet> {
  // Always load info to ensure we have the latest sheet structure/row counts
  // This prevents issues where cached doc thinks rowCount is smaller than reality
  await doc.loadInfo();

  const direct = doc.sheetsByTitle?.[title];
  if (direct) return direct;

  const match =
    (doc.sheetsByIndex || []).find(
      (s: GoogleSpreadsheetWorksheet) =>
        s?.title?.toLowerCase() === title.toLowerCase()
    ) || null;

  if (!match) {
    throw new Error(
      `Sheet "${title}" not found. Available: ${(doc.sheetsByIndex || [])
        .map((s: GoogleSpreadsheetWorksheet) => s.title)
        .join(", ")}`
    );
  }
  return match;
}