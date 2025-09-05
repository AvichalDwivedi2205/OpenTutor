"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  BookOpen,
  FileText,
  Presentation,
  Sun,
  Moon,
  Check,
  AlertCircle,
  File,
  Image,
  Link as LinkIcon,
  Globe,
  Folder,
  Plus,
  Trash2,
  Eye,
  Download,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "~/hooks/useTheme";

type MaterialType = "book" | "slides" | "document" | "notes";
type ImportMethod = "upload" | "url";

interface UploadFile {
  id: string;
  file: File;
  type: MaterialType;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  title?: string;
  description?: string;
}

interface UrlImport {
  id: string;
  url: string;
  title: string;
  type: MaterialType;
  status: "pending" | "importing" | "success" | "error";
  progress: number;
}

export default function AddMaterialPage() {
  const params = useParams();
  const workspaceId = params.id as string;
  const [selectedType, setSelectedType] = useState<MaterialType>("book");
  const [importMethod, setImportMethod] = useState<ImportMethod>("upload");
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [urlImports, setUrlImports] = useState<UrlImport[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const { theme, setTheme, mounted } = useTheme();

  const materialTypes = [
    {
      type: "book" as MaterialType,
      title: "Books",
      description:
        "Upload textbooks, reference books, or academic publications",
      icon: BookOpen,
      acceptedFormats: ".pdf, .epub, .mobi",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      type: "slides" as MaterialType,
      title: "Slides & Presentations",
      description: "Upload lecture slides, presentations, or visual materials",
      icon: Presentation,
      acceptedFormats: ".pdf, .ppt, .pptx",
      color:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    },
    {
      type: "document" as MaterialType,
      title: "Documents",
      description: "Upload research papers, articles, or study guides",
      icon: FileText,
      acceptedFormats: ".pdf, .doc, .docx, .txt",
      color:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      type: "notes" as MaterialType,
      title: "Study Notes",
      description: "Upload handwritten notes, summaries, or study materials",
      icon: File,
      acceptedFormats: ".pdf, .jpg, .png, .txt",
      color:
        "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    },
  ];

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadFile[] = Array.from(files).map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      type: selectedType,
      status: "pending",
      progress: 0,
    }));

    setUploadFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setUploadFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const addUrlImport = () => {
    if (!urlInput.trim() || !titleInput.trim()) return;

    const newImport: UrlImport = {
      id: `url-${Date.now()}`,
      url: urlInput.trim(),
      title: titleInput.trim(),
      type: selectedType,
      status: "pending",
      progress: 0,
    };

    setUrlImports((prev) => [...prev, newImport]);
    setUrlInput("");
    setTitleInput("");
  };

  const removeUrlImport = (id: string) => {
    setUrlImports((prev) => prev.filter((item) => item.id !== id));
  };

  const startUpload = async () => {
    // Simulate upload process for files
    for (const file of uploadFiles.filter((f) => f.status === "pending")) {
      setUploadFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, status: "uploading" } : f)),
      );

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setUploadFiles((prev) =>
          prev.map((f) => (f.id === file.id ? { ...f, progress } : f)),
        );
      }

      setUploadFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, status: "success" } : f)),
      );
    }

    // Simulate import process for URLs
    for (const urlImport of urlImports.filter((u) => u.status === "pending")) {
      setUrlImports((prev) =>
        prev.map((u) =>
          u.id === urlImport.id ? { ...u, status: "importing" } : u,
        ),
      );

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        setUrlImports((prev) =>
          prev.map((u) => (u.id === urlImport.id ? { ...u, progress } : u)),
        );
      }

      setUrlImports((prev) =>
        prev.map((u) =>
          u.id === urlImport.id ? { ...u, status: "success" } : u,
        ),
      );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(extension ?? "")) {
      return Image;
    }
    return File;
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
              <h1 className="text-2xl font-bold">Add Learning Material</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Upload books, slides, documents, or study materials
              </p>
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

      {/* Content */}
      <main className="mx-auto max-w-6xl p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Material Type Selection */}
            <div className="rounded-xl border border-black/10 bg-white/80 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <h2 className="mb-4 text-lg font-semibold">Material Type</h2>
              <div className="space-y-3">
                {materialTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.type}
                      onClick={() => setSelectedType(type.type)}
                      className={`w-full rounded-lg border-2 p-4 text-left transition ${
                        selectedType === type.type
                          ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
                          : "border-black/10 hover:border-sky-300 dark:border-white/10 dark:hover:border-sky-700"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${type.color}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="mb-1 font-medium">{type.title}</h3>
                          <p className="mb-1 text-sm text-slate-600 dark:text-slate-400">
                            {type.description}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {type.acceptedFormats}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Import Method Selection */}
            <div className="rounded-xl border border-black/10 bg-white/80 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <h2 className="mb-4 text-lg font-semibold">Import Method</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setImportMethod("upload")}
                  className={`w-full rounded-lg border-2 p-4 text-left transition ${
                    importMethod === "upload"
                      ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
                      : "border-black/10 hover:border-sky-300 dark:border-white/10 dark:hover:border-sky-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                      <Upload className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">Upload Files</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Upload from your device
                      </p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setImportMethod("url")}
                  className={`w-full rounded-lg border-2 p-4 text-left transition ${
                    importMethod === "url"
                      ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
                      : "border-black/10 hover:border-sky-300 dark:border-white/10 dark:hover:border-sky-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">Import from URL</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Import from web links
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Upload/Import Area */}
          <div className="space-y-6 lg:col-span-2">
            {/* Upload/Import Area */}
            <div className="rounded-xl border border-black/10 bg-white/80 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {importMethod === "upload"
                    ? "Upload Files"
                    : "Import from URL"}
                </h2>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Folder className="h-4 w-4" />
                  {materialTypes.find((t) => t.type === selectedType)?.title}
                </div>
              </div>

              {importMethod === "upload" ? (
                /* File Upload */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`rounded-lg border-2 border-dashed p-8 text-center transition ${
                    isDragOver
                      ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
                      : "border-black/20 hover:border-sky-300 dark:border-white/20 dark:hover:border-sky-700"
                  }`}
                >
                  <Upload className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                  <h3 className="mb-2 text-lg font-medium">
                    Drop files here or click to browse
                  </h3>
                  <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                    Supported formats:{" "}
                    {
                      materialTypes.find((t) => t.type === selectedType)
                        ?.acceptedFormats
                    }
                  </p>
                  <input
                    type="file"
                    multiple
                    accept={
                      materialTypes.find((t) => t.type === selectedType)
                        ?.acceptedFormats
                    }
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                  >
                    <Upload className="h-4 w-4" />
                    Choose Files
                  </label>
                </div>
              ) : (
                /* URL Import */
                <div className="space-y-4">
                  <div className="rounded-lg border border-black/10 p-6 dark:border-white/10">
                    <div className="mb-4 flex items-center gap-3">
                      <LinkIcon className="h-5 w-5 text-slate-400" />
                      <h3 className="font-medium">Add URL</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          URL
                        </label>
                        <input
                          type="url"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder="https://example.com/document.pdf"
                          className="w-full rounded-lg border border-black/10 bg-white/50 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Title
                        </label>
                        <input
                          type="text"
                          value={titleInput}
                          onChange={(e) => setTitleInput(e.target.value)}
                          placeholder="Enter a descriptive title"
                          className="w-full rounded-lg border border-black/10 bg-white/50 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      <button
                        onClick={addUrlImport}
                        disabled={!urlInput.trim() || !titleInput.trim()}
                        className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                        Add URL
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Items List */}
              {(uploadFiles.length > 0 || urlImports.length > 0) && (
                <div className="mt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-medium">
                      {importMethod === "upload"
                        ? "Selected Files"
                        : "URLs to Import"}
                    </h3>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {importMethod === "upload"
                        ? uploadFiles.length
                        : urlImports.length}{" "}
                      items
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* File uploads */}
                    {importMethod === "upload" &&
                      uploadFiles.map((uploadFile) => {
                        const FileIcon = getFileIcon(uploadFile.file.name);
                        return (
                          <motion.div
                            key={uploadFile.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 rounded-lg border border-black/10 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5"
                          >
                            <FileIcon className="h-10 w-10 flex-shrink-0 text-slate-400" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium">
                                {uploadFile.file.name}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <span>
                                  {formatFileSize(uploadFile.file.size)}
                                </span>
                                <span>•</span>
                                <span className="capitalize">
                                  {uploadFile.type}
                                </span>
                              </div>
                              {uploadFile.status === "uploading" && (
                                <div className="mt-2">
                                  <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                                    <span>Uploading...</span>
                                    <span>{uploadFile.progress}%</span>
                                  </div>
                                  <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                                    <div
                                      className="h-1 rounded-full bg-sky-500 transition-all"
                                      style={{
                                        width: `${uploadFile.progress}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {uploadFile.status === "success" && (
                                <div className="flex items-center gap-2">
                                  <Check className="h-5 w-5 text-green-500" />
                                  <button className="rounded-lg p-1 hover:bg-black/5 dark:hover:bg-white/5">
                                    <Eye className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                              {uploadFile.status === "error" && (
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              )}
                              {uploadFile.status === "pending" && (
                                <button
                                  onClick={() => removeFile(uploadFile.id)}
                                  className="rounded-lg p-1 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}

                    {/* URL imports */}
                    {importMethod === "url" &&
                      urlImports.map((urlImport) => (
                        <motion.div
                          key={urlImport.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 rounded-lg border border-black/10 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5"
                        >
                          <div className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                            <Globe className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">
                              {urlImport.title}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <span className="truncate">{urlImport.url}</span>
                              <span>•</span>
                              <span className="capitalize">
                                {urlImport.type}
                              </span>
                            </div>
                            {urlImport.status === "importing" && (
                              <div className="mt-2">
                                <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                                  <span>Importing...</span>
                                  <span>{urlImport.progress}%</span>
                                </div>
                                <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                                  <div
                                    className="h-1 rounded-full bg-green-500 transition-all"
                                    style={{ width: `${urlImport.progress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {urlImport.status === "success" && (
                              <div className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-green-500" />
                                <button className="rounded-lg p-1 hover:bg-black/5 dark:hover:bg-white/5">
                                  <Eye className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                            {urlImport.status === "error" && (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            )}
                            {urlImport.status === "pending" && (
                              <button
                                onClick={() => removeUrlImport(urlImport.id)}
                                className="rounded-lg p-1 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                  </div>

                  {/* Action Button */}
                  {((importMethod === "upload" &&
                    uploadFiles.some((f) => f.status === "pending")) ||
                    (importMethod === "url" &&
                      urlImports.some((u) => u.status === "pending"))) && (
                    <div className="mt-6 flex items-center justify-between">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {importMethod === "upload"
                          ? `${uploadFiles.filter((f) => f.status === "pending").length} files ready to upload`
                          : `${urlImports.filter((u) => u.status === "pending").length} URLs ready to import`}
                      </p>
                      <button
                        onClick={startUpload}
                        className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
                      >
                        {importMethod === "upload" ? (
                          <>
                            <Upload className="h-4 w-4" />
                            Start Upload
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            Start Import
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Success Summary */}
            {(uploadFiles.some((f) => f.status === "success") ||
              urlImports.some((u) => u.status === "success")) && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
                <div className="mb-4 flex items-center gap-3">
                  <Check className="h-6 w-6 text-green-600" />
                  <h3 className="font-semibold text-green-800 dark:text-green-200">
                    Materials Added Successfully!
                  </h3>
                </div>
                <p className="mb-4 text-sm text-green-700 dark:text-green-300">
                  Your materials have been processed and are now available in
                  your workspace. They will be used to enhance AI-generated
                  content and recommendations.
                </p>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/workspace/${workspaceId}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Workspace
                  </Link>
                  <button
                    onClick={() => {
                      setUploadFiles([]);
                      setUrlImports([]);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-green-600 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20"
                  >
                    <Plus className="h-4 w-4" />
                    Add More Materials
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 rounded-xl border border-black/10 bg-white/80 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
          <h2 className="mb-4 text-lg font-semibold">How it works</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
            <div className="text-center">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400">
                1
              </div>
              <h3 className="mb-1 font-medium">Select Type</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Choose the type of material you&apos;re adding
              </p>
            </div>
            <div className="text-center">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400">
                2
              </div>
              <h3 className="mb-1 font-medium">Choose Method</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Upload files or import from URLs
              </p>
            </div>
            <div className="text-center">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400">
                3
              </div>
              <h3 className="mb-1 font-medium">Add Materials</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Upload your files or add URLs with titles
              </p>
            </div>
            <div className="text-center">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400">
                4
              </div>
              <h3 className="mb-1 font-medium">AI Processing</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Materials are processed for AI-enhanced learning
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
