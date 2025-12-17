import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { google } from "googleapis";


const auth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Fix untuk Vercel
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.readonly", // Butuh ini untuk cek permission
  ],
});

// --- FUNGSI 1: KONEKSI SHEET (Data) ---
export async function getSheetDoc() {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID as string, auth);
  await doc.loadInfo(); // Load info sheet (judul, jumlah tab, dll)
  return doc;
}

// --- FUNGSI 2: CEK PERMISSION DRIVE (Security) ---
export async function checkSheetAccess(userEmail: string) {
  try {
    const drive = google.drive({ version: "v3", auth });

    // Tanya Google: "Siapa saja yang punya akses ke file Sheet ini?"
    const response = await drive.permissions.list({
      fileId: process.env.GOOGLE_SHEET_ID,
      fields: "permissions(emailAddress, role)",
    });

    const permissions = response.data.permissions || [];

    return permissions.some(
      (p) =>
        p.emailAddress === userEmail &&
        (["owner", "writer", "organizer"].includes(p.role as string))
    );
  } catch (error) {
    console.error("Gagal cek akses Drive:", error);
    return false; // Default to block jika error
  }
}