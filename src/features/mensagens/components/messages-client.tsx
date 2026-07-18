'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  BadgeCheck,
  Bell,
  Check,
  CheckCheck,
  ChevronDown,
  ExternalLink,
  HelpCircle,
  Image as ImageIcon,
  Link2,
  MoreVertical,
  Paperclip,
  Receipt,
  Search,
  Send,
  SlidersHorizontal,
  Smile,
  SquarePen,
  Users,
  X,
} from 'lucide-react'

import { BrandMark } from '@/components/brand/brand-mark'
import { cn } from '@/lib/utils'
import { useChat } from '../store/chat-store'
import { COMPOSER, CURRENT_USER, FILTERS, NAV } from '../data/messages-data'

export function MessagesClient() {
  const router = useRouter()
  const { conversations, activeId, setActiveId, sendMessage, markRead } = useChat()

  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('Todos')
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [bannerOpen, setBannerOpen] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0]

  const threadRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' })
  }, [active.messages.length, activeId])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const activeConvos = conversations.filter((c) => !c.archived)
  const archivedConvos = conversations.filter((c) => c.archived)

  const matchesFilter = (unread: number, hasProposal?: boolean) => {
    if (filter === 'Ativos') return true
    if (filter === 'Propostas') return Boolean(hasProposal)
    return true
  }

  const visibleActive = activeConvos.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) &&
      matchesFilter(c.unread, Boolean(c.banner)),
  )

  const handleSelect = (id: string) => {
    setActiveId(id)
    markRead(id)
    setBannerOpen(true)
  }

  const handleSend = () => {
    if (!draft.trim()) return
    sendMessage(active.id, draft)
    setDraft('')
  }

  const onComposerKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (e.nativeEvent.isComposing || e.keyCode === 229) return
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background">
      {/* top nav */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-10">
          <button type="button" onClick={() => router.push('/cliente')} className="flex items-center gap-2">
            <BrandMark />
          </button>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((link) => {
              const isActive = link.label === 'Mensagens'
              return (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => router.push(link.href)}
                  className={cn(
                    'text-sm transition-colors',
                    isActive
                      ? 'font-medium text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {link.label}
                </button>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Notificações"
            className="relative grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
          >
            <Bell className="size-5" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
          </button>
          <button
            type="button"
            aria-label="Ajuda"
            className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
          >
            <HelpCircle className="size-5" />
          </button>
          <button type="button" className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2">
            <Image
              src={CURRENT_USER.avatar}
              alt={CURRENT_USER.name}
              width={36}
              height={36}
              className="size-9 rounded-full object-cover"
            />
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-medium text-foreground">{CURRENT_USER.name}</span>
              <span className="block text-xs text-primary">{CURRENT_USER.plan}</span>
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* body */}
      <div className="flex min-h-0 flex-1">
        {/* sidebar */}
        <aside className="hidden w-80 shrink-0 flex-col border-r border-border lg:flex">
          <div className="flex items-center justify-between px-5 pb-3 pt-5">
            <h1 className="font-display text-lg font-semibold text-foreground">Mensagens</h1>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Filtrar"
                className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
              >
                <SlidersHorizontal className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Nova conversa"
                onClick={() => setToast('Nova conversa: escolha um fornecedor para começar.')}
                className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
              >
                <SquarePen className="size-4" />
              </button>
            </div>
          </div>

          <div className="px-5">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar conversas..."
                className="h-10 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>



          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
            {visibleActive.map((c) => (
              <ConversationRow
                key={c.id}
                convo={c}
                active={c.id === activeId}
                onSelect={() => handleSelect(c.id)}
              />
            ))}


          </div>

          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              {activeConvos.length} conversas ativas
            </span>
            <button type="button" className="text-xs text-primary hover:underline">
              Ver todas
            </button>
          </div>
        </aside>

        {/* chat panel */}
        <section className="flex min-w-0 flex-1 flex-col">
          {/* chat header */}
          <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative">
                <Avatar convo={active} size={44} />
                {active.online && (
                  <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-primary" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-display text-base font-semibold text-foreground">
                    {active.name}
                  </p>
                  {active.verified && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      <BadgeCheck className="size-3.5" />
                      Verificado
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-muted-foreground">{active.presence}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                aria-label="Mais opções"
                className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
              >
                <MoreVertical className="size-5" />
              </button>
            </div>
          </div>

          {/* pinned event banner */}
          {active.banner && bannerOpen && (
            <div className="flex flex-wrap items-center gap-3 border-b border-border bg-secondary/30 px-6 py-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Receipt className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{active.banner.title}</p>
                <p className="truncate text-xs text-muted-foreground">{active.banner.subtitle}</p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-foreground">
                <span className="size-1.5 rounded-full bg-primary" />
                Aguardando Resposta
              </span>
              <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                <Users className="size-3.5" />
                {active.banner.guests}
              </span>
              <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                <Receipt className="size-3.5" />
                {active.banner.budget}
              </span>
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setToast('Detalhes do pedido de orçamento.')}
                  className="rounded-lg border border-primary/40 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  Ver Detalhes
                </button>
                <button
                  type="button"
                  aria-label="Fechar"
                  onClick={() => setBannerOpen(false)}
                  className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* thread */}
          <div ref={threadRef} className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto max-w-3xl">
              <div className="mb-6 flex justify-center">
                <span className="rounded-full bg-secondary/50 px-3 py-1 text-xs text-muted-foreground">
                  {active.dateLabel}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {active.messages.map((m) => (
                  <MessageBubble key={m.id} message={m} convo={active} />
                ))}
              </div>
            </div>
          </div>

          {/* composer */}
          <div className="shrink-0 px-6 pb-4">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-end gap-2 rounded-2xl border border-primary/30 bg-card px-3 py-2">
                <button
                  type="button"
                  aria-label="Anexar arquivo"
                  className="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Paperclip className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label="Enviar imagem"
                  className="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ImageIcon className="size-5" />
                </button>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onComposerKeyDown}
                  rows={1}
                  placeholder={`${COMPOSER.placeholderPrefix} ${active.shortName}...`}
                  className="max-h-32 min-h-9 flex-1 resize-none bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  aria-label="Emoji"
                  className="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Smile className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label="Enviar mensagem"
                  onClick={handleSend}
                  disabled={!draft.trim()}
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
                >
                  <Send className="size-4" />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between px-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Link2 className="size-3.5" />
                  {COMPOSER.secureNote}
                </span>
                <span className="hidden sm:block">{COMPOSER.hint}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-primary/30 bg-card px-4 py-3 text-sm text-foreground shadow-xl">
          {toast}
        </div>
      )}
    </div>
  )
}

function Avatar({ convo, size }: { convo: { avatar: string; name: string }; size: number }) {
  if (!convo.avatar) {
    const initials = convo.name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
    return (
      <span
        className="grid shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-muted-foreground"
        style={{ width: size, height: size }}
      >
        {initials}
      </span>
    )
  }
  return (
    <Image
      src={convo.avatar}
      alt={convo.name}
      width={size}
      height={size}
      className="shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  )
}

function ConversationRow({
  convo,
  active,
  muted,
  onSelect,
}: {
  convo: (typeof import('./messages-data'))['CONVERSATIONS'][number]
  active: boolean
  muted?: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors',
        active ? 'bg-secondary/70' : 'hover:bg-secondary/40',
        muted && 'opacity-60',
      )}
    >
      <div className="relative">
        <Avatar convo={convo} size={44} />
        {convo.online && (
          <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-primary" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              'truncate text-sm',
              active ? 'font-semibold text-foreground' : 'font-medium text-foreground',
              muted && 'text-muted-foreground line-through',
            )}
          >
            {convo.shortName}
          </p>
          <span className="shrink-0 text-xs text-muted-foreground">{convo.timestamp}</span>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{convo.preview}</p>
        <div className="mt-1.5 flex items-center gap-2">
          {convo.tag && (
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              {convo.tag}
            </span>
          )}
          {convo.unread > 0 && (
            <span className="ml-auto grid size-5 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {convo.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

function MessageBubble({
  message,
  convo,
}: {
  message: (typeof import('./messages-data'))['CONVERSATIONS'][number]['messages'][number]
  convo: { avatar: string; name: string; shortName: string }
}) {
  if (message.from === 'system') {
    return (
      <div className="flex justify-center">
        <span className="rounded-full bg-secondary/50 px-3 py-1 text-xs text-muted-foreground">
          {message.text}
        </span>
      </div>
    )
  }

  const isVendor = message.from === 'vendor'

  return (
    <div className={cn('flex flex-col gap-1', isVendor ? 'items-start' : 'items-end')}>
      <p className="px-1 text-xs text-muted-foreground">
        {isVendor ? convo.shortName : 'Você'} · {message.time}
      </p>
      <div className={cn('flex max-w-[80%] items-end gap-2', isVendor ? '' : 'flex-row-reverse')}>
        <Avatar convo={convo} size={28} />
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed',
            isVendor
              ? 'rounded-tl-sm bg-secondary/70 text-foreground'
              : 'rounded-tr-sm bg-primary/15 text-foreground',
          )}
        >
          {message.text && <p className="whitespace-pre-line">{message.text}</p>}

          {message.linkCard && (
            <a
              href={message.linkCard.href}
              className="mt-3 flex items-center gap-2 rounded-xl border border-primary/30 bg-background/40 px-3 py-2.5 text-sm text-primary transition-colors hover:bg-background/70"
            >
              <Link2 className="size-4 shrink-0" />
              <span className="truncate">{message.linkCard.label}</span>
              <ExternalLink className="ml-auto size-4 shrink-0" />
            </a>
          )}

          {message.imageSrc && (
            <div className="mt-3 overflow-hidden rounded-xl">
              <Image
                src={message.imageSrc}
                alt="Prévia enviada"
                width={420}
                height={260}
                className="h-auto w-full max-w-sm object-cover"
              />
            </div>
          )}
        </div>
      </div>
      {message.status && (
        <span className="flex items-center gap-1 px-1 text-xs text-muted-foreground">
          {message.status === 'Lida' || message.status === 'Entregue' ? (
            <CheckCheck className="size-3.5 text-primary" />
          ) : (
            <Check className="size-3.5" />
          )}
          {message.status}
        </span>
      )}
    </div>
  )
}
