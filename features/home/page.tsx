import Link from "next/link";
import { Film, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { SignInButton } from "./components/SignInButton";
import { FEATURES, GITHUB_URL, STEPS, TECH } from "./const";

export default function HomePage() {
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
            Personal Film Tracker. <br className="hidden md:block" />
            <span className="bg-linear-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Powered by Sheets.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A static site generator for movie lovers. Use Google Sheets as your
            database, configure your ID, and deploy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild className="h-12 px-8 font-semibold">
              <Link href="/dashboard">View Reviews</Link>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="h-12 px-8 "
              asChild
            >
              <Link href="#how-it-works">How It Works</Link>
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

        {/* How It Works Section */}
        <div id="how-it-works" className="w-full max-w-6xl mt-32 mb-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100">
              How It Works
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Simple setup. No complex database migrations needed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-linear-to-r from-indigo-500/0 via-indigo-500/20 to-indigo-500/0" />

            {STEPS.map((step, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center text-center space-y-4"
              >
                <div className="h-24 w-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center z-10 shadow-xl shadow-indigo-500/5">
                  <step.icon className="h-10 w-10 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-100">
                  {step.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
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
