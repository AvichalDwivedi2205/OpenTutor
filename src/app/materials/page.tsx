"use client";

import { useState } from "react";
import { 
  ArrowLeft, 
  Plus, 
  BookOpen, 
  FileText, 
  Presentation,
  File,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Download,
  Calendar,
  User,
  Tag,
  Sun,
  Moon,
  FolderOpen,
  Grid3X3,
  List,
  Upload,
  Menu,
  X,
  Folder,
  Bot,
  Library
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "~/hooks/useTheme";

type MaterialType = "book" | "slides" | "document" | "notes";
type ViewMode = "grid" | "list";

interface Material {
  id: string;
  title: string;
  type: MaterialType;
  filename: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
  tags: string[];
  workspacesUsed: string[];
  url?: string;
}

// Mock data for global materials
const mockMaterials: Material[] = [
  {
    id: "m1",
    title: "Machine Learning Fundamentals",
    type: "book",
    filename: "ml-fundamentals.pdf",
    size: 15728640, // 15MB
    uploadedAt: new Date("2024-01-15"),
    uploadedBy: "You",
    tags: ["machine-learning", "fundamentals", "textbook"],
    workspacesUsed: ["Machine Learning Course", "AI Research"]
  },
  {
    id: "m2",
    title: "Neural Networks Lecture Slides",
    type: "slides",
    filename: "neural-networks-slides.pptx",
    size: 8388608, // 8MB
    uploadedAt: new Date("2024-01-20"),
    uploadedBy: "You",
    tags: ["neural-networks", "deep-learning", "slides"],
    workspacesUsed: ["Machine Learning Course"]
  },
  {
    id: "m3",
    title: "Data Preprocessing Guide",
    type: "document",
    filename: "data-preprocessing.pdf",
    size: 2097152, // 2MB
    uploadedAt: new Date("2024-02-01"),
    uploadedBy: "You",
    tags: ["data-science", "preprocessing", "guide"],
    workspacesUsed: ["Machine Learning Course", "Data Science Project"]
  },
  {
    id: "m4",
    title: "Linear Algebra Notes",
    type: "notes",
    filename: "linear-algebra-notes.pdf",
    size: 5242880, // 5MB
    uploadedAt: new Date("2024-02-05"),
    uploadedBy: "You",
    tags: ["mathematics", "linear-algebra", "notes"],
    workspacesUsed: ["Mathematics Review"]
  },
  {
    id: "m5",
    title: "Python Programming Handbook",
    type: "book",
    filename: "python-handbook.pdf",
    size: 12582912, // 12MB
    uploadedAt: new Date("2024-02-10"),
    uploadedBy: "You",
    tags: ["python", "programming", "handbook"],
    workspacesUsed: ["Machine Learning Course", "Python Development"]
  }
];

export default function MaterialsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<MaterialType | "all">("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, setTheme, mounted } = useTheme();

  // Filter materials based on search and type
  const filteredMaterials = mockMaterials.filter(material => {
    const matchesSearch = searchQuery === "" || 
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === "all" || material.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeIcon = (type: MaterialType) => {
    switch (type) {
      case "book": return BookOpen;
      case "slides": return Presentation;
      case "document": return FileText;
      case "notes": return File;
      default: return File;
    }
  };

  const getTypeColor = (type: MaterialType) => {
    switch (type) {
      case "book": return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "slides": return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "document": return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      case "notes": return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

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

                    {/* Indexed Materials Section */}
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <Library className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Indexed Materials
                        </span>
                      </div>
                      <div className="space-y-1">
                        <Link
                          href="/materials"
                          className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                        >
                          My Materials
                        </Link>
                        <Link
                          href="/materials/upload"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                          <Plus className="h-4 w-4" />
                          Add Materials
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
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-70" : "ml-0"}`}>
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
                  <div>
                    <h1 className="text-2xl font-bold">All Materials</h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Manage all your materials across workspaces
                    </p>
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
                <Link
                  href="/materials/upload"
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  <Plus className="h-4 w-4" />
                  Add Materials
                </Link>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="mx-auto max-w-7xl p-6">
        {/* Search and Filters */}
        <div className="mb-6 rounded-xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-black/10 bg-white/50 pl-10 pr-4 py-2 text-sm placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
              />
            </div>

            {/* Filters and View Mode */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as MaterialType | "all")}
                className="rounded-lg border border-black/10 bg-white/50 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="book">Books</option>
                <option value="slides">Slides</option>
                <option value="document">Documents</option>
                <option value="notes">Notes</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex rounded-lg border border-black/10 dark:border-white/10">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-l-lg px-3 py-2 text-sm ${
                    viewMode === "grid"
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "bg-white/50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-r-lg px-3 py-2 text-sm ${
                    viewMode === "list"
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "bg-white/50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-3 dark:border-white/10">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {filteredMaterials.length} {filteredMaterials.length === 1 ? 'material' : 'materials'} found
            </p>
            {(searchQuery || selectedType !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("all");
                }}
                className="text-sm text-sky-600 hover:text-sky-700 dark:text-sky-400"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Materials Grid/List */}
        {filteredMaterials.length > 0 ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "space-y-4"
          }>
            {filteredMaterials.map((material, index) => {
              const TypeIcon = getTypeIcon(material.type);
              return (
                <motion.div
                  key={material.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`group rounded-xl border border-black/10 bg-white/80 backdrop-blur-sm transition hover:border-sky-200 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:hover:border-sky-800 ${
                    viewMode === "grid" ? "p-6" : "p-4"
                  }`}
                >
                  <div className={`flex ${viewMode === "grid" ? "flex-col" : "items-center gap-4"}`}>
                    {/* Icon and Type */}
                    <div className={`flex items-center ${viewMode === "grid" ? "justify-between mb-4" : "gap-3"}`}>
                      <div className={`inline-flex items-center justify-center rounded-lg ${getTypeColor(material.type)} ${
                        viewMode === "grid" ? "h-12 w-12" : "h-10 w-10"
                      }`}>
                        <TypeIcon className={viewMode === "grid" ? "h-6 w-6" : "h-5 w-5"} />
                      </div>
                      {viewMode === "grid" && (
                        <button className="rounded-lg p-2 opacity-0 group-hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Content */}
                    <div className={`flex-1 ${viewMode === "grid" ? "" : "min-w-0"}`}>
                      <h3 className={`font-semibold group-hover:text-sky-600 dark:group-hover:text-sky-400 ${
                        viewMode === "grid" ? "mb-2" : "mb-1"
                      }`}>
                        {material.title}
                      </h3>
                      <p className={`text-slate-600 dark:text-slate-400 ${
                        viewMode === "grid" ? "text-sm mb-3" : "text-sm mb-2 truncate"
                      }`}>
                        {material.filename}
                      </p>

                      {/* Tags */}
                      <div className={`flex flex-wrap gap-1 ${
                        viewMode === "grid" ? "mb-4" : "mb-2"
                      }`}>
                        {material.tags.slice(0, viewMode === "grid" ? 3 : 2).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                        {material.tags.length > (viewMode === "grid" ? 3 : 2) && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            +{material.tags.length - (viewMode === "grid" ? 3 : 2)} more
                          </span>
                        )}
                      </div>

                      {/* Metadata */}
                      <div className={`text-xs text-slate-500 dark:text-slate-400 ${
                        viewMode === "grid" ? "space-y-1" : "flex items-center gap-4"
                      }`}>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {mounted ? material.uploadedAt.toLocaleDateString() : '...'}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {material.uploadedBy}
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {formatFileSize(material.size)}
                        </div>
                        {viewMode === "grid" && (
                          <div className="flex items-center gap-1">
                            <FolderOpen className="h-3 w-3" />
                            Used in {material.workspacesUsed.length} workspace{material.workspacesUsed.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>

                      {/* Workspaces Used */}
                      {viewMode === "grid" && material.workspacesUsed.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Used in workspaces:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {material.workspacesUsed.slice(0, 2).map((workspace) => (
                              <span
                                key={workspace}
                                className="rounded-md bg-sky-100 px-2 py-1 text-xs text-sky-700 dark:bg-sky-900 dark:text-sky-300"
                              >
                                {workspace}
                              </span>
                            ))}
                            {material.workspacesUsed.length > 2 && (
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                +{material.workspacesUsed.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className={`flex items-center gap-2 ${
                      viewMode === "grid" 
                        ? "opacity-0 group-hover:opacity-100 transition-opacity" 
                        : "opacity-0 group-hover:opacity-100 transition-opacity"
                    }`}>
                      <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" title="Download">
                        <Download className="h-4 w-4" />
                      </button>
                      {viewMode === "list" && (
                        <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-black/10 bg-white/80 p-8 text-center backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <FolderOpen className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="mb-2 font-semibold">
              {searchQuery || selectedType !== "all" ? "No materials found" : "No materials yet"}
            </h3>
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              {searchQuery || selectedType !== "all" 
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Upload your first material to get started with AI-powered learning."
              }
            </p>
            <Link
              href="/materials/upload"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <Upload className="h-4 w-4" />
              Add Materials
            </Link>
          </div>
        )}
          </main>
        </div>
      </div>
    </div>
  );
}