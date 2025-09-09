'use client'

import { useEditor, EditorContent, type JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import CodeBlock from '@tiptap/extension-code-block'
import Placeholder from '@tiptap/extension-placeholder'
import { Mention } from '@tiptap/extension-mention'
import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import { useEffect, useState, useCallback } from 'react'
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

export default function TiptapEditor({
  noteId: _noteId,
  initialContent,
  onSave: _onSave,
  className = '',
  placeholder = 'Start writing...'
}: TiptapEditorProps) {
  const [selectionPopup, setSelectionPopup] = useState<{
    text: string
    position: { x: number; y: number }
  } | null>(null)
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
      title: 'Divider',
      description: 'Visually divide blocks',
      icon: <Minus className="h-4 w-4" />,
      command: () => editor?.chain().focus().setHorizontalRule().run(),
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
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      CodeBlock.configure({
        languageClassPrefix: 'language-',
      }),
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
            let popup: any

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

                popup = tippy('body', {
                  getReferenceClientRect: props.clientRect as () => DOMRect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: 'manual',
                  placement: 'bottom-start',
                })
              },

              onUpdate(props) {
                component.updateProps({
                  ...props,
                  items: props.items,
                })

                if (!props.clientRect) {
                  return
                }

                popup[0].setProps({
                  getReferenceClientRect: props.clientRect as () => DOMRect,
                })
              },

              onKeyDown(props) {
                if (props.event.key === 'Escape') {
                  popup[0].hide()
                  return true
                }

                return component.ref?.onKeyDown(props) ?? false
              },

              onExit() {
                popup[0].destroy()
                component.destroy()
              },
            }
          },
        },
      }),
    ],
    content: initialContent ?? '<p></p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-6',
        'data-placeholder': placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      // This will be used for auto-save functionality
      const content = editor.getJSON()
      console.log('Content updated:', content)
      // TODO: Implement auto-save logic here
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