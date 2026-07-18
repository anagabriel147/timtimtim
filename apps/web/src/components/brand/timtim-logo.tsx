import Image from 'next/image'

import { cn } from '@/lib/utils'

/**
 * Official TimTim brand logo (clinking glasses + wordmark, green→blue gradient).
 * Rendered from the provided PNG asset. Size it by passing a height class
 * (e.g. `className="h-10 w-auto"`).
 */
export function TimTimLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/images/brand/timtim-logo.png"
      alt="TimTim"
      width={3162}
      height={1102}
      priority
      className={cn('h-8 w-auto', className)}
    />
  )
}
