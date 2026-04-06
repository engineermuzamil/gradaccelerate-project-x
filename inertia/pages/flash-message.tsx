interface FlashMessageProps {
  flash?: {
    success?: string
    error?: string
  }
}

export default function FlashMessage({ flash }: FlashMessageProps) {
  if (!flash?.success && !flash?.error) {
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
