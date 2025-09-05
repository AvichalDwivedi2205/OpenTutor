"use client";

import { useState } from "react";
import { Plus, Search, Folder, Bot, Library, Menu, X, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "~/hooks/useTheme";

// Mock data - replace with actual data fetching
const mockWorkspaces = [
  {
    id: "1",
    name: "Machine Learning Fundamentals",
    type: "course" as const,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-02-20"),
  },
  {
    id: "2", 
    name: "Personal Study Notes",
    type: "personal" as const,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-25"),
  },
  {
    id: "3",
    name: "Data Structures & Algorithms",
    type: "course" as const,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-02-18"),
  },
];

export default function WorkspacesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, setTheme, mounted } = useTheme();
  
  // Filter workspaces based on search
  const filteredWorkspaces = mockWorkspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasWorkspaces = mockWorkspaces.length > 0;

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
              className="fixed left-0 top-0 z-40 h-screen w-70 border-r border-black/10 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
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
                          className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                        >
                          All Workspaces
                        </Link>
                        <Link
                          href="/workspaces/new"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                          <Plus className="h-4 w-4" />
                          Create New
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
                        <Link
                          href="/drona/history"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                          Chat History
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
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
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
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-70' : 'ml-0'}`}>
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
                <h1 className="text-2xl font-bold">Workspaces</h1>
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
                {hasWorkspaces && (
                  <Link
                    href="/workspaces/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                  >
                    <Plus className="h-4 w-4" />
                    New Workspace
                  </Link>
                )}
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="p-6">
            {!hasWorkspaces ? (
              // Empty State
              <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <Folder className="h-10 w-10 text-slate-400" />
                  </div>
                  <h2 className="mb-2 text-xl font-semibold">No workspaces yet</h2>
                  <p className="mb-6 text-slate-600 dark:text-slate-400">
                    Create your first workspace to get started with organizing your learning materials.
                  </p>
                  <Link
                    href="/workspaces/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                  >
                    <Plus className="h-5 w-5" />
                    Create Workspace
                  </Link>
                </div>
              </div>
            ) : (
              // Workspaces List
              <div>
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search workspaces..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-black/10 bg-white/80 py-2 pl-10 pr-4 text-sm backdrop-blur-sm placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-white/10 dark:bg-white/5 dark:focus:border-slate-600 dark:focus:ring-slate-700"
                    />
                  </div>
                </div>

                {/* Workspaces Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredWorkspaces.map((workspace) => (
                    <motion.div
                      key={workspace.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link href={`/workspace/${workspace.id}`}>
                        <div className="group cursor-pointer rounded-xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5">
                          <div className="mb-4 flex items-start justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-500 text-white shadow-sm">
                              <Folder className="h-5 w-5" />
                            </div>
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                              {workspace.type}
                            </span>
                          </div>
                          
                          <h3 className="mb-2 font-semibold group-hover:text-slate-600 dark:group-hover:text-slate-300">
                            {workspace.name}
                          </h3>
                          
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Updated {mounted ? workspace.updatedAt.toLocaleDateString() : '...'}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {filteredWorkspaces.length === 0 && searchQuery && (
                  <div className="py-12 text-center">
                    <p className="text-slate-500 dark:text-slate-400">
                      No workspaces found matching &ldquo;{searchQuery}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}