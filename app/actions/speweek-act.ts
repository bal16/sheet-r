"use server";

import { revalidatePath } from "next/cache";
import { ensureAuthorized, getSheetByTitleCI } from "./helper";
import { getSheetDoc } from "@/lib/google";

/**
 * Type definition for a Speweek event
 */
type SpeweekEvent = {
  id: string;
  theme: string;
  added_month_year: string;
  movies: { id: string; title_year: string; is_watched: boolean }[];
};

/**
 * Generate a stable event ID based on theme and added month-year
 * @param theme - The theme of the Speweek event
 * @param added_month_year - The month and year the event was added
 * @returns A stable string ID for the event
 */
function makeEventId(theme: string, added_month_year: string): string {
  return `${theme
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")}:${added_month_year.trim()}`;
}

/**
 * Get all Speweek events from the Google Sheet
 * @returns Array of SpeweekEvent items
 */
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

/**
 * Add a new Speweek event placeholder to the Google Sheet
 * @param data - Speweek event data
 */
export async function addSpeweekEvent(data: {
  theme: string;
  added_month_year: string;
}) {
  await ensureAuthorized();
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Speweek");
  await sheet.getRows(); // Load rows to ensure we append correctly

  // Create a placeholder row to represent the event (no movie yet)
  await sheet.addRows(
    [
      {
        id: crypto.randomUUID(),
        title_year: "",
        added_month: data.added_month_year.split("-")[0],
        added_year: data.added_month_year.split("-")[1],
        theme: data.theme,
        is_watched: "FALSE",
      },
    ],
    { insert: true }
  );

  revalidatePath("/dashboard/speweek");
}

/**
 * Add a new movie to an existing Speweek event in the Google Sheet
 * @param data - Movie data to add to the Speweek event
 */
export async function addToSpeweek(data: {
  title: string;
  release_year: string;
  added_month_year: string;
  theme: string;
}) {
  await ensureAuthorized();
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Speweek");

  const rows = await sheet.getRows();

  const row = rows.find(
    (r) =>
      r.get("theme") === data.theme &&
      r.get("title") === "" &&
      r.get("release_year") === ""
  );

  if (row) await row.delete();

  await sheet.addRows(
    [
      {
        id: crypto.randomUUID(),
        title: data.title,
        release_year: data.release_year,
        added_month: data.added_month_year.split("-")[0],
        added_year: data.added_month_year.split("-")[1],
        theme: data.theme,
        is_watched: "FALSE",
      },
    ],
    { insert: true }
  );

  revalidatePath("/dashboard/speweek");
}

/**
 * Delete a Speweek item by ID
 * @param id - The ID of the Speweek item to delete
 */
export async function deleteSpeweekItem(id: string) {
  await ensureAuthorized();
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Speweek");
  const rows = await sheet.getRows();

  const row = rows.find((r) => r.get("id") === id);
  if (row) await row.delete();

  revalidatePath("/dashboard/speweek");
}
