interface GoogleAuthButtonProps {
  href?: string
}

export default function GoogleAuthButton({ href = '/google/redirect' }: GoogleAuthButtonProps) {
  return (
    <>
      <a
        href={href}
        className="w-full mb-4 inline-flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-white text-[#1C1C1E] font-medium hover:bg-[#F2F2F7] transition-colors duration-200"
      >
        Continue with Google
      </a>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-[#3A3A3C]" />
        <span className="text-xs text-[#98989D] uppercase tracking-[0.2em]">or</span>
        <div className="h-px flex-1 bg-[#3A3A3C]" />
      </div>
    </>
  )
}
