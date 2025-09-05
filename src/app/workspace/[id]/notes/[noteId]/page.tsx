"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Edit3, 
  Star, 
  Share2, 
  MoreHorizontal,
  Calendar,
  Clock,
  Tag,
  FileText,
  Sun,
  Moon
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "~/hooks/useTheme";

// Mock note data
const mockNote = {
  id: "n1",
  title: "ML Overview",
  content: `# Machine Learning Overview

Machine learning is a subset of artificial intelligence (AI) that enables computers to learn and make decisions from data without being explicitly programmed for every task.

## Key Concepts

### What is Machine Learning?
Machine learning algorithms build mathematical models based on training data to make predictions or decisions without being explicitly programmed to perform the task.

### Types of Machine Learning
1. **Supervised Learning**: Uses labeled training data
2. **Unsupervised Learning**: Finds patterns in data without labels
3. **Reinforcement Learning**: Learns through interaction with environment

## Applications
- Image recognition
- Natural language processing
- Recommendation systems
- Autonomous vehicles
- Medical diagnosis

## Getting Started
To begin with machine learning, you should have a solid foundation in:
- Mathematics (statistics, linear algebra, calculus)
- Programming (Python or R)
- Data analysis and visualization

Machine learning is transforming industries and creating new possibilities for solving complex problems.`,
  tags: ["fundamentals", "overview", "introduction"],
  topicId: "t1",
  topicTitle: "Introduction to Machine Learning",
  createdAt: new Date("2024-02-15"),
  updatedAt: new Date("2024-02-18"),
  wordCount: 245,
  readTime: 2,
  isStarred: false
};

export default function NotePage() {
  const params = useParams();
  const workspaceId = params.id as string;
  const noteId = params.noteId as string;
  const [isStarred, setIsStarred] = useState(mockNote.isStarred);
  const { theme, setTheme, mounted } = useTheme();

  // In a real app, fetch note data based on noteId
  const note = mockNote;

  return (
    <div className="min-h-screen bg-[#F8FAFF] dark:bg-[#070B14]">
      {/* Header */}
      <header className="border-b border-black/10 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/workspace/${workspaceId}`}
              className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">{note.title}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Updated {mounted ? note.updatedAt.toLocaleDateString() : '...'}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {note.readTime} min read
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {note.wordCount} words
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-black/10 bg-white/70 shadow-sm transition hover:scale-105 dark:border-white/10 dark:bg-white/5"
            >
              {mounted && theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => setIsStarred(!isStarred)}
              className={`rounded-lg p-2 transition ${
                isStarred 
                  ? 'text-yellow-500 hover:text-yellow-600' 
                  : 'hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Star className={`h-5 w-5 ${isStarred ? 'fill-current' : ''}`} />
            </button>
            <Link
              href={`/workspace/${workspaceId}/notes/${noteId}/edit`}
              className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5"
            >
              <Edit3 className="h-5 w-5" />
            </Link>
            <button className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5">
              <Share2 className="h-5 w-5" />
            </button>
            <button className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl p-6">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-black/10 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
        >
          {/* Note Header */}
          <div className="border-b border-black/10 p-6 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                {note.topicTitle && (
                  <span className="inline-block rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700 dark:bg-sky-900 dark:text-sky-300 mb-2">
                    {note.topicTitle}
                  </span>
                )}
                <h1 className="text-2xl font-bold mb-2">{note.title}</h1>
              </div>
            </div>

            {/* Tags */}
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Note Content */}
          <div className="p-6">
            <div className="prose prose-slate max-w-none dark:prose-invert">
              {note.content.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-2xl font-bold mb-4 mt-6 first:mt-0">{line.slice(2)}</h1>;
                } else if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-xl font-semibold mb-3 mt-5">{line.slice(3)}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-lg font-medium mb-2 mt-4">{line.slice(4)}</h3>;
                } else if (line.startsWith('- ')) {
                  return <li key={index} className="ml-4 mb-1">{line.slice(2)}</li>;
                } else if (/^\d+\. /.exec(line)) {
                  return <li key={index} className="ml-4 mb-1 list-decimal">{line.replace(/^\d+\. /, '')}</li>;
                } else if (line.startsWith('**') && line.endsWith('**')) {
                  return <p key={index} className="font-semibold mb-2">{line.slice(2, -2)}</p>;
                } else if (line.trim() === '') {
                  return <br key={index} />;
                } else {
                  return <p key={index} className="mb-3 leading-relaxed">{line}</p>;
                }
              })}
            </div>
          </div>

          {/* Note Footer */}
          <div className="border-t border-black/10 p-6 dark:border-white/10">
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
              <div>
                Created on {mounted ? note.createdAt.toLocaleDateString() : '...'}
              </div>
              <div>
                Last updated {mounted ? note.updatedAt.toLocaleDateString() : '...'}
              </div>
            </div>
          </div>
        </motion.article>

        {/* Related Actions */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <Link
            href={`/workspace/${workspaceId}/notes/${noteId}/edit`}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            <Edit3 className="h-4 w-4" />
            Edit Note
          </Link>
          <Link
            href={`/workspace/${workspaceId}`}
            className="inline-flex items-center gap-2 rounded-lg border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
          >
            Back to Workspace
          </Link>
        </div>
      </main>
    </div>
  );
}