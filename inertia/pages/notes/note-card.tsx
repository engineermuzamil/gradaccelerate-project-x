import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { PinIcon } from 'lucide-react'

interface Note {
  id: number
  title: string
  content: string
  pinned: boolean
  createdAt: string
  updatedAt: string | null
}

interface NoteCardProps {
  note: Note
  viewType: 'grid' | 'list'
  onTogglePin: (id: number) => void
}

export default function NoteCard({ note, viewType, onTogglePin }: NoteCardProps) {
  const timeAgo = formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })

  return (
    <motion.div
      className={`relative overflow-hidden backdrop-blur-sm bg-[#2C2C2E]/80 border border-[#3A3A3C] ${
        viewType === 'grid' ? 'rounded-xl' : 'rounded-lg'
      }`}
      style={{
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`p-5 ${viewType === 'list' ? 'flex items-center gap-4' : ''}`}>
        <div className={viewType === 'list' ? 'flex-1' : ''}>
          <div className="flex justify-between items-start gap-3 mb-4">
            <h2 className="text-lg font-medium text-white">{note.title}</h2>
            <button
              type="button"
              onClick={() => onTogglePin(note.id)}
              className={`transition-colors duration-200 ${
                note.pinned ? 'text-[#0A84FF]' : 'text-[#8E8E93] hover:text-white'
              }`}
            >
              <PinIcon size={18} />
            </button>
          </div>
          <div className={`text-[#E5E5EA] text-sm ${viewType === 'list' ? 'line-clamp-4' : ''}`}>
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-3">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-semibold text-white mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-semibold text-white mb-2">{children}</h3>,
                p: ({ children }) => <p className="text-[#E5E5EA] leading-7 mb-3 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-5 space-y-2 mb-3">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 space-y-2 mb-3">{children}</ol>,
                li: ({ children }) => <li className="text-[#E5E5EA]">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                code: ({ children }) => (
                  <code className="bg-[#1C1C1E] text-[#0A84FF] px-1.5 py-0.5 rounded text-xs">
                    {children}
                  </code>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[#0A84FF] pl-4 text-[#B0B0B5] my-3">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {note.content}
            </ReactMarkdown>
          </div>
          <p className="text-xs text-[#98989D] mt-4">{timeAgo}</p>
        </div>
      </div>
    </motion.div>
  )
} 
