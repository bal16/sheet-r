import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { google } from "googleapis";

/**
 * Authenticate with Google APIs using a service account.
 */
const auth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.readonly",
  ],
});

/**
 * Get the Google Spreadsheet document.
 * @returns   The Google Spreadsheet document.
 */
export async function getSheetDoc() {
  const doc = new GoogleSpreadsheet(
    process.env.GOOGLE_SHEET_ID as string,
    auth
  );
  await doc.loadInfo();
  return doc;
}

/**
 * Check if a user has access to the Google Sheet.
 * @param  userEmail - The email of the user to check.
 * @returns  True if the user has access, false otherwise.
 */
export async function checkSheetAccess(userEmail: string) {
  try {
    const drive = google.drive({ version: "v3", auth });

    const response = await drive.permissions.list({
      fileId: process.env.GOOGLE_SHEET_ID,
      fields: "permissions(emailAddress, role)",
    });

    const permissions = response.data.permissions || [];

    return permissions.some(
      (p) =>
        p.emailAddress === userEmail &&
        ["owner", "writer", "organizer"].includes(p.role as string)
    );
  } catch (error) {
    console.error("Gagal cek akses Drive:", error);
    return false;
  }
}
