"use server";

import { getSheetDoc } from "@/lib/google";
import { revalidatePath } from "next/cache";
import { ensureAuthorized, getSheetByTitleCI } from "./helper";

export type QueueItem = {
  id: string;
  title: string;
  type: "downlist" | "speweek";
};

/**
 * Get the current queue from the Google Sheet
 * @returns Array of Queue items
 */
export async function getQueue(): Promise<QueueItem[]> {
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Queue");
  const rows = await sheet.getRows();

  return rows.map((row) => ({
    id: row.get("ref_id"),
    title: row.get("title"),
    type: row.get("origin"),
  }));
}

/**
 * Add a movie to the queue if it doesn't already exist
 * @param movie - The movie to add to the queue
 */
export async function addToQueue(movie: {
  id: string;
  title: string;
  origin: "downlist" | "speweek";
}) {
  await ensureAuthorized();
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Queue");

  const rows = await sheet.getRows();
  const exists = rows.find((r) => r.get("ref_id") === movie.id);

  if (!exists) {
    await sheet.addRows(
      [
        {
          ref_id: movie.id,
          origin: movie.origin,
          title: movie.title,
          added_at: new Date().toISOString(),
        },
      ],
      { insert: true }
    );
  }

  revalidatePath("/dashboard");
}

/**
 * Update the order of items in the queue
 * @param newOrderItems - Array of Queue items in the new order
 */
export async function updateQueueOrder(newOrderItems: QueueItem[]) {
  await ensureAuthorized();
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Queue");
  const rows = await sheet.getRows();

  for (const { id } of newOrderItems) {
    const row = rows.find((r) => r.get("ref_id") === id);
    if (row) await row.delete();
  }

  const rowsToAdd = newOrderItems.map((item) => ({
    ref_id: item.id,
    origin: item.type,
    title: item.title,
    added_at: new Date().toISOString(),
  }));

  await sheet.addRows(rowsToAdd, { insert: true });

  revalidatePath("/dashboard");
}

/**
 * Remove a movie from the queue by its reference ID
 * @param refId - The reference ID of the movie to remove
 */
export async function removeFromQueue(refId: string) {
  await ensureAuthorized();
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Queue");
  const rows = await sheet.getRows();

  const row = rows.find((r) => r.get("ref_id") === refId);
  if (row) await row.delete();

  revalidatePath("/dashboard");
}
