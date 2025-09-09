'use client'

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { 
  Heading1, 
  Heading2, 
  Heading3, 
  Type, 
  List, 
  ListOrdered, 
  Code, 
  Quote,
  Minus
} from 'lucide-react'

interface SlashCommandItem {
  title: string
  description: string
  icon: React.ReactNode
  command: () => void
}

interface SlashCommandMenuProps {
  items: SlashCommandItem[]
  command: (item: SlashCommandItem) => void
}

export interface SlashCommandMenuRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

export const SlashCommandMenu = forwardRef<SlashCommandMenuRef, SlashCommandMenuProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const selectItem = (index: number) => {
      const item = items[index]
      if (item) {
        command(item)
      }
    }

    const upHandler = () => {
      setSelectedIndex((selectedIndex + items.length - 1) % items.length)
    }

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % items.length)
    }

    const enterHandler = () => {
      selectItem(selectedIndex)
    }

    useEffect(() => setSelectedIndex(0), [items])

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === 'ArrowUp') {
          upHandler()
          return true
        }

        if (event.key === 'ArrowDown') {
          downHandler()
          return true
        }

        if (event.key === 'Enter') {
          enterHandler()
          return true
        }

        return false
      },
    }))

    return (
      <div className="z-50 min-w-[280px] rounded-xl border border-black/10 bg-white/90 backdrop-blur-sm p-2 shadow-lg dark:border-white/10 dark:bg-slate-800/90">
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 px-2 py-1 mb-1">
          Basic blocks
        </div>
        {items.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
              index === selectedIndex
                ? 'bg-sky-100 text-sky-900 dark:bg-sky-900/30 dark:text-sky-100'
                : 'hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            onClick={() => selectItem(index)}
          >
            <div className="flex-shrink-0 text-slate-600 dark:text-slate-400">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {item.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    )
  }
)

SlashCommandMenu.displayName = 'SlashCommandMenu'