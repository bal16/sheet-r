// lib/auth.ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
   
    // Opsi tambahan: Membatasi siapa yang boleh login (Opsional)
    // Tapi untuk MVP, kita biarkan login dulu, baru blokir di halaman Dashboard.
});