"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Sparkles,
  Shield,
  Play,
  Sun,
  Moon,
  NotebookPen,
  StickyNote,
  ClipboardList,
  Bot,
  Library,
  LayoutPanelTop,
  ListChecks,
  TimerReset,
  FileText,
  Ban,
} from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

/**
 * DeepTutor Landing Page — aligned with the new MVP feature set
 * - Reflects 12 features (Roadmap Extractor → Why this MVP)
 * - Polished glass/gradient aesthetic, motion on scroll, dark mode
 * - No auth logic; CTAs link to /signin and /signup
 *
 * Place at: src/app/(marketing)/page.tsx  (or src/app/page.tsx)
 * Requires: tailwindcss, framer-motion, lucide-react
 */

// ---------------------- Theme Hook ----------------------
function useTheme() {
  type Theme = "light" | "dark";
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = (typeof window !== "undefined" &&
      localStorage.getItem("theme")) as Theme | null;
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
    const root = document.documentElement;
    if (initial === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  return { theme, setTheme, mounted };
}

// ---------------------- Page ----------------------
export default function LandingPage() {
  const { theme, setTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] text-slate-900 antialiased dark:bg-[#070B14] dark:text-slate-100">
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-900 dark:border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#F8FAFF] text-slate-900 antialiased dark:bg-[#070B14] dark:text-slate-100">
      {/* --- Background Decor --- */}
      <BGDecor />

      {/* --- Nav --- */}
      <nav className="sticky top-0 z-40 w-full border-b border-black/5 bg-white/55 backdrop-blur supports-[backdrop-filter]:bg-white/45 dark:border-white/10 dark:bg-white/5">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="#" className="group flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-2xl ring-1 ring-black/10 dark:ring-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-500" />
            </div>
            <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
              DeepTutor
            </span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <a
              href="#features"
              className="text-sm font-medium opacity-80 hover:opacity-100"
            >
              Features
            </a>
            <a
              href="#how"
              className="text-sm font-medium opacity-80 hover:opacity-100"
            >
              How it works
            </a>
            <a
              href="#limits"
              className="text-sm font-medium opacity-80 hover:opacity-100"
            >
              Limits
            </a>
            <a
              href="#privacy"
              className="text-sm font-medium opacity-80 hover:opacity-100"
            >
              Privacy
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-black/10 bg-white/70 shadow-sm transition hover:scale-105 dark:border-white/10 dark:bg-white/5"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            <SignedOut>
              <SignInButton>
                <button className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white/80 px-3 py-2 text-sm font-medium shadow-sm transition hover:scale-[1.02] dark:border-white/10 dark:bg-white/10">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white/80 px-3 py-2 text-sm font-medium shadow-sm transition hover:scale-[1.02] dark:border-white/10 dark:bg-white/10">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-sky-500/40 via-indigo-500/40 to-violet-500/40" />
        </div>
      </nav>

      {/* --- Hero --- */}
      <header className="relative">
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 md:pt-24">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto max-w-5xl text-center text-4xl leading-tight font-extrabold tracking-tight sm:text-6xl"
          >
            From{" "}
            <span className="inline-block bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
              syllabus
            </span>{" "}
            to mastery — roadmap, notes, quizzes & tutor in one place.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-slate-600 dark:text-slate-300"
          >
            Upload a handout, auto-generate your study path, learn
            topic‑by‑topic with DeepTutor, quiz yourself, and ground everything
            in your own books.
          </motion.p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-xl hover:brightness-110 active:scale-[0.98] dark:bg-white dark:text-slate-900"
            >
              <Sparkles className="h-4 w-4" />
              <span>Start for free</span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white/70 px-5 py-3 text-sm font-medium shadow-sm transition hover:scale-[1.02] dark:border-white/10 dark:bg-white/10"
            >
              <Play className="h-4 w-4" /> See features
            </a>
          </div>

          {/* Hero Preview Panel */}
          <div className="relative mx-auto mt-14 max-w-5xl">
            <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/70 p-4 shadow-xl backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <PreviewCard
                  title="Roadmap Extractor"
                  desc="Turn a messy PDF into clean Modules → Topics with time estimates."
                  icon={<BookOpen className="h-4 w-4" />}
                />
                <PreviewCard
                  title="DeepTutor Lesson"
                  desc="Auto‑generated, structured notes with examples, pitfalls & checkpoints."
                  icon={<Brain className="h-4 w-4" />}
                />
                <PreviewCard
                  title="Drona Chatbot"
                  desc="Ask questions grounded in your books with exact page citations."
                  icon={<Bot className="h-4 w-4" />}
                />
                <PreviewCard
                  title="Quizmaster"
                  desc="Topic or module level quizzes: MCQ, TF, short answers with rationale."
                  icon={<ClipboardList className="h-4 w-4" />}
                />
              </div>
              <div className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-gradient-to-br from-sky-500/20 via-indigo-500/20 to-violet-500/20 blur-3xl" />
            </div>
          </div>
        </div>
      </header>

      {/* --- Feature Overview (12) --- */}
      <section id="features" className="relative">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold sm:text-4xl"
            >
              Everything you need to actually learn
            </motion.h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              A tight loop: plan → learn → quiz → revise → clarify, powered by
              your own books.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <FeatureTile
                key={f.title}
                icon={f.icon}
                title={`${i + 1}. ${f.title}`}
                desc={f.desc}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- How It Works (3 steps) --- */}
      <section
        id="how"
        className="relative border-t border-black/5 dark:border-white/10"
      >
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h3 className="text-2xl font-bold sm:text-3xl">How it works</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Simple flow, strong outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Upload syllabus",
                desc: "We extract a clean outline (Modules → Topics) and estimates.",
              },
              {
                step: "2",
                title: "Study by topic",
                desc: "Open a topic to generate DeepTutor notes and a mini‑quiz.",
              },
              {
                step: "3",
                title: "Ground with books",
                desc: "Index two PDFs and get inline citations in answers.",
              },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-500 text-sm font-bold text-white shadow">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Limits / Privacy --- */}
      <section id="limits" className="relative">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow dark:bg-white dark:text-slate-900">
                <Ban className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Boundaries & limits</h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                <li>English-only content</li>
                <li>
                  PDFs only; up to 2 books per roadmap, ≤ 1000 pages total
                </li>
                <li>
                  No code execution, web browsing, slide indexing, LMS export,
                  or spaced repetition in MVP
                </li>
              </ul>
            </div>

            <div
              id="privacy"
              className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
            >
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow dark:bg-white dark:text-slate-900">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Your data stays yours</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                We use Supabase with strict Row‑Level Security and private
                storage buckets. Export & delete anytime.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Tag>RLS on every table</Tag>
                <Tag>Signed URLs for PDFs</Tag>
                <Tag>Google sign‑in only</Tag>
                <Tag>Local vector search</Tag>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Final CTA --- */}
      <section className="relative">
        <div className="mx-auto max-w-3xl px-4 pt-8 pb-24 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-black/10 bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-violet-500/10 p-8 shadow-sm backdrop-blur dark:border-white/10"
          >
            <h3 className="text-2xl font-bold">Ready to learn deeper?</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Sign up and explore the app.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
              >
                <Sparkles className="h-4 w-4" /> Get started free
              </Link>
              <Link
                href="/signin"
                className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white/70 px-5 py-3 text-sm font-medium shadow-sm transition hover:scale-[1.02] dark:border-white/10 dark:bg-white/10"
              >
                Sign in
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="border-t border-black/5 py-8 text-sm text-slate-500 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
          <p>© {new Date().getFullYear()} DeepTutor</p>
          <div className="flex items-center gap-4">
            <Link href="#features" className="hover:underline">
              Features
            </Link>
            <Link href="#how" className="hover:underline">
              How it works
            </Link>
            <Link href="#limits" className="hover:underline">
              Limits
            </Link>
            <Link href="#privacy" className="hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ---------------------- Data ----------------------
const features = [
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: "Roadmap Extractor",
    desc: "Upload a syllabus PDF; extract Modules → Topics with time estimates and editable order.",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: "Custom Roadmap Generator",
    desc: "No syllabus? Enter goal, background, timeframe; get a logical, fully‑editable plan.",
  },
  {
    icon: <Brain className="h-5 w-5" />,
    title: "DeepTutor Lessons",
    desc: "Structured Markdown: overview, prerequisites, core concepts, examples, formulas, pitfalls, checkpoints, references.",
  },
  {
    icon: <NotebookPen className="h-5 w-5" />,
    title: "Unified Notes",
    desc: "One place for DeepTutor takeaways, saved Drona replies, and manual notes — all editable.",
  },
  {
    icon: <StickyNote className="h-5 w-5" />,
    title: "Sticky Notes + Explainer",
    desc: "Drop inline stickies anywhere; select any region to get a simpler explanation or save as note.",
  },
  {
    icon: <ListChecks className="h-5 w-5" />,
    title: "Short Notes",
    desc: "Auto‑generated bullet summaries for each lesson; freely edit or regenerate after changes.",
  },
  {
    icon: <ClipboardList className="h-5 w-5" />,
    title: "Quizmaster",
    desc: "MCQ (single/multi), True/False, Short answers — with explanations, retakes, and module‑mix mode.",
  },
  {
    icon: <TimerReset className="h-5 w-5" />,
    title: "Revision Mode",
    desc: "Topic: short notes + mini‑quiz. Module: cheat sheet across topics + mixed quiz with weak‑area highlights.",
  },
  {
    icon: <Bot className="h-5 w-5" />,
    title: "Drona — Mentor Tutor",
    desc: "Answers grounded in your books and current lesson, with page citations and micro‑roadmaps. Focused scope reuses generation + retrieval across features to keep the learning loop tight and practical.",
  },
  {
    icon: <Library className="h-5 w-5" />,
    title: "Book Indexing",
    desc: "Attach up to 2 PDFs (≤1000 pages total) per roadmap; instant citations in notes and chat.",
  },
  {
    icon: <LayoutPanelTop className="h-5 w-5" />,
    title: "Dashboard & Navigation",
    desc: "See progress, time remaining, resume buttons. Sidebar shows Roadmap → Modules → Topics with drag‑and‑drop.",
  },
] as const;

// ---------------------- UI Bits ----------------------
function PreviewCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10">
      <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-500 text-white shadow">
        {icon}
      </div>
      <h4 className="text-sm font-semibold">{title}</h4>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{desc}</p>
    </div>
  );
}

function FeatureTile({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:shadow-md dark:border-white/10 dark:bg-white/5"
    >
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow dark:bg-white dark:text-slate-900">
        {icon}
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{desc}</p>
      <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-gradient-to-br from-sky-500/20 via-indigo-500/20 to-violet-500/20 blur-2xl transition group-hover:scale-110" />
    </motion.div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-xl border border-black/10 bg-white/60 px-3 py-1 text-xs font-medium shadow-sm dark:border-white/10 dark:bg-white/10">
      {children}
    </span>
  );
}

function BGDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {/* study-aurora blobs */}
      <div className="absolute -top-56 left-1/2 h-[780px] w-[1600px] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-400/20 via-indigo-400/20 to-violet-400/20 blur-3xl" />
      <div className="absolute bottom-[-220px] left-1/3 h-[520px] w-[980px] rounded-full bg-gradient-to-r from-teal-400/15 via-sky-400/10 to-indigo-400/10 blur-3xl" />
      {/* subtle grid/noise */}
      <div className="absolute inset-0 [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:14px_14px] opacity-[0.05] dark:opacity-[0.08]" />
    </div>
  );
}
