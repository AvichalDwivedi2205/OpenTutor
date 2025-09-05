"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Plus, 
  BookOpen, 
  FileText, 
  Menu,
  X,
  Folder,
  Bot,
  Library,
  Sun,
  Moon,
  Search,
  Clock,
  Calendar,
  Tag,
  Star,
  Edit3,
  Eye,
  FolderOpen
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "~/hooks/useTheme";

// Mock data - replace with actual data fetching
const mockWorkspace = {
  id: "1",
  name: "Machine Learning Fundamentals",
  type: "course" as const,
  description: "A comprehensive study of machine learning algorithms and applications",
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-02-20"),
  roadmap: {
    id: "r1",
    title: "Machine Learning Fundamentals Roadmap",
    status: "active" as const,
    progress: 75,
    totalTopics: 8,
    completedTopics: 6,
    topics: [
      { 
        id: "t1", 
        title: "Introduction to Machine Learning", 
        completed: true, 
        estimatedHours: 4,
        notes: [
          { id: "n1", title: "ML Overview", preview: "Machine learning is a subset of AI that enables computers to learn...", updatedAt: new Date("2024-02-18") },
          { id: "n2", title: "Types of ML", preview: "Supervised, unsupervised, and reinforcement learning approaches...", updatedAt: new Date("2024-02-17") }
        ]
      },
      { 
        id: "t2", 
        title: "Introduction to Python", 
        completed: true, 
        estimatedHours: 6,
        notes: [
          { id: "n3", title: "Python Basics", preview: "Variables, data types, and control structures in Python...", updatedAt: new Date("2024-02-16") }
        ]
      },
      { 
        id: "t3", 
        title: "Data Preprocessing", 
        completed: true, 
        estimatedHours: 5,
        notes: [
          { id: "n4", title: "Data Cleaning", preview: "Handling missing values, outliers, and data normalization...", updatedAt: new Date("2024-02-15") },
          { id: "n5", title: "Feature Engineering", preview: "Creating and selecting relevant features for ML models...", updatedAt: new Date("2024-02-14") }
        ]
      },
      { 
        id: "t4", 
        title: "Linear Regression", 
        completed: true, 
        estimatedHours: 4,
        notes: [
          { id: "n6", title: "Linear Regression Theory", preview: "Mathematical foundations of linear regression models...", updatedAt: new Date("2024-02-13") }
        ]
      },
      { 
        id: "t5", 
        title: "Logistic Regression", 
        completed: true, 
        estimatedHours: 4,
        notes: [
          { id: "n7", title: "Logistic Function", preview: "Understanding the sigmoid function and its properties...", updatedAt: new Date("2024-02-12") }
        ]
      },
      { 
        id: "t6", 
        title: "Decision Trees", 
        completed: true, 
        estimatedHours: 5,
        notes: [
          { id: "n8", title: "Tree Construction", preview: "How decision trees split data using information gain...", updatedAt: new Date("2024-02-11") },
          { id: "n9", title: "Pruning Techniques", preview: "Preventing overfitting in decision trees...", updatedAt: new Date("2024-02-10") }
        ]
      },
      { 
        id: "t7", 
        title: "Random Forest", 
        completed: false, 
        estimatedHours: 4,
        notes: []
      },
      { 
        id: "t8", 
        title: "Neural Networks", 
        completed: false, 
        estimatedHours: 6,
        notes: []
      },
    ]
  },
  notes: [
    {
      id: "n1",
      title: "ML Overview",
      preview: "Machine learning is a subset of AI that enables computers to learn...",
      content: "Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every task.",
      tags: ["fundamentals", "overview"],
      topicId: "t1",
      topicTitle: "Introduction to Machine Learning",
      updatedAt: new Date("2024-02-18"),
      createdAt: new Date("2024-02-15"),
      wordCount: 245,
      readTime: 2
    },
    {
      id: "n2",
      title: "Types of ML",
      preview: "Supervised, unsupervised, and reinforcement learning approaches...",
      content: "There are three main types of machine learning: supervised learning (with labeled data), unsupervised learning (finding patterns in unlabeled data), and reinforcement learning (learning through rewards and penalties).",
      tags: ["types", "supervised", "unsupervised"],
      topicId: "t1",
      topicTitle: "Introduction to Machine Learning",
      updatedAt: new Date("2024-02-17"),
      createdAt: new Date("2024-02-16"),
      wordCount: 189,
      readTime: 1
    },
    {
      id: "n3",
      title: "Python Basics",
      preview: "Variables, data types, and control structures in Python...",
      content: "Python fundamentals including variables, data types (int, float, string, list, dict), control structures (if/else, loops), and functions.",
      tags: ["python", "basics", "programming"],
      topicId: "t2",
      topicTitle: "Introduction to Python",
      updatedAt: new Date("2024-02-16"),
      createdAt: new Date("2024-02-14"),
      wordCount: 156,
      readTime: 1
    },
    {
      id: "n4",
      title: "Data Cleaning",
      preview: "Handling missing values, outliers, and data normalization...",
      content: "Data cleaning involves handling missing values using techniques like imputation, detecting and treating outliers, and normalizing data to ensure consistent scales across features.",
      tags: ["preprocessing", "cleaning", "data"],
      topicId: "t3",
      topicTitle: "Data Preprocessing",
      updatedAt: new Date("2024-02-15"),
      createdAt: new Date("2024-02-13"),
      wordCount: 198,
      readTime: 1
    },
    {
      id: "n5",
      title: "Feature Engineering",
      preview: "Creating and selecting relevant features for ML models...",
      content: "Feature engineering is the process of creating new features from existing data and selecting the most relevant features to improve model performance.",
      tags: ["features", "engineering", "preprocessing"],
      topicId: "t3",
      topicTitle: "Data Preprocessing",
      updatedAt: new Date("2024-02-14"),
      createdAt: new Date("2024-02-12"),
      wordCount: 167,
      readTime: 1
    },
    {
      id: "n6",
      title: "Linear Regression Theory",
      preview: "Mathematical foundations of linear regression models...",
      content: "Linear regression models the relationship between a dependent variable and independent variables using a linear equation. The goal is to find the best-fitting line through the data points.",
      tags: ["regression", "linear", "theory"],
      topicId: "t4",
      topicTitle: "Linear Regression",
      updatedAt: new Date("2024-02-13"),
      createdAt: new Date("2024-02-11"),
      wordCount: 203,
      readTime: 1
    },
    {
      id: "n7",
      title: "Logistic Function",
      preview: "Understanding the sigmoid function and its properties...",
      content: "The logistic function (sigmoid) maps any real number to a value between 0 and 1, making it perfect for binary classification problems.",
      tags: ["logistic", "sigmoid", "classification"],
      topicId: "t5",
      topicTitle: "Logistic Regression",
      updatedAt: new Date("2024-02-12"),
      createdAt: new Date("2024-02-10"),
      wordCount: 134,
      readTime: 1
    },
    {
      id: "n8",
      title: "Tree Construction",
      preview: "How decision trees split data using information gain...",
      content: "Decision trees split data at each node by selecting the feature and threshold that maximizes information gain or minimizes impurity measures like Gini or entropy.",
      tags: ["trees", "splitting", "information-gain"],
      topicId: "t6",
      topicTitle: "Decision Trees",
      updatedAt: new Date("2024-02-11"),
      createdAt: new Date("2024-02-09"),
      wordCount: 178,
      readTime: 1
    },
    {
      id: "n9",
      title: "Pruning Techniques",
      preview: "Preventing overfitting in decision trees...",
      content: "Pruning techniques like pre-pruning (early stopping) and post-pruning help prevent overfitting by limiting tree complexity and removing unnecessary branches.",
      tags: ["pruning", "overfitting", "trees"],
      topicId: "t6",
      topicTitle: "Decision Trees",
      updatedAt: new Date("2024-02-10"),
      createdAt: new Date("2024-02-08"),
      wordCount: 145,
      readTime: 1
    },
  ],
  books: [
    {
      id: "b1",
      title: "Pattern Recognition and Machine Learning",
      author: "Christopher Bishop",
      pages: 738,
      addedAt: new Date("2024-01-20")
    },
    {
      id: "b2",
      title: "The Elements of Statistical Learning",
      author: "Hastie, Tibshirani, Friedman",
      pages: 745,
      addedAt: new Date("2024-01-22")
    },
  ],
};

export default function WorkspacePage() {
  const params = useParams();
  const workspaceId = params.id as string;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const { theme, setTheme, mounted } = useTheme();
  
  // In a real app, fetch workspace data based on workspaceId
  const workspace = mockWorkspace;

  // Filter notes based on search and filters
  const filteredNotes = workspace.notes.filter(note => {
    const matchesSearch = searchQuery === "" || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === "all" || 
      (selectedFilter === "recent" && new Date(note.updatedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) ||
      (selectedFilter === "topic" && selectedTopic && note.topicId === selectedTopic);
    
    return matchesSearch && matchesFilter;
  });

  // Get unique tags for filter options
  const allTags = Array.from(new Set(workspace.notes.flatMap(note => note.tags)));
  
  // Get topics with notes for filter
  const topicsWithNotes = workspace.roadmap?.topics.filter(topic => topic.notes && topic.notes.length > 0) || [];

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
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
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
                <Link
                  href="/workspaces"
                  className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold">{workspace.name}</h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {workspace.type} workspace
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
                  
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="p-6">
            {/* Search and Filter Bar */}
            <div className="mb-6 rounded-xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search notes, topics, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-black/10 bg-white/50 pl-10 pr-4 py-2 text-sm placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                  />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 ">
                  <select
                    value={selectedFilter}
                    onChange={(e) => {
                      setSelectedFilter(e.target.value);
                      if (e.target.value !== "topic") setSelectedTopic(null);
                    }}
                    className="rounded-lg border border-black/10 bg-white/50 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="all">All Notes</option>
                    <option value="recent">Recent (7 days)</option>
                    <option value="topic">By Topic</option>
                  </select>

                  {selectedFilter === "topic" && (
                    <select
                      value={selectedTopic ?? ""}
                      onChange={(e) => setSelectedTopic(e.target.value || null)}
                      className="rounded-lg border border-black/10 bg-white/50 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="">Select Topic</option>
                      {topicsWithNotes.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.title}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Search Results Summary */}
              {(searchQuery || selectedFilter !== "all") && (
                <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-3 dark:border-white/10">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
                    {searchQuery && ` for "${searchQuery}"`}
                  </p>
                  {(searchQuery || selectedFilter !== "all") && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedFilter("all");
                        setSelectedTopic(null);
                      }}
                      className="text-sm text-sky-600 hover:text-sky-700 dark:text-sky-400"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Main Content - Notes and Roadmap */}
              <div className="lg:col-span-2 space-y-6">
                {/* Notes Section */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      {searchQuery || selectedFilter !== "all" ? "Search Results" : "All Notes"}
                    </h2>
                    <Link
                      href={`/workspace/${workspaceId}/notes/new`}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                      <Plus className="h-4 w-4" />
                      New Note
                    </Link>
                  </div>

                  {filteredNotes.length > 0 ? (
                    <div className="space-y-4">
                      {filteredNotes.map((note, index) => (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="group rounded-xl border border-black/10 bg-white/80 p-6 backdrop-blur-sm transition hover:border-sky-200 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:hover:border-sky-800"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg group-hover:text-sky-600 dark:group-hover:text-sky-400">
                                  {note.title}
                                </h3>
                                {note.topicTitle && (
                                  <span className="rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700 dark:bg-sky-900 dark:text-sky-300">
                                    {note.topicTitle}
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                                {note.preview}
                              </p>
                              
                              {/* Tags */}
                              {note.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {note.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                    >
                                      <Tag className="h-3 w-3" />
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Metadata */}
                              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {mounted ? note.updatedAt.toLocaleDateString() : '...'}
                                </div>
                                <div className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  {note.wordCount} words
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {note.readTime} min read
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link
                                href={`/workspace/${workspaceId}/notes/${note.id}`}
                                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                                title="View note"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <Link
                                href={`/workspace/${workspaceId}/notes/${note.id}/edit`}
                                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                                title="Edit note"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Link>
                              <button
                                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                                title="Star note"
                              >
                                <Star className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-black/10 bg-white/80 p-8 text-center backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                        <FileText className="h-6 w-6 text-slate-400" />
                      </div>
                      <h3 className="mb-2 font-semibold">
                        {searchQuery || selectedFilter !== "all" ? "No notes found" : "No notes yet"}
                      </h3>
                      <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                        {searchQuery || selectedFilter !== "all" 
                          ? "Try adjusting your search or filters to find what you're looking for."
                          : "Start taking notes to organize your learning journey."
                        }
                      </p>
                      <Link
                        href={`/workspace/${workspaceId}/notes/new`}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                      >
                        <Plus className="h-4 w-4" />
                        Create Your First Note
                      </Link>
                    </div>
                  )}
                </div>

                {/* Roadmap Section */}
                {workspace.roadmap && (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Learning Progress</h2>
                      <Link
                        href={`/workspace/${workspaceId}/roadmap`}
                        className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                      >
                        View full roadmap
                      </Link>
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-black/10 bg-white/80 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                    >
                      {/* Progress Overview */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{workspace.roadmap.title}</h3>
                          <span className="text-sm font-medium text-sky-600 dark:text-sky-400">
                            {workspace.roadmap.progress}% complete
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500"
                            style={{ width: `${workspace.roadmap.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Topics with Notes */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400">Topics & Notes</h4>
                        {workspace.roadmap.topics.slice(0, 4).map((topic) => (
                          <div key={topic.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                              topic.completed 
                                ? 'bg-green-500' 
                                : 'bg-slate-300 dark:bg-slate-600'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className={`text-sm font-medium ${topic.completed ? 'line-through text-slate-500' : ''}`}>
                                  {topic.title}
                                </h5>
                                <span className="text-xs text-slate-400">
                                  {topic.notes?.length || 0} notes
                                </span>
                              </div>
                              {topic.notes && topic.notes.length > 0 && (
                                <div className="space-y-1">
                                  {topic.notes.slice(0, 2).map((note) => (
                                    <div key={note.id} className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                      • {note.title}
                                    </div>
                                  ))}
                                  {topic.notes.length > 2 && (
                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                      +{topic.notes.length - 2} more notes
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="rounded-xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                  <h3 className="font-semibold mb-3">Workspace Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Total Notes</span>
                      <span className="font-medium">{workspace.notes.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Topics Completed</span>
                      <span className="font-medium">{workspace.roadmap?.completedTopics || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Books Indexed</span>
                      <span className="font-medium">{workspace.books.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Total Tags</span>
                      <span className="font-medium">{allTags.length}</span>
                    </div>
                  </div>
                </div>

                {/* Popular Tags */}
                {allTags.length > 0 && (
                  <div className="rounded-xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                    <h3 className="font-semibold mb-3">Popular Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {allTags.slice(0, 8).map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSearchQuery(tag)}
                          className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Indexed Books */}
                <div className="rounded-xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">Indexed Books</h3>
                    <Link 
                      href={`/workspace/${workspaceId}/books`}
                      className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {workspace.books.map((book) => (
                      <div
                        key={book.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                      >
                        <BookOpen className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{book.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {book.author}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                            <span>{book.pages} pages</span>
                            <span>•</span>
                            <span>Added {mounted ? book.addedAt.toLocaleDateString() : '...'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                  <h3 className="font-semibold mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Link
                      href={`/workspace/${workspaceId}/notes/new`}
                      className="flex w-full items-center gap-2 rounded-lg bg-slate-100 p-3 text-sm font-medium hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                    >
                      <Plus className="h-4 w-4" />
                      Create Note
                    </Link>
                    <Link
                      href="/drona"
                      className="flex w-full items-center gap-2 rounded-lg border border-black/10 p-3 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
                    >
                      <Bot className="h-4 w-4" />
                      Ask Drona
                    </Link>
                    <Link
                      href={`/workspace/${workspaceId}/materials/add`}
                      className="flex w-full items-center gap-2 rounded-lg border border-black/10 p-3 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
                    >
                      <FolderOpen className="h-4 w-4" />
                      Add Material
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}