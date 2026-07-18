import Image from 'next/image'

import { cn } from '@/lib/utils'

const LOGO_SRC = '/images/brand/timtim-logo.png'

/**
 * Official TimTim logo (toasting glasses + wordmark).
 * - `showWordmark` true  -> full logo (icon + "TIMTIM")
 * - `showWordmark` false -> icon only (toasting glasses), cropped from the logo
 */
export function BrandMark({
  className,
  size = 'md',
  showWordmark = true,
}: {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showWordmark?: boolean
}) {
  const heightClass = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-11',
  }[size]

  const iconBox = {
    sm: 'size-7',
    md: 'size-9',
    lg: 'size-11',
  }[size]

  if (!showWordmark) {
    // Crop to just the toasting-glasses icon on the left of the logo.
    return (
      <span
        className={cn('relative inline-block shrink-0 overflow-hidden', iconBox, className)}
        aria-label="TimTim"
      >
        <Image
          src={LOGO_SRC || '/placeholder.svg'}
          alt="TimTim"
          width={640}
          height={224}
          className="absolute top-0 left-0 h-full w-auto max-w-none"
          priority
        />
      </span>
    )
  }

  return (
    <Image
      src={LOGO_SRC || '/placeholder.svg'}
      alt="TimTim"
      width={640}
      height={224}
      className={cn('w-auto', heightClass, className)}
      priority
    />
  )
}
