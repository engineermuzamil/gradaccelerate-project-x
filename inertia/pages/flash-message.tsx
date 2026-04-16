import { useEffect, useState } from 'react'

interface FlashMessageProps {
  flash?: {
    success?: string
    error?: string
    sharedNoteUrl?: string
  }
}

export default function FlashMessage({ flash }: FlashMessageProps) {
  const flashKey = `${flash?.success ?? ''}-${flash?.error ?? ''}-${flash?.sharedNoteUrl ?? ''}`
  const [visible, setVisible] = useState(Boolean(flash?.success || flash?.error || flash?.sharedNoteUrl))

  useEffect(() => {
    setVisible(Boolean(flash?.success || flash?.error || flash?.sharedNoteUrl))
  }, [flashKey])

  useEffect(() => {
    if (!visible) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setVisible(false)
    }, 4000)

    return () => window.clearTimeout(timeoutId)
  }, [visible, flashKey])

  if (!visible || (!flash?.success && !flash?.error && !flash?.sharedNoteUrl)) {
    return null
  }

  const message = flash.success || flash.error
  const isError = Boolean(flash.error)
  const copyLink = async () => {
    if (!flash?.sharedNoteUrl) {
      return
    }

    try {
      await navigator.clipboard.writeText(flash.sharedNoteUrl)
    } catch {
      window.prompt('Copy this share link', flash.sharedNoteUrl)
    }
  }

  return (
    <div
      className={`mb-6 px-4 py-3 rounded-lg border ${
        isError
          ? 'bg-[#5A1F25]/70 border-[#FF6B6B]/40 text-[#FFD7DB]'
          : 'bg-[#14351F]/70 border-[#30D158]/40 text-[#D8FFE5]'
      }`}
    >
      {message && <p>{message}</p>}
      {flash?.sharedNoteUrl && (
        <div className="mt-3 flex flex-col gap-3">
          <p className="text-sm break-all">Copy this share link: {flash.sharedNoteUrl}</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={copyLink}
              className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 transition-colors duration-200"
            >
              Copy link
            </button>
            <a
              href={flash.sharedNoteUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 transition-colors duration-200"
            >
              Open link
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
