"use server";

import { getSheetDoc } from "@/lib/google";
import { ensureAuthorized, getSheetByTitleCI, type SheetRow } from "./helper";
import { revalidatePath } from "next/cache";

type DownList = {
  id: string;
  title: string;
  year: number;
  is_downloaded: boolean;
  is_watched: boolean;
};

/**
 * Get the downlist from the Google Sheet
 * @returns Array of DownList items
 */
export async function getDownlist(): Promise<DownList[]> {
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

/**
 * Add a new item to the downlist
 * @param title - Movie title
 * @param year - Release year
 */
export async function addToDownlist(title: string, year: string) {
  await ensureAuthorized();
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Downlist");
  await sheet.getRows(); // Load rows to ensure we append correctly

  await sheet.addRows(
    [
      {
        id: crypto.randomUUID(),
        title,
        release_year: year,
        is_downloaded: "FALSE",
        is_watched: "FALSE",
      },
    ],
    { insert: true }
  );

  revalidatePath("/dashboard/downlist");
}

/**
 * Toggle the download status of a downlist item
 * @param id - The ID of the downlist item
 * @param currentStatus - The current download status
 */
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

/**
 * Delete a downlist item by ID
 * @param id - The ID of the downlist item to delete
 */
export async function deleteDownlistItem(id: string) {
  await ensureAuthorized();
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Downlist");
  const rows = await sheet.getRows();

  const row = rows.find((r) => r.get("id") === id);
  if (row) await row.delete();

  revalidatePath("/dashboard/downlist");
}

/**
 * Edit Downlist item (title, year)
 * @param data - new downlist item
 */
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

/**
 * Explicit setter for is_downloaded to avoid client/server mismatch
 * @param id  - The ID of the downlist item
 * @param is_downloaded - The new download status
 */
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
