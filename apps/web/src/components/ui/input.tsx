import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'border-border bg-secondary/40 text-foreground flex h-12 w-full min-w-0 rounded-xl border px-4 py-2 text-sm shadow-xs transition-colors outline-none',
        'placeholder:text-muted-foreground/70 selection:bg-primary selection:text-primary-foreground',
        'focus-visible:border-primary/60 focus-visible:ring-primary/25 focus-visible:ring-3',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/25 aria-invalid:ring-3',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
