import type React from 'react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import GiphyModal from './giphy-modal'

const GIPHY_COMMAND_REGEX = /(?:^|\n)\/giphy(?:\s+([^\n]*))?$/i

function getGiphyQuery(content: string) {
  return content.match(GIPHY_COMMAND_REGEX)?.[1]?.trim() || ''
}

function insertGifIntoContent(content: string, gifUrl: string) {
  const gifMarkdown = `![GIF](${gifUrl})`

  if (GIPHY_COMMAND_REGEX.test(content)) {
    return content.replace(GIPHY_COMMAND_REGEX, (command) => {
      const prefix = command.startsWith('\n') ? '\n' : ''
      return `${prefix}${gifMarkdown}`
    })
  }

  if (!content.trim()) {
    return `${gifMarkdown}\n`
  }

  return `${content.trimEnd()}\n${gifMarkdown}\n`
}

interface NoteFormProps {
  labels: {
    id: number
    name: string
  }[]
  data: {
    title: string
    content: string
    pinned: boolean
    imageUrl: string
    labels: number[]
  }
  setData: (field: string, value: string | boolean | number[]) => void
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  isUploadingImage: boolean
  submit: (e: React.FormEvent) => void
  processing: boolean
  handleKeyDown: (e: React.KeyboardEvent) => void
  isEditing: boolean
}

export default function NoteForm({
  labels,
  data,
  setData,
  onImageChange,
  isUploadingImage,
  submit,
  processing,
  handleKeyDown,
  isEditing,
}: NoteFormProps) {
  const [isGiphyOpen, setIsGiphyOpen] = useState(false)
  const [giphyQuery, setGiphyQuery] = useState('')

  const handleGifSelect = (gifUrl: string) => {
    setData('content', insertGifIntoContent(data.content, gifUrl))
    setIsGiphyOpen(false)
    setGiphyQuery('')
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value
    const query = getGiphyQuery(content)

    setData('content', content)

    if (GIPHY_COMMAND_REGEX.test(content)) {
      setGiphyQuery(query)
      setIsGiphyOpen(true)
      return
    }

    setGiphyQuery('')
  }

  const openGiphyPicker = () => {
    setGiphyQuery('')
    setIsGiphyOpen(true)
  }

  return (
    <>
      <motion.div style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)' }}>
        <Card className="backdrop-blur-lg">
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Note' : 'New Note'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <Input
                type="text"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                placeholder="Note title"
                required
              />

              <Textarea
                value={data.content}
                onChange={handleContentChange}
                onKeyDown={handleKeyDown}
                placeholder='Note content (Type "/giphy" to add a GIF)'
                required
              />

              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-[#98989D]">Markdown is supported in note content.</p>
                <Button type="button" variant="secondary" onClick={openGiphyPicker}>
                  Add GIF
                </Button>
              </div>

              <div>
                <p className="text-sm font-medium text-white mb-3">Labels</p>
                <div className="flex flex-wrap gap-2">
                  {labels.map((label) => {
                    const isSelected = data.labels.includes(label.id)

                    return (
                      <button
                        key={label.id}
                        type="button"
                        onClick={() =>
                          setData(
                            'labels',
                            isSelected
                              ? data.labels.filter((id) => id !== label.id)
                              : [...data.labels, label.id]
                          )
                        }
                      >
                        <Badge
                          variant={isSelected ? 'default' : 'secondary'}
                          className="cursor-pointer px-3 py-1.5"
                        >
                          {label.name}
                        </Badge>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-3">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageChange}
                  className="block w-full text-sm text-[#E5E5EA] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#0A84FF] file:text-white hover:file:bg-[#0A74FF]"
                />
                {isUploadingImage && <p className="text-sm text-[#98989D] mt-2">Uploading image...</p>}
                {data.imageUrl && (
                  <img
                    src={data.imageUrl}
                    alt="Note upload preview"
                    className="mt-3 w-full max-h-48 object-cover rounded-lg border border-[#3A3A3C]"
                  />
                )}
              </div>

              <label className="flex items-center gap-3 text-sm text-white">
                <input
                  type="checkbox"
                  checked={data.pinned}
                  onChange={(e) => setData('pinned', e.target.checked)}
                  className="h-4 w-4 rounded border-none accent-[#0A84FF]"
                />
                Pin this note
              </label>

              <Button type="submit" disabled={processing || isUploadingImage} className="w-full">
                {processing ? (isEditing ? 'Saving...' : 'Adding...') : isEditing ? 'Save Note' : 'Add Note'}
              </Button>

              <p className="text-center text-sm text-[#98989D]">
                Hit {navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'} + Enter to {isEditing ? 'save' : 'add'} note
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <GiphyModal
        isOpen={isGiphyOpen}
        initialQuery={giphyQuery}
        onClose={() => {
          setIsGiphyOpen(false)
          setGiphyQuery('')
        }}
        onSelectGif={handleGifSelect}
      />
    </>
  )
} 
