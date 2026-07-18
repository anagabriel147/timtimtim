'use client'

export function FieldLabel({
  children,
  required,
  optional,
}: {
  children: React.ReactNode
  required?: boolean
  optional?: boolean
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
      {children}
      {required && <span className="text-primary">*</span>}
      {optional && (
        <span className="rounded border border-border px-1.5 py-0.5 text-[0.6rem] font-medium tracking-wide text-muted-foreground">
          Opcional
        </span>
      )}
    </label>
  )
}

export const inputClass =
  'h-12 w-full rounded-xl border border-input bg-background/40 px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20'
