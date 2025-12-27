"use server";

import { auth } from "@/lib/auth";
import { checkSheetAccess } from "@/lib/google";
import type {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";
import { headers } from "next/headers";

/**
 * Type definition for a row in the Google Sheet
 */
export type SheetRow = {
  get: (key: string) => string;
  assign: (data: Record<string, string>) => void;
  save: () => Promise<void>;
  delete: () => Promise<void>;
};

/**
 * Ensure the user is authorized to access the sheet
 * @returns The session object if authorized
 */
export async function ensureAuthorized() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized: Login required", { cause: 401 });

  const hasAccess = await checkSheetAccess(session.user.email);
  if (!hasAccess)
    throw new Error("Unauthorized: Insufficient Sheet Permissions", {
      cause: 403,
    });

  return session;
}

/**
 * Get a sheet by title, case-insensitive
 * @param doc - The Google Spreadsheet document
 * @param title - The title of the sheet to retrieve
 * @returns The matching GoogleSpreadsheetWorksheet
 */
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
