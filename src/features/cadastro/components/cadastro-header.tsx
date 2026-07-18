import Link from 'next/link'
import { HelpCircle } from 'lucide-react'

import { TimTimLogo } from '@/components/brand/timtim-logo'
import { cn } from '@/lib/utils'

export function CadastroHeader({
  step,
  totalSteps = 3,
}: {
  step: number
  totalSteps?: number
}) {
  const dots = Array.from({ length: totalSteps }, (_, i) => i + 1)

  return (
    <header className="flex items-center justify-between px-6 py-6 md:px-10">
      <Link href="/" aria-label="Ir para a página inicial da TimTim">
        <TimTimLogo />
      </Link>

      <div className="flex items-center gap-3" aria-hidden="true">
        <div className="flex items-center gap-1.5">
          {dots.map((d) => (
            <span
              key={d}
              className={cn(
                'h-1.5 rounded-full transition-all',
                d === step
                  ? 'w-6 bg-primary'
                  : d < step
                    ? 'w-3 bg-primary/50'
                    : 'w-3 bg-muted',
              )}
            />
          ))}
        </div>
        <span className="text-xs font-medium tracking-wide text-muted-foreground">
          PASSO {step} / {totalSteps}
        </span>
      </div>

      <Link
        href="/ajuda"
        className="text-xs font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground"
      >
        AJUDA
      </Link>
    </header>
  )
}
