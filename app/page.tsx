import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Film, Github, Table, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { SignInButton } from "@/components/SignInButton";

const FEATURES = [
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

const TECH = ["Next.js", "Google Sheets API", "Better-Auth", "Tailwind"];
const GITHUB_URL = "https://github.com";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="container mx-auto flex items-center justify-between py-6 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Film className="h-6 w-6 text-indigo-500" />
          <span className="text-xl font-bold tracking-tighter">SheetR</span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="hidden sm:flex gap-2 text-slate-400 hover:text-slate-100 hover:bg-slate-900"
            asChild
          >
            <Link href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              Github
            </Link>
          </Button>
          <SignInButton />
        </div>
      </header>

      <main className="flex flex-col items-center justify-center px-4 md:px-6 pt-16 pb-24 text-center">
        {/* Hero Section */}
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-100">
            Your Personal Film Database. <br className="hidden md:block" />
            <span className="bg-linear-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Zero Bloat.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Manage your movie reviews seamlessly using only Google Sheets.
            Secured by Better-Auth, rendered statically for instant speed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              variant="secondary"
              className="h-12 px-8 font-semibold"
            >
              View Reviews
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 bg-foreground "
            >
              How It Works
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-8 opacity-80">
            {TECH.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full max-w-6xl text-left">
          {FEATURES.map((feature, i) => (
            <Card
              key={i}
              className="bg-slate-900/50 border-slate-800 backdrop-blur-sm"
            >
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/20">
                  <feature.icon className="h-5 w-5 text-indigo-400" />
                </div>
                <CardTitle className="text-slate-100">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 leading-relaxed">
                  {feature.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 md:px-6 py-8">
        <Separator className="bg-slate-800 mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} SheetR. Built for movie lovers.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
