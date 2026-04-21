import * as React from 'react'
import { cn } from '@/lib/utils'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[120px] w-full rounded-md border border-[#3A3A3C] bg-[#3A3A3C] px-3 py-2 text-sm text-white placeholder:text-[#98989D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF] disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
