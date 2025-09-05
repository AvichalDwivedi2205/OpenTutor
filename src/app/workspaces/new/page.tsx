"use client";

import { useState, useRef } from "react";
import { ArrowLeft, Folder, GraduationCap, User, Upload, Sparkles, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "~/hooks/useTheme";

export default function NewWorkspacePage() {
  const router = useRouter();
  const { theme, setTheme, mounted } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "personal" as "personal" | "course",
    description: "",
    roadmapMethod: "generate" as "upload" | "generate",
    roadmapFile: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, roadmapFile: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual API call
      console.log("Creating workspace:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to workspaces page
      router.push("/workspaces");
    } catch (error) {
      console.error("Error creating workspace:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] dark:bg-[#070B14]">
      {/* Header */}
      <header className="border-b border-black/10 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/workspaces"
              className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold">Create New Workspace</h1>
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

      {/* Content */}
      <main className="mx-auto max-w-2xl p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border border-black/10 bg-white/80 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Workspace Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Workspace Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Machine Learning Fundamentals"
                className="w-full rounded-lg border border-black/10 bg-white/80 px-4 py-3 backdrop-blur-sm placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-white/10 dark:bg-white/5 dark:focus:border-slate-600 dark:focus:ring-slate-700"
              />
            </div>

            {/* Workspace Type */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Workspace Type
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "personal" })}
                  className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${
                    formData.type === "personal"
                      ? "border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800"
                      : "border-black/10 bg-white/80 hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Personal</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      For individual learning and notes
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "course" })}
                  className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${
                    formData.type === "course"
                      ? "border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800"
                      : "border-black/10 bg-white/80 hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 text-white">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Course</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      For structured learning with roadmaps
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Roadmap Creation (only for course type) */}
            {formData.type === "course" && (
              <div>
                <label className="block text-sm font-medium mb-3">
                  How would you like to create your roadmap?
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, roadmapMethod: "generate" })}
                    className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${
                      formData.roadmapMethod === "generate"
                        ? "border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800"
                        : "border-black/10 bg-white/80 hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 text-white">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Generate with AI</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Create a roadmap using AI based on your goals
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, roadmapMethod: "upload" })}
                    className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${
                      formData.roadmapMethod === "upload"
                        ? "border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800"
                        : "border-black/10 bg-white/80 hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 text-white">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Upload Syllabus</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Upload a PDF or screenshot of your syllabus
                      </p>
                    </div>
                  </button>
                </div>

                {/* File Upload for Upload Method */}
                {formData.roadmapMethod === "upload" && (
                  <div className="mt-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-black/20 bg-white/50 p-6 text-sm font-medium transition hover:border-black/30 hover:bg-white/70 dark:border-white/20 dark:bg-white/5 dark:hover:border-white/30 dark:hover:bg-white/10"
                    >
                      <Upload className="h-5 w-5" />
                      {formData.roadmapFile ? formData.roadmapFile.name : "Click to upload PDF or image"}
                    </button>
                    {formData.roadmapFile && (
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        Selected: {formData.roadmapFile.name} ({Math.round(formData.roadmapFile.size / 1024)} KB)
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what you'll be learning in this workspace..."
                className="w-full rounded-lg border border-black/10 bg-white/80 px-4 py-3 backdrop-blur-sm placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-white/10 dark:bg-white/5 dark:focus:border-slate-600 dark:focus:ring-slate-700"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !formData.name.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Folder className="h-4 w-4" />
                    Create Workspace
                  </>
                )}
              </button>
              
              <Link
                href="/workspaces"
                className="inline-flex items-center gap-2 rounded-lg border border-black/10 px-6 py-3 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
              >
                Cancel
              </Link>
            </div>
          </form>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 rounded-lg border border-black/10 bg-white/50 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
        >
          <h3 className="mb-2 font-medium">Tips for naming your workspace:</h3>
          <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li>• Use descriptive names that reflect the subject or goal</li>
            <li>• Consider including the course name or learning objective</li>
            <li>• Keep it concise but specific enough to distinguish from other workspaces</li>
          </ul>
        </motion.div>
      </main>
    </div>
  );
}