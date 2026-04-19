import type React from "react"
import { motion } from "framer-motion"
import GiphyModal from "./giphy-modal"
import { useState } from "react"

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

  const handleGifSelect = (gifUrl: string) => {
    // Remove the /giphy command and add the GIF markdown
    const cleanedContent = data.content.replace(/\/giphy\s*$/, '')
    const gifMarkdown = `\n![GIF](${gifUrl})\n`
    setData('content', cleanedContent + gifMarkdown)
    setIsGiphyOpen(false)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value

    // Detect /giphy command
    if (content.endsWith('/giphy')) {
      setIsGiphyOpen(true)
    }

    setData('content', content)
  }

  return (
    <>
      <motion.div
        className="bg-[#2C2C2E] rounded-xl p-6 backdrop-blur-lg border border-[#3A3A3C]"
        style={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)" }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">{isEditing ? "Edit Note" : "New Note"}</h2>
        <form onSubmit={submit}>
          <div className="mb-4">
            <motion.input
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              type="text"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
              placeholder="Note title"
              className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none transition-all duration-200"
              required
            />
          </div>
          <div className="mb-4">
            <motion.textarea
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              value={data.content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              placeholder='Note content (Type "/giphy" to add a GIF)'
              className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none min-h-[120px] transition-all duration-200"
              required
            />
          </div>
          <p className="text-sm text-[#98989D] mb-4">Markdown is supported in note content.</p>
          <div className="mb-4">
            <p className="text-sm font-medium text-white mb-3">Labels</p>
            <div className="flex flex-wrap gap-3">
              {labels.map((label) => {
                const isSelected = data.labels.includes(label.id)

                return (
                  <button
                    key={label.id}
                    type="button"
                    onClick={() =>
                      setData(
                        "labels",
                        isSelected
                          ? data.labels.filter((id) => id !== label.id)
                          : [...data.labels, label.id]
                      )
                    }
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-200 border ${
                      isSelected
                        ? "bg-[#0A84FF]/15 text-[#6FB2FF] border-[#0A84FF]"
                        : "bg-[#3A3A3C] text-[#E5E5EA] border-transparent hover:bg-[#4A4A4C]"
                    }`}
                  >
                    {label.name}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-3">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="block w-full text-sm text-[#E5E5EA] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#0A84FF] file:text-white hover:file:bg-[#0A74FF]"
            />
            {isUploadingImage && <p className="text-sm text-[#98989D] mt-2">Uploading image...</p>}
            {data.imageUrl && (
              <img src={data.imageUrl} alt="Note upload preview" className="mt-3 w-full max-h-48 object-cover rounded-lg border border-[#3A3A3C]" />
            )}
          </div>
          <label className="flex items-center gap-3 mb-4 text-sm text-white">
            <input
              type="checkbox"
              checked={data.pinned}
              onChange={(e) => setData("pinned", e.target.checked)}
              className="h-4 w-4 rounded border-none accent-[#0A84FF]"
            />
            Pin this note
          </label>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={processing || isUploadingImage}
            className="w-full bg-[#0A84FF] text-white px-4 py-3 rounded-lg hover:bg-[#0A74FF] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:ring-offset-2 focus:ring-offset-[#2C2C2E] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {processing ? (isEditing ? "Saving..." : "Adding...") : (isEditing ? "Save Note" : "Add Note")}
          </motion.button>
          <p className="text-center text-sm text-[#98989D] mt-2">
            Hit {navigator.platform?.includes("Mac") ? "⌘" : "Ctrl"} + Enter to {isEditing ? "save" : "add"} note
          </p>
        </form>
      </motion.div>

      <GiphyModal
        isOpen={isGiphyOpen}
        onClose={() => setIsGiphyOpen(false)}
        onSelectGif={handleGifSelect}
      />
    </>
  )
} 
