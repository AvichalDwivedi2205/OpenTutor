'use client'

import { useState } from 'react'
import { Bot, Sparkles, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SelectionPopupProps {
  selectedText: string
  position: { x: number; y: number } | null
  onExplain: (text: string) => Promise<void>
  onEnhance: (text: string) => Promise<void>
  onClose: () => void
}

export default function SelectionPopup({
  selectedText,
  position,
  onExplain,
  onEnhance,
  onClose
}: SelectionPopupProps) {
  const [isLoading, setIsLoading] = useState<'explain' | 'enhance' | null>(null)

  const handleExplain = async () => {
    setIsLoading('explain')
    try {
      await onExplain(selectedText)
    } finally {
      setIsLoading(null)
    }
  }

  const handleEnhance = async () => {
    setIsLoading('enhance')
    try {
      await onEnhance(selectedText)
    } finally {
      setIsLoading(null)
    }
  }

  if (!position || !selectedText.trim()) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.15 }}
        className="fixed z-50 min-w-[200px] rounded-xl border border-black/10 bg-white/90 backdrop-blur-sm p-2 shadow-lg dark:border-white/10 dark:bg-slate-800/90"
        style={{
          left: Math.min(position.x, window.innerWidth - 220),
          top: position.y - 60,
        }}
      >
        <div className="flex items-center justify-between mb-2 px-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            AI Actions
          </span>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
        
        <div className="space-y-1">
          <button
            onClick={handleExplain}
            disabled={isLoading !== null}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-sky-100 dark:hover:bg-sky-900/30 disabled:opacity-50"
          >
            <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <div className="flex-1">
              <div className="font-medium">
                {isLoading === 'explain' ? 'Explaining...' : 'Ask Mini Drona'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Get an explanation of the selected text
              </div>
            </div>
          </button>
          
          <button
            onClick={handleEnhance}
            disabled={isLoading !== null}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-purple-100 dark:hover:bg-purple-900/30 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <div className="flex-1">
              <div className="font-medium">
                {isLoading === 'enhance' ? 'Enhancing...' : 'Enhance Notes'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Improve and expand the selected text
              </div>
            </div>
          </button>
        </div>
        
        {selectedText.length > 50 && (
          <div className="mt-2 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-600 dark:text-slate-400">
            &ldquo;{selectedText.substring(0, 50)}...&rdquo;
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}