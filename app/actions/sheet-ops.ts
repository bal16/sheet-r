"use server";

import { getSheetDoc, checkSheetAccess } from "@/lib/google";
import { auth } from "@/lib/auth"; // Konfigurasi Better-Auth Anda
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

// Add minimal sheet typings to avoid `any`
type SheetRow = {
  get: (key: string) => string;
  assign: (data: Record<string, string>) => void;
  save: () => Promise<void>;
  delete: () => Promise<void>;
};

// --- 0. SECURITY HELPER ---
// Fungsi ini memastikan hanya user yang punya akses Editor yang bisa tulis data
async function ensureAuthorized() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized: Login required");

  const hasAccess = await checkSheetAccess(session.user.email);
  if (!hasAccess)
    throw new Error("Unauthorized: Insufficient Sheet Permissions");

  return session.user;
}

// Helper: resolve a sheet by title (case-insensitive), ensure metadata loaded
async function getSheetByTitleCI(
  doc: GoogleSpreadsheet,
  title: string
): Promise<GoogleSpreadsheetWorksheet> {
  // load sheet metadata if needed
  if (!doc.sheetsByIndex || doc.sheetsByIndex.length === 0) {
    await doc.loadInfo?.();
  }

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

// ==========================================
// 1. REVIEWS CRUD (Master Archive)
// ==========================================

export async function getReviews() {
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Reviews");
  const rows = await sheet.getRows();

  return rows.map((row: SheetRow) => ({
    id: row.get("id"),
    title: row.get("title"),
    rating: Number(row.get("rating")),
    date: row.get("date"),
  }));
}

// Fix review sync: match Speweek by `title_year` (strip year)
export async function addReview(data: {
  id?: string;
  title: string;
  rating: number;
  date: string;
}) {
  await ensureAuthorized();
  const doc = await getSheetDoc();

  const reviewSheet = await getSheetByTitleCI(doc, "Reviews");
  await reviewSheet.addRow({
    id: data.id || crypto.randomUUID(),
    title: data.title,
    rating: String(data.rating),
    date: data.date,
  });

  const downlistSheet = await getSheetByTitleCI(doc, "Downlist");
  const downRows = await downlistSheet.getRows();
  const speweekSheet = await getSheetByTitleCI(doc, "Speweek");
  const speRows = await speweekSheet.getRows();

  let downItem: SheetRow | undefined;
  let speItem: SheetRow | undefined;
  if (data.id) {
    downItem = downRows.find(
      (row) => (row.get("id") as string) === data.id
    );

    speItem = speRows.find(
      (row) =>
        (row.get("id") as string) === data.id
    );
  } else {
    downItem = downRows.find(
      (row) =>
        (row.get("title") as string).toLowerCase() === data.title.toLowerCase()
    );

    speItem = speRows.find(
      (row) =>
        (row.get("title") as string).toLowerCase() === data.title.toLowerCase()
    );
  }

  if (downItem) {
    downItem.assign({ is_watched: "TRUE" });
    await downItem.save();
  }

  if (speItem) {
    speItem.assign({ is_watched: "TRUE" });
    await speItem.save();
  }

  revalidatePath("/dashboard/reviews");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateReview(data: {
  id: string;
  title: string;
  rating: number;
}) {
  await ensureAuthorized();
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Reviews");
  const rows = await sheet.getRows();

  const row = rows.find((r) => r.get("id") === data.id);
  if (row) {
    row.assign({
      title: data.title,
      rating: String(data.rating),
    });
    await row.save();
  }

  revalidatePath("/dashboard/reviews");
}

export async function deleteReview(id: string) {
  await ensureAuthorized();
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Reviews");
  const rows = await sheet.getRows();

  const rowToDelete = rows.find((r) => r.get("id") === id);
  if (rowToDelete) await rowToDelete.delete();

  revalidatePath("/dashboard/reviews");
}

// ==========================================
// 2. DOWNLIST CRUD (Backlog)
// ==========================================

export async function getDownlist() {
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Downlist");
  const rows = await sheet.getRows();

  return rows.map((row: SheetRow) => ({
    id: row.get("id"),
    title: row.get("title"),
    year: Number(row.get("release_year")), // ensure number
    is_downloaded: row.get("is_downloaded") === "TRUE",
    is_watched: row.get("is_watched") === "TRUE",
  }));
}

export async function addToDownlist(title: string, year: string) {
  await ensureAuthorized();
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Downlist");

  await sheet.addRow({
    id: crypto.randomUUID(),
    title,
    release_year: year,
    is_downloaded: "FALSE",
    is_watched: "FALSE",
  });

  revalidatePath("/dashboard/downlist");
}

export async function toggleDownloadStatus(id: string, currentStatus: boolean) {
  await ensureAuthorized();
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Downlist");
  const rows = await sheet.getRows();

  const row = rows.find((r) => r.get("id") === id);
  if (row) {
    row.assign({ is_downloaded: currentStatus ? "FALSE" : "TRUE" });
    await row.save();
  }

  revalidatePath("/dashboard/downlist");
}

export async function deleteDownlistItem(id: string) {
  await ensureAuthorized();
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Downlist");
  const rows = await sheet.getRows();

  const row = rows.find((r) => r.get("id") === id);
  if (row) await row.delete();

  revalidatePath("/dashboard/downlist");
}

// Edit Downlist item (title, year)
export async function updateDownlistItem(data: {
  id: string;
  title: string;
  year: number | string;
}) {
  await ensureAuthorized();
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Downlist");
  const rows = await sheet.getRows();

  const row = rows.find((r) => r.get("id") === data.id);
  if (row) {
    row.assign({
      title: data.title,
      release_year: String(data.year),
    });
    await row.save();
  }

  revalidatePath("/dashboard/downlist");
}

// Explicit setter for is_downloaded to avoid client/server mismatch
export async function setDownloadStatus(id: string, is_downloaded: boolean) {
  await ensureAuthorized();
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Downlist");
  const rows = await sheet.getRows();

  const row = rows.find((r) => r.get("id") === id);
  if (row) {
    row.assign({ is_downloaded: is_downloaded ? "TRUE" : "FALSE" });
    await row.save();
  }

  revalidatePath("/dashboard/downlist");
}

// ==========================================
// 3. SPEWEEK CRUD (Events)
// ==========================================

// Helper to make a stable event id from theme + month-year
function makeEventId(theme: string, added_month_year: string): string {
  return `${theme
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")}:${added_month_year.trim()}`;
}

type SpeweekEvent = {
  id: string;
  theme: string;
  added_month_year: string;
  movies: { id: string; title_year: string; is_watched: boolean }[];
};

export async function getSpeweek(): Promise<SpeweekEvent[]> {
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Speweek");
  const rows = await sheet.getRows();

  const groups = new Map<string, SpeweekEvent>();

  for (const row of rows) {
    const theme = row.get("theme");
    const added_month_year = `${row.get("added_month")}-${row.get(
      "added_year"
    )}`;
    const title_year = row.get("title")
      ? `${row.get("title")} (${row.get("release_year")})`
      : "";
    const is_watched = row.get("is_watched") === "TRUE";
    const eventId = makeEventId(theme, added_month_year);

    if (!groups.has(eventId)) {
      groups.set(eventId, {
        id: eventId,
        theme,
        added_month_year,
        movies: [],
      });
    }

    // Treat empty title_year as an event placeholder row
    if (title_year.trim().length > 0) {
      groups.get(eventId)!.movies.push({
        id: row.get("id"),
        title_year,
        is_watched,
      });
    }
  }

  return Array.from(groups.values());
}

export async function addSpeweekEvent(data: {
  theme: string;
  added_month_year: string;
}) {
  await ensureAuthorized();
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Speweek");

  // Create a placeholder row to represent the event (no movie yet)
  await sheet.addRow({
    id: crypto.randomUUID(),
    title_year: "",
    added_month: data.added_month_year.split("-")[0],
    added_year: data.added_month_year.split("-")[1],
    theme: data.theme,
    is_watched: "FALSE",
  });

  revalidatePath("/dashboard/speweek");
}

export async function addToSpeweek(data: {
  title: string;
  release_year: string;
  added_month_year: string;
  theme: string;
}) {
  await ensureAuthorized();
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Speweek");

  await sheet.addRow({
    id: crypto.randomUUID(),
    title: data.title,
    release_year: data.release_year,
    added_month: data.added_month_year.split("-")[0],
    added_year: data.added_month_year.split("-")[1],
    theme: data.theme,
    is_watched: "FALSE",
  });

  revalidatePath("/dashboard/speweek");
}

export async function deleteSpeweekItem(id: string) {
  await ensureAuthorized();
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Speweek");
  const rows = await sheet.getRows();

  const row = rows.find((r) => r.get("id") === id);
  if (row) await row.delete();

  revalidatePath("/dashboard/speweek");
}
