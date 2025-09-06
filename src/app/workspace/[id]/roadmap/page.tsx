"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  CheckCircle, 
  Circle, 
  Clock, 
  Menu,
  X,
  Folder,
  Bot,
  Library,
  Sun,
  Moon,
  Play,
  FileText,
  Plus,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "~/hooks/useTheme";

// Mock roadmap data with notes
const mockRoadmap = {
  id: "r1",
  title: "Machine Learning Fundamentals Roadmap",
  description: "A comprehensive learning path covering the fundamentals of machine learning",
  status: "active" as const,
  progress: 75,
  totalTopics: 8,
  completedTopics: 6,
  totalHours: 38,
  completedHours: 28,
  topics: [
    { 
      id: "t1", 
      title: "Introduction to Machine Learning", 
      description: "Overview of ML concepts, types, and applications",
      completed: true, 
      estimatedHours: 4,
      completedAt: new Date("2024-01-20"),
      notes: [
        { id: "n1", title: "ML Overview", preview: "Machine learning is a subset of AI that enables computers to learn...", updatedAt: new Date("2024-02-18") },
        { id: "n2", title: "Types of ML", preview: "Supervised, unsupervised, and reinforcement learning approaches...", updatedAt: new Date("2024-02-17") }
      ]
    },
    { 
      id: "t2", 
      title: "Introduction to Python", 
      description: "Python basics for data science and ML",
      completed: true, 
      estimatedHours: 6,
      completedAt: new Date("2024-01-25"),
      notes: [
        { id: "n3", title: "Python Basics", preview: "Variables, data types, and control structures in Python...", updatedAt: new Date("2024-02-16") }
      ]
    },
    { 
      id: "t3", 
      title: "Data Preprocessing", 
      description: "Cleaning, transforming, and preparing data for ML",
      completed: true, 
      estimatedHours: 5,
      completedAt: new Date("2024-02-01"),
      notes: [
        { id: "n4", title: "Data Cleaning", preview: "Handling missing values, outliers, and data normalization...", updatedAt: new Date("2024-02-15") },
        { id: "n5", title: "Feature Engineering", preview: "Creating and selecting relevant features for ML models...", updatedAt: new Date("2024-02-14") }
      ]
    },
    { 
      id: "t4", 
      title: "Linear Regression", 
      description: "Understanding and implementing linear regression",
      completed: true, 
      estimatedHours: 4,
      completedAt: new Date("2024-02-05"),
      notes: [
        { id: "n6", title: "Linear Regression Theory", preview: "Mathematical foundations of linear regression models...", updatedAt: new Date("2024-02-13") }
      ]
    },
    { 
      id: "t5", 
      title: "Logistic Regression", 
      description: "Classification using logistic regression",
      completed: true, 
      estimatedHours: 4,
      completedAt: new Date("2024-02-10"),
      notes: [
        { id: "n7", title: "Logistic Function", preview: "Understanding the sigmoid function and its properties...", updatedAt: new Date("2024-02-12") }
      ]
    },
    { 
      id: "t6", 
      title: "Decision Trees", 
      description: "Tree-based algorithms for classification and regression",
      completed: true, 
      estimatedHours: 5,
      completedAt: new Date("2024-02-15"),
      notes: [
        { id: "n8", title: "Tree Construction", preview: "How decision trees split data using information gain...", updatedAt: new Date("2024-02-11") },
        { id: "n9", title: "Pruning Techniques", preview: "Preventing overfitting in decision trees...", updatedAt: new Date("2024-02-10") }
      ]
    },
    { 
      id: "t7", 
      title: "Random Forest", 
      description: "Ensemble methods and random forest algorithm",
      completed: false, 
      estimatedHours: 4,
      completedAt: null,
      notes: []
    },
    { 
      id: "t8", 
      title: "Neural Networks", 
      description: "Introduction to artificial neural networks",
      completed: false, 
      estimatedHours: 6,
      completedAt: null,
      notes: []
    },
  ]
};

export default function RoadmapPage() {
  const params = useParams();
  const workspaceId = params.id as string;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const { theme, setTheme, mounted } = useTheme();

  const toggleTopicExpansion = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
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
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                          My Materials
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
                  href={`/workspace/${workspaceId}`}
                  className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold">Learning Roadmap</h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Track your progress through the course
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
          <main className="p-6">
            {/* Progress Overview */}
            <div className="mb-8 rounded-xl border border-black/10 bg-white/80 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">{mockRoadmap.title}</h2>
                  <p className="text-slate-600 dark:text-slate-400">{mockRoadmap.description}</p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                  {mockRoadmap.status}
                </span>
              </div>

              {/* Progress Stats */}
              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-sky-600">{mockRoadmap.completedTopics}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    of {mockRoadmap.totalTopics} topics completed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{mockRoadmap.completedHours}h</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    of {mockRoadmap.totalHours} hours completed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-violet-600">{mockRoadmap.progress}%</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    overall progress
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500"
                  style={{ width: `${mockRoadmap.progress}%` }}
                />
              </div>
            </div>

            {/* Topics List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Learning Topics</h3>
              
              {mockRoadmap.topics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`rounded-xl border backdrop-blur-sm transition ${
                    topic.completed
                      ? 'border-green-200 bg-green-50/80 dark:border-green-800 dark:bg-green-900/20'
                      : 'border-black/10 bg-white/80 dark:border-white/10 dark:bg-white/5'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 pt-1">
                        {topic.completed ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <Circle className="h-6 w-6 text-slate-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-semibold text-lg ${
                                topic.completed ? 'text-green-800 dark:text-green-200' : ''
                              }`}>
                                {index + 1}. {topic.title}
                              </h4>
                              {topic.notes && topic.notes.length > 0 && (
                                <button
                                  onClick={() => toggleTopicExpansion(topic.id)}
                                  className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                                >
                                  <FileText className="h-3 w-3" />
                                  {topic.notes.length} notes
                                  {expandedTopics.has(topic.id) ? (
                                    <ChevronDown className="h-3 w-3" />
                                  ) : (
                                    <ChevronRight className="h-3 w-3" />
                                  )}
                                </button>
                              )}
                            </div>
                            <p className={`text-sm mb-2 ${
                              topic.completed 
                                ? 'text-green-700 dark:text-green-300' 
                                : 'text-slate-600 dark:text-slate-400'
                            }`}>
                              {topic.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 ml-4">
                            <Clock className="h-4 w-4" />
                            {topic.estimatedHours}h
                          </div>
                        </div>
                        
                        {topic.completed && topic.completedAt && (
                          <p className="text-xs text-green-600 dark:text-green-400 mb-3">
                            Completed on {mounted ? topic.completedAt.toLocaleDateString() : '...'}
                          </p>
                        )}
                        
                        {!topic.completed && (
                          <div className="mb-3 flex items-center gap-2">
                            <button className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                              <Play className="h-4 w-4" />
                              Start Learning
                            </button>
                            <button className="rounded-lg border border-black/10 px-3 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">
                              Preview
                            </button>
                            <Link
                              href={`/workspace/${workspaceId}/notes/new?topic=${topic.id}`}
                              className="inline-flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
                            >
                              <Plus className="h-4 w-4" />
                              Generate Content                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Notes Section */}
                  <AnimatePresence>
                    {expandedTopics.has(topic.id) && topic.notes && topic.notes.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-black/10 dark:border-white/10"
                      >
                        <div className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                              Notes for this topic
                            </h5>
                            <Link
                              href={`/workspace/${workspaceId}/notes/new?topic=${topic.id}`}
                              className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                            >
                              <Plus className="h-3 w-3" />
                              Add Note
                            </Link>
                          </div>
                          
                          <div className="space-y-2">
                            {topic.notes.map((note) => (
                              <Link
                                key={note.id}
                                href={`/workspace/${workspaceId}/notes/${note.id}`}
                                className="block rounded-lg border border-black/10 bg-white/50 p-3 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <h6 className="font-medium text-sm mb-1 truncate">{note.title}</h6>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                                      {note.preview}
                                    </p>
                                  </div>
                                  <span className="text-xs text-slate-400 ml-2 flex-shrink-0">
                                    {mounted ? note.updatedAt.toLocaleDateString() : '...'}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Empty Notes State */}
                  {topic.notes && topic.notes.length === 0 && !topic.completed && (
                    <div className="border-t border-black/10 p-4 text-center dark:border-white/10">
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                        No notes yet for this topic
                      </p>
                      <Link
                        href={`/workspace/${workspaceId}/notes/new?topic=${topic.id}`}
                        className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                      >
                        <Plus className="h-3 w-3" />
                        Create your first note
                      </Link>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}