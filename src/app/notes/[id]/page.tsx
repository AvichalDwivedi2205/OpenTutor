'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, Search, Plus, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import TiptapEditor from '~/components/editor/TiptapEditor'

interface NotesPageProps {
  params: { id: string }
  searchParams?: Record<string, string | string[] | undefined>
}

// Mock workspace notes data
const mockWorkspaceNotes = [
  {
    id: "n1",
    title: "ML Overview",
    preview: "Machine learning is a subset of AI that enables computers to learn...",
    updatedAt: new Date("2024-02-18"),
    wordCount: 245
  },
  {
    id: "n2", 
    title: "Types of ML",
    preview: "Supervised, unsupervised, and reinforcement learning approaches...",
    updatedAt: new Date("2024-02-17"),
    wordCount: 189
  },
  {
    id: "n3",
    title: "Python Basics", 
    preview: "Variables, data types, and control structures in Python...",
    updatedAt: new Date("2024-02-16"),
    wordCount: 156
  },
  {
    id: "n4",
    title: "Data Cleaning",
    preview: "Handling missing values, outliers, and data normalization...",
    updatedAt: new Date("2024-02-15"),
    wordCount: 198
  }
]

export default function NotesPage({ params }: NotesPageProps) {
  const { id } = params
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Find current note
  const currentNote = mockWorkspaceNotes.find(note => note.id === id)
  
  // Filter notes for sidebar
  const filteredNotes = mockWorkspaceNotes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.preview.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Mock initial content for testing
  const mockContent = {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: currentNote?.title || 'Welcome to your note' }]
      },
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'This is a ' },
          { type: 'text', marks: [{ type: 'bold' }], text: 'Notion-style' },
          { type: 'text', text: ' markdown editor powered by ' },
          { type: 'text', marks: [{ type: 'italic' }], text: 'Tiptap' },
          { type: 'text', text: '. Start typing to see it in action!' }
        ]
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'You can:' }]
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Type "/" to open the command menu' }] }]
          },
          {
            type: 'listItem',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Select text to see AI enhancement options' }] }]
          },
          {
            type: 'listItem',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Use keyboard shortcuts for formatting' }] }]
          }
        ]
      }
    ]
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF] dark:bg-[#070B14]">
      <div className="flex">
        {/* Notes Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed left-0 top-0 z-40 h-screen w-80 border-r border-black/10 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex h-full flex-col">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between border-b border-black/10 p-4 dark:border-white/10">
                  <h2 className="text-lg font-semibold">Notes</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="rounded-lg p-1 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-black/10 dark:border-white/10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search notes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-black/10 bg-white/50 pl-10 pr-4 py-2 text-sm placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* Notes List */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      All Notes ({filteredNotes.length})
                    </span>
                    <Link
                      href="/workspace/1/notes/new"
                      className="rounded-lg p-1 hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <Plus className="h-4 w-4" />
                    </Link>
                  </div>
                  
                  <div className="space-y-2">
                    {filteredNotes.map((note) => (
                      <Link
                        key={note.id}
                        href={`/notes/${note.id}`}
                        className={`block rounded-lg p-3 transition hover:bg-black/5 dark:hover:bg-white/5 ${
                          note.id === id ? 'bg-sky-100 dark:bg-sky-900/30' : ''
                        }`}
                      >
                        <h3 className="font-medium text-sm mb-1 truncate">{note.title}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                          {note.preview}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>{note.updatedAt.toLocaleDateString()}</span>
                          <span>{note.wordCount} words</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
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
                  href="/workspace/1"
                  className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <h1 className="text-xl font-semibold">
                    {currentNote?.title || `Note ${id}`}
                  </h1>
                </div>
              </div>
            </div>
          </header>

          {/* Editor Content */}
          <main className="p-6">
            <div className="max-w-4xl mx-auto">
              <TiptapEditor
                noteId={id}
                initialContent={mockContent}
                placeholder="Start writing your note..."
                className="w-full"
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}