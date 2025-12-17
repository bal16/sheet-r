import { ShieldCheck, Table, Zap } from "lucide-react";

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

export const TECH = ["Next.js", "Google Sheets API", "Better-Auth", "Tailwind"];
export const GITHUB_URL = "https://github.com";