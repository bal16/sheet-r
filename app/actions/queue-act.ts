"use server";

import { getSheetDoc } from "@/lib/google";
import { revalidatePath } from "next/cache";
import { ensureAuthorized, getSheetByTitleCI } from "./helper";

export async function getQueue() {
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Queue");
  const rows = await sheet.getRows();

  // Urutan array = Urutan baris di sheet (Otomatis Rank)
  return rows.map((row) => ({
    id: row.get("ref_id"), // Mapping ref_id ke id untuk konsistensi UI
    title: row.get("title"),
    type: row.get("origin") as "downlist" | "speweek",
  }));
}

export async function addToQueue(movie: {
  id: string;
  title: string;
  origin: string;
}) {
  await ensureAuthorized();
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Queue");

  // Cek duplikat dulu biar gak double
  const rows = await sheet.getRows();
  const exists = rows.find((r) => r.get("ref_id") === movie.id);

  if (!exists) {
    await sheet.addRows(
      [
        {
          ref_id: movie.id,
          origin: movie.origin, // 'downlist' atau 'speweek'
          title: movie.title,
          added_at: new Date().toISOString(),
        },
      ],
      { insert: true }
    );
  }

  revalidatePath("/dashboard");
}

export async function updateQueueOrder(
  newOrderItems: { id: string; title: string; type: string }[]
) {
  await ensureAuthorized();
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Queue");
  const rows = await sheet.getRows();

  for (const { id } of newOrderItems) {
    const row = rows.find((r) => r.get("ref_id") === id);
    if (row) await row.delete();
  }

  // Masukkan data baru sesuai urutan
  const rowsToAdd = newOrderItems.map((item) => ({
    ref_id: item.id,
    origin: item.type,
    title: item.title,
    added_at: new Date().toISOString(), // Update timestamp atau keep old one
  }));

  await sheet.addRows(rowsToAdd, { insert: true });

  revalidatePath("/dashboard");
}

export async function removeFromQueue(refId: string) {
  await ensureAuthorized();
  const doc = await getSheetDoc();
  const sheet = await getSheetByTitleCI(doc, "Queue");
  const rows = await sheet.getRows();

  const row = rows.find((r) => r.get("ref_id") === refId);
  if (row) await row.delete();

  revalidatePath("/dashboard");
}
