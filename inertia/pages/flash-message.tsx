import { useEffect, useState } from 'react'

interface FlashMessageProps {
  flash?: {
    success?: string
    error?: string
  }
}

export default function FlashMessage({ flash }: FlashMessageProps) {
  const [visible, setVisible] = useState(Boolean(flash?.success || flash?.error))

  useEffect(() => {
    setVisible(Boolean(flash?.success || flash?.error))
  }, [flash?.success, flash?.error])

  useEffect(() => {
    if (!visible) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setVisible(false)
    }, 4000)

    return () => window.clearTimeout(timeoutId)
  }, [visible])

  if (!visible || (!flash?.success && !flash?.error)) {
    return null
  }

  const message = flash.success || flash.error
  const isError = Boolean(flash.error)

  return (
    <div
      className={`mb-6 px-4 py-3 rounded-lg border ${
        isError
          ? 'bg-[#5A1F25]/70 border-[#FF6B6B]/40 text-[#FFD7DB]'
          : 'bg-[#14351F]/70 border-[#30D158]/40 text-[#D8FFE5]'
      }`}
    >
      {message}
    </div>
  )
}
