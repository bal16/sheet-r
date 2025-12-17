import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function checkIsAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return false;

  // Cek apakah email user sama dengan email ADMIN di .env
  // ATAU cek ke Google Sheet "Users" di sini jika ingin multiple admin
  return session.user.email === process.env.ADMIN_EMAIL;
}
