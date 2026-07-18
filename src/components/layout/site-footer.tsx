import Link from 'next/link'

export function SiteFooter({ secure = false }: { secure?: boolean }) {
  return (
    <footer className="flex flex-col items-center gap-3 py-8 text-center">
      {secure && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          Seus dados estão seguros e criptografados
          <ShieldIcon />
        </p>
      )}
      <nav className="flex items-center gap-4 text-xs text-muted-foreground">
        <Link href="/privacidade" className="transition-colors hover:text-foreground">
          Privacidade
        </Link>
        <span aria-hidden="true" className="text-border">
          |
        </span>
        <Link href="/termos" className="transition-colors hover:text-foreground">
          Termos
        </Link>
        <span aria-hidden="true" className="text-border">
          |
        </span>
        <Link href="/contato" className="transition-colors hover:text-foreground">
          Contato
        </Link>
      </nav>
      <p className="text-xs text-muted-foreground/70">© 2025 TimTim</p>
    </footer>
  )
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5 text-primary"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </svg>
  )
}
