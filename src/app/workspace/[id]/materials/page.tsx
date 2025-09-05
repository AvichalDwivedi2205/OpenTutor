"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Plus, 
  BookOpen, 
  FileText, 
  Presentation,
  File,
  Search,
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
  Folder,
  Check,
  X,
  Filter,
  Share2
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
  url?: string;
  isInWorkspace?: boolean;
  addedToWorkspaceAt?: Date;
  sourceWorkspaceId?: string;
  sourceWorkspaceName?: string;
}

interface WorkspaceInfo {
  id: string;
  name: string;
  type: "course" | "personal";
}

export default function WorkspaceMaterialsPage() {
  const params = useParams();
  const workspaceId = params.id as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<MaterialType | "all">("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set());
  const { theme, setTheme, mounted } = useTheme();

  // Mock workspace info
  const workspace: WorkspaceInfo = {
    id: workspaceId,
    name: "Machine Learning Fundamentals",
    type: "course"
  };

  // Mock data for workspace materials (materials currently in this workspace)
  const workspaceMaterials: Material[] = [
    {
      id: "m1",
      title: "Machine Learning Fundamentals",
      type: "book",
      filename: "ml-fundamentals.pdf",
      size: 15728640, // 15MB
      uploadedAt: new Date("2024-01-15"),
      uploadedBy: "You",
      tags: ["machine-learning", "fundamentals", "textbook"],
      isInWorkspace: true,
      addedToWorkspaceAt: new Date("2024-01-15")
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
      isInWorkspace: true,
      addedToWorkspaceAt: new Date("2024-01-20")
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
      isInWorkspace: true,
      addedToWorkspaceAt: new Date("2024-02-01")
    }
  ];

  // Mock data for materials from other workspaces
  const otherWorkspaceMaterials: Material[] = [
    {
      id: "m4",
      title: "Linear Algebra Notes",
      type: "notes",
      filename: "linear-algebra-notes.pdf",
      size: 5242880, // 5MB
      uploadedAt: new Date("2024-02-05"),
      uploadedBy: "You",
      tags: ["mathematics", "linear-algebra", "notes"],
      isInWorkspace: false,
      sourceWorkspaceId: "ws2",
      sourceWorkspaceName: "Mathematics Review"
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
      isInWorkspace: false,
      sourceWorkspaceId: "ws3",
      sourceWorkspaceName: "Python Development"
    },
    {
      id: "m6",
      title: "Statistics for Data Science",
      type: "book",
      filename: "statistics-data-science.pdf",
      size: 18874368, // 18MB
      uploadedAt: new Date("2024-02-12"),
      uploadedBy: "You",
      tags: ["statistics", "data-science", "mathematics"],
      isInWorkspace: false,
      sourceWorkspaceId: "ws4",
      sourceWorkspaceName: "Data Science Project"
    },
    {
      id: "m7",
      title: "Calculus Study Guide",
      type: "document",
      filename: "calculus-study-guide.pdf",
      size: 7340032, // 7MB
      uploadedAt: new Date("2024-01-25"),
      uploadedBy: "You",
      tags: ["calculus", "mathematics", "study-guide"],
      isInWorkspace: false,
      sourceWorkspaceId: "ws2",
      sourceWorkspaceName: "Mathematics Review"
    },
    {
      id: "m8",
      title: "Deep Learning Slides",
      type: "slides",
      filename: "deep-learning-intro.pptx",
      size: 9437184, // 9MB
      uploadedAt: new Date("2024-02-08"),
      uploadedBy: "You",
      tags: ["deep-learning", "neural-networks", "slides"],
      isInWorkspace: false,
      sourceWorkspaceId: "ws5",
      sourceWorkspaceName: "Advanced AI Course"
    }
  ];

  // Filter materials based on search and type
  const filteredMaterials = workspaceMaterials.filter(material => {
    const matchesSearch = searchQuery === "" || 
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === "all" || material.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Available materials from other workspaces (not in current workspace)
  const availableMaterials = otherWorkspaceMaterials;

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

  const addMaterialsToWorkspace = () => {
    // Simulate adding materials to workspace
    console.log("Adding materials to workspace:", Array.from(selectedMaterials));
    setSelectedMaterials(new Set());
    setShowAddModal(false);
  };

  const toggleMaterialSelection = (materialId: string) => {
    const newSelection = new Set(selectedMaterials);
    if (newSelection.has(materialId)) {
      newSelection.delete(materialId);
    } else {
      newSelection.add(materialId);
    }
    setSelectedMaterials(newSelection);
  };

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
              <h1 className="text-2xl font-bold">Materials</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {workspace.name} • {filteredMaterials.length} materials
              </p>
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
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
            >
              <Share2 className="h-4 w-4" />
              Import from Workspaces
            </button>
            <Link
              href={`/workspace/${workspaceId}/materials/add`}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <Upload className="h-4 w-4" />
              Upload New
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
              {filteredMaterials.length} {filteredMaterials.length === 1 ? 'material' : 'materials'} in this workspace
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
                          {mounted ? material.addedToWorkspaceAt?.toLocaleDateString() : '...'}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {material.uploadedBy}
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {formatFileSize(material.size)}
                        </div>
                      </div>
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
              {searchQuery || selectedType !== "all" ? "No materials found" : "No materials in this workspace"}
            </h3>
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              {searchQuery || selectedType !== "all" 
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Add materials to this workspace to enhance AI-powered learning and get personalized recommendations."
              }
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
              >
                <Share2 className="h-4 w-4" />
                Import from Workspaces
              </button>
              <Link
                href={`/workspace/${workspaceId}/materials/add`}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                <Upload className="h-4 w-4" />
                Upload New
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Add Materials Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl max-h-[80vh] overflow-hidden rounded-xl border border-black/10 bg-white shadow-xl dark:border-white/10 dark:bg-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-black/10 p-6 dark:border-white/10">
                <div>
                  <h2 className="text-xl font-semibold">Import Materials from Other Workspaces</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Select materials from your other workspaces to add to this workspace
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="max-h-96 overflow-y-auto p-6">
                {availableMaterials.length > 0 ? (
                  <div className="space-y-3">
                    {availableMaterials.map((material) => {
                      const TypeIcon = getTypeIcon(material.type);
                      const isSelected = selectedMaterials.has(material.id);
                      return (
                        <div
                          key={material.id}
                          className={`flex items-center gap-4 rounded-lg border p-4 transition cursor-pointer ${
                            isSelected
                              ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
                              : "border-black/10 hover:border-sky-300 dark:border-white/10 dark:hover:border-sky-700"
                          }`}
                          onClick={() => toggleMaterialSelection(material.id)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${getTypeColor(material.type)}`}>
                              <TypeIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{material.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <span>{material.filename}</span>
                                <span>•</span>
                                <span>{formatFileSize(material.size)}</span>
                                <span>•</span>
                                <span className="capitalize">{material.type}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-sky-600 dark:text-sky-400 mt-1">
                                <Folder className="h-3 w-3" />
                                <span>From {material.sourceWorkspaceName}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {material.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                  >
                                    <Tag className="h-2.5 w-2.5" />
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className={`flex h-5 w-5 items-center justify-center rounded border-2 transition ${
                            isSelected
                              ? "border-sky-500 bg-sky-500"
                              : "border-slate-300 dark:border-slate-600"
                          }`}>
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                      <Folder className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="mb-2 font-semibold">No materials available</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      No materials found in your other workspaces that can be imported.
                    </p>
                    <Link
                      href="/materials/upload"
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                      <Upload className="h-4 w-4" />
                      Upload New Materials
                    </Link>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              {availableMaterials.length > 0 && (
                <div className="flex items-center justify-between border-t border-black/10 p-6 dark:border-white/10">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedMaterials.size} {selectedMaterials.size === 1 ? 'material' : 'materials'} selected
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="rounded-lg border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addMaterialsToWorkspace}
                      disabled={selectedMaterials.size === 0}
                      className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                      Add {selectedMaterials.size > 0 ? selectedMaterials.size : ''} Material{selectedMaterials.size !== 1 ? 's' : ''}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}