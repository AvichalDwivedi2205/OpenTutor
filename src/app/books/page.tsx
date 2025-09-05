"use client";

import { useState, useEffect } from "react";
import {
  Library,
  Upload,
  Search,
  Menu,
  X,
  Folder,
  Bot,
  Plus,
  BookOpen,
  FileText,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "~/hooks/useTheme";

// Mock data - replace with actual data fetching
const mockBooks = [
  {
    id: "1",
    title: "Pattern Recognition and Machine Learning",
    author: "Christopher Bishop",
    pages: 738,
    uploadedAt: new Date("2024-01-15"),
    status: "indexed" as const,
  },
  {
    id: "2",
    title: "The Elements of Statistical Learning",
    author: "Hastie, Tibshirani, Friedman",
    pages: 745,
    uploadedAt: new Date("2024-02-01"),
    status: "processing" as const,
  },
  {
    id: "3",
    title: "Deep Learning",
    author: "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
    pages: 800,
    uploadedAt: new Date("2024-02-10"),
    status: "indexed" as const,
  },
];

export default function BooksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter books based on search
  const filteredBooks = mockBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#F8FAFF] dark:bg-[#070B14]">
      <div className="flex">
        {/* Collapsible Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 z-40 h-screen w-70 border-r border-black/10 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex h-full flex-col">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between border-b border-black/10 p-4 dark:border-white/10">
                  <h2 className="text-lg font-semibold">Navigation</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="rounded-lg p-1 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Sidebar Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <nav className="space-y-6">
                    {/* Workspaces Section */}
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <Folder className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Workspaces
                        </span>
                      </div>
                      <div className="space-y-1">
                        <Link
                          href="/workspaces"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                          All Workspaces
                        </Link>
                      </div>
                    </div>

                    {/* Drona Chatbot Section */}
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <Bot className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Drona Chatbot
                        </span>
                      </div>
                      <div className="space-y-1">
                        <Link
                          href="/drona"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                          Chat with Drona
                        </Link>
                      </div>
                    </div>

                    {/* Indexed Books Section */}
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <Library className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Indexed Books
                        </span>
                      </div>
                      <div className="space-y-1">
                        <Link
                          href="/books"
                          className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                        >
                          My Library
                        </Link>
                        <Link
                          href="/books/upload"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                          <Plus className="h-4 w-4" />
                          Upload Book
                        </Link>
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-70" : "ml-0"}`}
        >
          {/* Header */}
          <header className="border-b border-black/10 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                {!sidebarOpen && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                )}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 text-white">
                    <Library className="h-4 w-4" />
                  </div>
                  <h1 className="text-2xl font-bold">My Library</h1>
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
                <Link
                  href="/books/upload"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  <Upload className="h-4 w-4" />
                  Upload Book
                </Link>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-white/80 py-2 pr-4 pl-10 text-sm backdrop-blur-sm placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:focus:border-slate-600 dark:focus:ring-slate-700"
                />
              </div>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBooks.map((book) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-sm">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        book.status === "indexed"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {book.status}
                    </span>
                  </div>

                  <h3 className="mb-2 line-clamp-2 font-semibold">
                    {book.title}
                  </h3>

                  <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                    {book.author}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{book.pages} pages</span>
                    <span>Uploaded {mounted ? book.uploadedAt.toLocaleDateString() : '...'}</span>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">
                      View Details
                    </button>
                    {book.status === "indexed" && (
                      <button className="rounded-lg border border-black/10 px-3 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">
                        <FileText className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredBooks.length === 0 && searchQuery && (
              <div className="py-12 text-center">
                <p className="text-slate-500 dark:text-slate-400">
                  No books found matching &ldquo;{searchQuery}&rdquo;
                </p>
              </div>
            )}

            {mockBooks.length === 0 && (
              <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <Library className="h-10 w-10 text-slate-400" />
                  </div>
                  <h2 className="mb-2 text-xl font-semibold">No books yet</h2>
                  <p className="mb-6 text-slate-600 dark:text-slate-400">
                    Upload your first book to start building your indexed
                    library.
                  </p>
                  <Link
                    href="/books/upload"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                  >
                    <Upload className="h-5 w-5" />
                    Upload Book
                  </Link>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
