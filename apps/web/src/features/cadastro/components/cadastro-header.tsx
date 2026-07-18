import Link from 'next/link'

import { TimTimLogo } from '@/components/brand/timtim-logo'
import { cn } from '@/lib/utils'

export function CadastroHeader({ step, totalSteps = 3 }: { step: number; totalSteps?: number }) {
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
                d === step ? 'bg-primary w-6' : d < step ? 'bg-primary/50 w-3' : 'bg-muted w-3',
              )}
            />
          ))}
        </div>
        <span className="text-muted-foreground text-xs font-medium tracking-wide">
          PASSO {step} / {totalSteps}
        </span>
      </div>

      <Link
        href="/ajuda"
        className="text-muted-foreground hover:text-foreground text-xs font-medium tracking-wide transition-colors"
      >
        AJUDA
      </Link>
    </header>
  )
}
