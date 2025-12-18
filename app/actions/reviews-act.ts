"use server";

import { getSheetDoc } from "@/lib/google";
import { ensureAuthorized, getSheetByTitleCI, type SheetRow } from "./helper";
import { revalidatePath } from "next/cache";

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
    downItem = downRows.find((row) => (row.get("id") as string) === data.id);

    speItem = speRows.find((row) => (row.get("id") as string) === data.id);
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