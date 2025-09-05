"use client";

import { useState } from "react";
import { Bot, Send, Menu, X, Folder, Library, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "~/hooks/useTheme";

export default function DronaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const { theme, setTheme, mounted } = useTheme();

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
                          className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900 dark:bg-slate-800 dark:text-slate-100"
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
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  <h1 className="text-2xl font-bold">Drona Chatbot</h1>
                </div>
              </div>

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
            </div>
          </header>

          {/* Chat Interface */}
          <main className="flex h-[calc(100vh-73px)] flex-col">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mx-auto max-w-3xl">
                {/* Welcome Message */}
                <div className="mb-6 rounded-xl border border-black/10 bg-white/80 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 text-white">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Welcome to Drona!</h3>
                      <p className="mt-1 text-slate-600 dark:text-slate-400">
                        I&apos;m your AI mentor tutor. I can help you with
                        questions about your indexed books and learning
                        materials. Ask me anything about the topics you&apos;re
                        studying!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Placeholder for chat messages */}
                <div className="text-center text-slate-500 dark:text-slate-400">
                  <p>Start a conversation by typing a message below.</p>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="border-t border-black/10 bg-white/80 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <div className="mx-auto max-w-3xl">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask Drona a question..."
                    className="flex-1 rounded-xl border border-black/10 bg-white/80 px-4 py-3 backdrop-blur-sm placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:focus:border-slate-600 dark:focus:ring-slate-700"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && message.trim()) {
                        // TODO: Handle message sending
                        console.log("Sending message:", message);
                        setMessage("");
                      }
                    }}
                  />
                  <button
                    disabled={!message.trim()}
                    className="rounded-xl bg-slate-900 px-4 py-3 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
