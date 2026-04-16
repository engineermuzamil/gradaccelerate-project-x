import { Head, Link, usePage } from '@inertiajs/react'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft } from 'lucide-react'

interface Note {
  id: number
  title: string
  content: string
  imageUrl: string | null
  labels: { id: number; name: string }[]
  createdAt: string
  updatedAt: string | null
}

export default function SharedNote() {
  const { note } = usePage<{ note: Note }>().props

  return (
    <>
      <Head title={note.title} />
      <div className="min-h-screen bg-[#1C1C1E] text-white">
        <div className="max-w-3xl mx-auto p-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2C2C2E] border border-[#3A3A3C] hover:bg-[#3A3A3C] transition-colors duration-200 mb-6"
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>

          <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#3A3A3C]">
            <h1 className="text-3xl font-bold text-white mb-5">{note.title}</h1>

            {note.imageUrl && (
              <img
                src={note.imageUrl}
                alt={note.title}
                className="w-full max-h-80 object-cover rounded-lg border border-[#3A3A3C] mb-5"
              />
            )}

            <div className="text-[#E5E5EA] text-sm">
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
              <div className="flex flex-wrap gap-2 mt-5">
                {note.labels.map((label) => (
                  <span
                    key={label.id}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#0A84FF]/15 text-[#6FB2FF] border border-[#0A84FF]/30"
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
