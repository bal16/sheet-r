import { Database, PenLine, ShieldCheck, Table, Zap } from "lucide-react";

export const FEATURES = [
  {
    icon: Table,
    title: "Spreadsheet Backend",
    content:
      "CRUD operations directly to Google Sheets. No SQL database required.",
  },
  {
    icon: ShieldCheck,
    title: "Owner-Only Access",
    content:
      "Strict whitelist logic ensures only you can access the admin dashboard.",
  },
  {
    icon: Zap,
    title: "Static Performance",
    content: "Reviews are fetched at build time. The site loads instantly.",
  },
];

export const STEPS = [
  {
    icon: Database,
    title: "1. Setup Config",
    desc: "Clone the repo and add your Google Sheet ID to the environment variables.",
  },
  {
    icon: PenLine,
    title: "2. Add Content",
    desc: "Write reviews and manage your watchlist directly in your Google Sheet.",
  },
  {
    icon: Zap,
    title: "3. Build & Deploy",
    desc: "Generate a static site with your data. Fast, secure, and free to host.",
  },
];

export const TECH = ["Next.js", "Google Sheets API", "Better-Auth", "Tailwind"];
export const GITHUB_URL = "https://github.com/bal16/sheet-r.git";
