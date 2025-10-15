'use client'

import { useEditor, EditorContent, type JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import CodeBlock from '@tiptap/extension-code-block'
import Placeholder from '@tiptap/extension-placeholder'
import { Mention } from '@tiptap/extension-mention'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { ReactRenderer } from '@tiptap/react'
import tippy, { type Instance, type Props } from 'tippy.js'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { 
  Heading1, 
  Heading2, 
  Heading3, 
  Type, 
  List, 
  ListOrdered, 
  Code, 
  Quote,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Save
} from 'lucide-react'
import { SlashCommandMenu, type SlashCommandMenuRef } from './SlashCommandMenu'
import SelectionPopup from './SelectionPopup'

interface TiptapEditorProps {
  noteId: string
  initialContent?: JSONContent | string
  onSave?: (content: JSONContent) => Promise<void>
  className?: string
  placeholder?: string
}

interface SlashCommandItem {
  title: string
  description: string
  icon: React.ReactNode
  command: () => void
}

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  children: React.ReactNode
  title?: string
}

function ToolbarButton({ onClick, isActive, disabled, children, title }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        inline-flex items-center justify-center w-8 h-8 rounded-md border transition-colors
        ${isActive 
          ? 'bg-sky-100 border-sky-300 text-sky-700 dark:bg-sky-900/50 dark:border-sky-700 dark:text-sky-300' 
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {children}
    </button>
  )
}

export default function TiptapEditor({
  noteId,
  initialContent,
  onSave,
  className = '',
  placeholder = 'Start writing...'
}: TiptapEditorProps) {
  const [selectionPopup, setSelectionPopup] = useState<{
    text: string
    position: { x: number; y: number }
  } | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Persistence: Load content from localStorage for demo
  const storedContent = useMemo<JSONContent | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`note-${noteId}`)
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as unknown
          if (parsed && typeof parsed === 'object') {
            return parsed as JSONContent
          }
        } catch {
          return null
        }
      }
    }
    return null
  }, [noteId])

  // Auto-save function
  const autoSave = useCallback(async (content: JSONContent) => {
    if (typeof window !== 'undefined') {
      // Save to localStorage for demo
      localStorage.setItem(`note-${noteId}`, JSON.stringify(content))
      setLastSaved(new Date())
      
      // Call external save function if provided
      if (onSave) {
        setIsSaving(true)
        try {
          await onSave(content)
        } catch (error) {
          console.error('Failed to save:', error)
        } finally {
          setIsSaving(false)
        }
      }
    }
  }, [noteId, onSave])

  // Slash command items
  const slashCommandItems: SlashCommandItem[] = [
    {
      title: 'Heading 1',
      description: 'Big section heading',
      icon: <Heading1 className="h-4 w-4" />,
      command: (): void => { editor?.chain().focus().toggleHeading({ level: 1 }).run() },
    },
    {
      title: 'Heading 2', 
      description: 'Medium section heading',
      icon: <Heading2 className="h-4 w-4" />,
      command: (): void => { editor?.chain().focus().toggleHeading({ level: 2 }).run() },
    },
    {
      title: 'Heading 3',
      description: 'Small section heading', 
      icon: <Heading3 className="h-4 w-4" />,
      command: (): void => { editor?.chain().focus().toggleHeading({ level: 3 }).run() },
    },
    {
      title: 'Text',
      description: 'Just start typing with plain text',
      icon: <Type className="h-4 w-4" />,
      command: (): void => { editor?.chain().focus().setParagraph().run() },
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bullet list',
      icon: <List className="h-4 w-4" />,
      command: (): void => { editor?.chain().focus().toggleBulletList().run() },
    },
    {
      title: 'Numbered List',
      description: 'Create a list with numbering',
      icon: <ListOrdered className="h-4 w-4" />,
      command: (): void => { editor?.chain().focus().toggleOrderedList().run() },
    },
    {
      title: 'Code Block',
      description: 'Capture a code snippet',
      icon: <Code className="h-4 w-4" />,
      command: (): void => { editor?.chain().focus().toggleCodeBlock().run() },
    },
    {
      title: 'Quote',
      description: 'Capture a quote',
      icon: <Quote className="h-4 w-4" />,
      command: (): void => { editor?.chain().focus().toggleBlockquote().run() },
    },
    {
      title: 'Table',
      description: 'Add a table',
      icon: <TableIcon className="h-4 w-4" />,
      command: (): void => { 
        editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() 
      },
    },
    {
      title: 'Image',
      description: 'Add an image',
      icon: <ImageIcon className="h-4 w-4" />,
      command: (): void => { 
        const url = window.prompt('Enter image URL')
        if (url) {
          editor?.chain().focus().setImage({ src: url }).run()
        }
      },
    },
  ]

  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration issues
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        heading: false, // We'll use the dedicated Heading extension
        codeBlock: false, // We'll use the dedicated CodeBlock extension
        bold: false, // Use dedicated Bold extension
        italic: false, // Use dedicated Italic extension
        strike: false, // Use dedicated Strike extension
      }),
      // Text formatting
      Bold.configure({
        HTMLAttributes: {
          class: 'font-bold',
        },
      }),
      Italic.configure({
        HTMLAttributes: {
          class: 'italic',
        },
      }),
      Underline.configure({
        HTMLAttributes: {
          class: 'underline',
        },
      }),
      Strike.configure({
        HTMLAttributes: {
          class: 'line-through',
        },
      }),
      // Link extension
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-sky-600 underline hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300',
        },
      }),
      // Styling extensions
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'px-1 py-0.5 rounded',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      // Structure extensions
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
        HTMLAttributes: {
          class: 'scroll-mt-16',
        },
      }),
      CodeBlock.configure({
        languageClassPrefix: 'language-',
        HTMLAttributes: {
          class: 'rounded-lg bg-slate-100 dark:bg-slate-800 p-4 font-mono text-sm',
        },
      }),
      // Image extension
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-md',
        },
      }),
      // Table extensions
      Table,
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: {
          items: ({ query }) => {
            return slashCommandItems
              .filter(item => item.title.toLowerCase().startsWith(query.toLowerCase()))
              .slice(0, 10)
          },
          render: () => {
            let component: ReactRenderer<SlashCommandMenuRef>
            let popup: Instance<Props> | null = null

            return {
              onStart: (props) => {
                component = new ReactRenderer(SlashCommandMenu, {
                  props: {
                    ...props,
                    items: props.items,
                  },
                  editor: props.editor,
                })

                if (!props.clientRect) {
                  return
                }

                const popupInstances: Instance<Props>[] = tippy('body', {
                  getReferenceClientRect: props.clientRect as () => DOMRect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: 'manual',
                  placement: 'bottom-start',
                })
                popup = popupInstances[0] ?? null
              },

              onUpdate(props) {
                component.updateProps({
                  ...props,
                  items: props.items,
                })

                if (!props.clientRect) {
                  return
                }

                popup?.setProps({
                  getReferenceClientRect: props.clientRect as () => DOMRect,
                })
              },

              onKeyDown(props) {
                if (props.event.key === 'Escape') {
                  popup?.hide()
                  return true
                }

                return component.ref?.onKeyDown(props) ?? false
              },

              onExit() {
                popup?.destroy()
                component.destroy()
              },
            }
          },
        },
      }),
    ],
    content: storedContent ?? initialContent ?? '<p></p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-6 max-w-none',
        'data-placeholder': placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      // Auto-save with debouncing
      const content = editor.getJSON()
      void autoSave(content)
    },
    onSelectionUpdate: ({ editor }) => {
      // Handle text selection for popup
      const { from, to } = editor.state.selection
      const selectedText = editor.state.doc.textBetween(from, to)
      
      if (selectedText.trim() && from !== to) {
        // Get selection coordinates
        const { view } = editor
        const start = view.coordsAtPos(from)
        const end = view.coordsAtPos(to)
        
        setSelectionPopup({
          text: selectedText,
          position: {
            x: (start.left + end.left) / 2,
            y: start.top
          }
        })
      } else {
        setSelectionPopup(null)
      }
    },
  })

  // Manual save function
  const handleSave = useCallback(async () => {
    if (editor) {
      const content = editor.getJSON()
      await autoSave(content)
    }
  }, [editor, autoSave])

  // Toolbar action handlers
  const setLink = useCallback(() => {
    if (!editor) return
    
    const attrs = editor.getAttributes('link') as Record<string, unknown>
    const previousUrl = typeof attrs.href === 'string' ? attrs.href : undefined
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return
    
    const url = window.prompt('Enter image URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const insertTable = useCallback(() => {
    if (!editor) return
    
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }, [editor])

  const setTextColor = useCallback((color: string) => {
    if (!editor) return
    editor.chain().focus().setColor(color).run()
  }, [editor])

  // Handle color prompt with proper typing
  const handleColorPrompt = useCallback(() => {
    if (!editor) return
    const color = window.prompt('Enter color (hex, rgb, or name)', '#000000')
    if (color) {
      setTextColor(color)
    }
  }, [editor, setTextColor])

  // AI action handlers
  const handleExplain = useCallback(async (text: string) => {
    console.log('Explaining text:', text)
    // TODO: Implement actual AI explanation
    alert(`Mini Drona would explain: "${text}"`)
    setSelectionPopup(null)
  }, [])

  const handleEnhance = useCallback(async (text: string) => {
    console.log('Enhancing text:', text)
    // TODO: Implement actual AI enhancement
    alert(`Enhancing text: "${text}"`)
    setSelectionPopup(null)
  }, [])

  // Cleanup editor on unmount
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy()
      }
    }
  }, [editor])

  if (!editor) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-slate-500 dark:text-slate-400">Loading editor...</div>
      </div>
    )
  }

  return (
    <div className={`tiptap-editor ${className} relative`}>
      {/* Toolbar */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80">
        <div className="flex flex-wrap items-center gap-1 p-2">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 border-r border-slate-200 pr-2 dark:border-slate-700">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold (Ctrl+B)"
            >
              <BoldIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic (Ctrl+I)"
            >
              <ItalicIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive('underline')}
              title="Underline (Ctrl+U)"
            >
              <UnderlineIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              isActive={editor.isActive('highlight')}
              title="Highlight"
            >
              <Highlighter className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Headings */}
          <div className="flex items-center gap-1 border-r border-slate-200 pr-2 dark:border-slate-700">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
              title="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 border-r border-slate-200 pr-2 dark:border-slate-700">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-1 border-r border-slate-200 pr-2 dark:border-slate-700">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              isActive={editor.isActive({ textAlign: 'left' })}
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              isActive={editor.isActive({ textAlign: 'center' })}
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              isActive={editor.isActive({ textAlign: 'right' })}
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              isActive={editor.isActive({ textAlign: 'justify' })}
              title="Justify"
            >
              <AlignJustify className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Insert Elements */}
          <div className="flex items-center gap-1 border-r border-slate-200 pr-2 dark:border-slate-700">
            <ToolbarButton
              onClick={setLink}
              isActive={editor.isActive('link')}
              title="Add Link"
            >
              <LinkIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={addImage}
              title="Add Image"
            >
              <ImageIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={insertTable}
              title="Insert Table"
            >
              <TableIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive('codeBlock')}
              title="Code Block"
            >
              <Code className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Color Picker */}
          <div className="flex items-center gap-1 border-r border-slate-200 pr-2 dark:border-slate-700">
            <div className="relative">
              <ToolbarButton
                onClick={handleColorPrompt}
                title="Text Color"
              >
                <Palette className="h-4 w-4" />
              </ToolbarButton>
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center gap-2 ml-auto">
            {lastSaved && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            <ToolbarButton
              onClick={handleSave}
              disabled={isSaving}
              title="Save"
            >
              <Save className="h-4 w-4" />
            </ToolbarButton>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent 
        editor={editor}
        className="rounded-xl border border-black/10 bg-white/80 backdrop-blur-sm focus-within:border-sky-200 focus-within:shadow-lg dark:border-white/10 dark:bg-white/5 dark:focus-within:border-sky-800"
      />
      
      {/* Selection Popup */}
      {selectionPopup && (
        <SelectionPopup
          selectedText={selectionPopup.text}
          position={selectionPopup.position}
          onExplain={handleExplain}
          onEnhance={handleEnhance}
          onClose={() => setSelectionPopup(null)}
        />
      )}
    </div>
  )
}