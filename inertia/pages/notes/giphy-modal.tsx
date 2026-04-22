import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'

interface GIF {
  id: string
  url: string
  title: string
}

interface GiphyModalProps {
  isOpen: boolean
  initialQuery?: string
  onClose: () => void
  onSelectGif: (gifUrl: string) => void
}

export default function GiphyModal({ isOpen, initialQuery = '', onClose, onSelectGif }: GiphyModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [gifs, setGifs] = useState<GIF[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setSearchQuery(initialQuery)

    if (initialQuery.trim()) {
      searchGifs(initialQuery)
    } else {
      setGifs([])
      setError('')
    }
  }, [isOpen, initialQuery])

  const searchGifs = async (query: string) => {
    if (!query.trim()) {
      setGifs([])
      setError('')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/giphy/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to search GIFs')
        return
      }

      setGifs(data.gifs || [])
    } catch {
      setError('Error searching GIFs')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    searchGifs(query)
  }

  const handleSelectGif = (gifUrl: string) => {
    onSelectGif(gifUrl)
    setSearchQuery('')
    setGifs([])
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-1/2 left-1/2 bg-[#2C2C2E] rounded-xl p-6 w-[90%] max-w-2xl max-h-[80vh] overflow-y-auto z-50 border border-[#3A3A3C]"
            initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Search GIFs</h2>
              <button
                onClick={onClose}
                className="text-[#98989D] hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 text-[#98989D]" size={20} />
              <input
                type="text"
                placeholder="Search for GIFs..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none"
                autoFocus
              />
            </div>

            {error && (
              <div className="text-[#FFD7DB] bg-[#5A1F25]/70 px-4 py-2 rounded mb-4">
                {error}
              </div>
            )}

            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin">
                  <div className="h-8 w-8 border-4 border-[#0A84FF] border-t-transparent rounded-full" />
                </div>
              </div>
            )}

            {!loading && gifs.length === 0 && searchQuery && (
              <div className="text-center py-8 text-[#98989D]">
                No GIFs found
              </div>
            )}

            {!loading && searchQuery === '' && (
              <div className="text-center py-8 text-[#98989D]">
                Start typing to search for GIFs
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gifs.map((gif) => (
                <motion.button
                  key={gif.id}
                  type="button"
                  onClick={() => handleSelectGif(gif.url)}
                  className="relative group rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={gif.url}
                    alt={gif.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-semibold">Select</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
