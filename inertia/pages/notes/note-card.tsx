import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { PencilIcon, PinIcon, Share2Icon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Note {
  id: number
  title: string
  content: string
  pinned: boolean
  imageUrl: string | null
  labels: { id: number; name: string }[]
  createdAt: string
  updatedAt: string | null
}

interface NoteCardProps {
  note: Note
  viewType: 'grid' | 'list'
  onTogglePin: (id: number) => void
  onEdit: (note: Note) => void
  onShare: (id: number) => void
}

export default function NoteCard({ note, viewType, onTogglePin, onEdit, onShare }: NoteCardProps) {
  const createdAgo = formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })
  const updatedAgo = note.updatedAt ? formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true }) : null

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`relative overflow-hidden backdrop-blur-sm bg-[#2C2C2E]/80 ${
          viewType === 'grid' ? 'rounded-xl' : 'rounded-lg'
        }`}
        style={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' }}
      >
        <CardContent className={`p-5 ${viewType === 'list' ? 'flex items-center gap-4' : ''}`}>
          <div className={viewType === 'list' ? 'flex-1' : ''}>
          <div className="flex justify-between items-start gap-3 mb-4">
            <h2 className="text-lg font-medium text-white">{note.title}</h2>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => onShare(note.id)}
                variant="secondary"
                size="icon"
                className="text-[#30D158] hover:text-[#67E08A]"
              >
                <Share2Icon size={16} />
              </Button>
              <Button
                type="button"
                onClick={() => onEdit(note)}
                variant="secondary"
                size="icon"
                className="text-[#0A84FF] hover:text-[#3B9BFF]"
              >
                <PencilIcon size={16} />
              </Button>
              <Button
                type="button"
                onClick={() => onTogglePin(note.id)}
                variant="secondary"
                size="icon"
                className={`transition-colors duration-200 ${
                  note.pinned
                    ? 'bg-[#0A84FF]/20 text-[#0A84FF]'
                    : 'bg-[#3A3A3C] text-[#8E8E93] hover:text-white'
                }`}
              >
                <PinIcon size={18} className={note.pinned ? 'fill-current' : ''} />
              </Button>
            </div>
          </div>
          <div className={`text-[#E5E5EA] text-sm ${viewType === 'list' ? 'line-clamp-4' : ''}`}>
            {note.imageUrl && (
              <img
                src={note.imageUrl}
                alt={note.title}
                className="w-full max-h-56 object-cover rounded-lg border border-[#3A3A3C] mb-4"
              />
            )}
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
          {note.labels.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {note.labels.map((label) => (
                <Badge key={label.id}>
                  {label.name}
                </Badge>
              ))}
            </div>
          )}
          <div className="text-xs text-[#98989D] mt-4 space-y-1">
            <p>Created {createdAgo}</p>
            {updatedAgo && <p>Updated {updatedAgo}</p>}
          </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
