'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import Image from 'next/image'

import {
  BadgeCheck,
  Calendar,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Link2,
  MoreVertical,
  Paperclip,
  Phone,
  Receipt,
  Search,
  Send,
  SlidersHorizontal,
  Smile,
  SquarePen,
  Users,
  X,
} from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  SUPPLIER_CHAT_COMPOSER,
  SUPPLIER_CHAT_FILTERS,
  SUPPLIER_CONVERSATIONS,
  type SupplierChatMessage,
  type SupplierConversation,
} from '../data/supplier-chat-data'

import { SupplierTopbar } from './supplier-topbar'

function nowTime() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function initialConversations(): SupplierConversation[] {
  return SUPPLIER_CONVERSATIONS.map((c) => ({ ...c, messages: c.messages.map((m) => ({ ...m })) }))
}

export function SupplierMessagesClient() {
  const [conversations, setConversations] = useState<SupplierConversation[]>(initialConversations)
  const [activeId, setActiveId] = useState<string>(
    SUPPLIER_CONVERSATIONS.find((c) => c.active)?.id ?? SUPPLIER_CONVERSATIONS[0].id,
  )
  const [filter, setFilter] = useState<(typeof SUPPLIER_CHAT_FILTERS)[number]>('Todos')
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

  const activeConvos = useMemo(() => conversations.filter((c) => !c.archived), [conversations])
  const archivedConvos = useMemo(() => conversations.filter((c) => c.archived), [conversations])

  const matchesFilter = (hasProposal?: boolean) => {
    if (filter === 'Propostas') return Boolean(hasProposal)
    return true
  }

  const visibleActive = activeConvos.filter(
    (c) =>
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase())) &&
      matchesFilter(Boolean(c.banner)),
  )

  const markRead = (id: string) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)))
  }

  const handleSelect = (id: string) => {
    setActiveId(id)
    markRead(id)
    setBannerOpen(true)
  }

  const handleSend = () => {
    const trimmed = draft.trim()
    if (!trimmed) return
    const message: SupplierChatMessage = {
      id: `s-${Date.now()}`,
      from: 'supplier',
      time: nowTime(),
      text: trimmed,
      status: 'Enviada',
    }
    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              messages: [...c.messages, message],
              preview: `Você: ${trimmed}`,
              timestamp: message.time,
            }
          : c,
      ),
    )
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
    <div className="bg-background flex h-svh flex-col overflow-hidden">
      <SupplierTopbar active="Mensagens" onUnavailable={(l) => setToast(`${l} em breve.`)} />

      <div className="flex min-h-0 flex-1">
        {/* sidebar */}
        <aside className="border-border hidden w-80 shrink-0 flex-col border-r lg:flex">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h1 className="font-display text-foreground text-lg font-semibold">Mensagens</h1>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Filtrar"
                onClick={() => setToast('Filtros avançados em breve.')}
                className="text-muted-foreground hover:bg-secondary/60 hover:text-foreground grid size-8 place-items-center rounded-lg transition-colors"
              >
                <SlidersHorizontal className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Nova conversa"
                onClick={() => setToast('Nova conversa: selecione um cliente para iniciar.')}
                className="text-muted-foreground hover:bg-secondary/60 hover:text-foreground grid size-8 place-items-center rounded-lg transition-colors"
              >
                <SquarePen className="size-4" />
              </button>
            </div>
          </div>

          <div className="px-5">
            <div className="border-border bg-secondary/40 flex items-center gap-2 rounded-xl border px-3">
              <Search className="text-muted-foreground size-4" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar clientes..."
                className="text-foreground placeholder:text-muted-foreground h-10 w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2 px-5 py-3">
            {SUPPLIER_CHAT_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  filter === f
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                )}
              >
                {f}
              </button>
            ))}
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

            {archivedConvos.length > 0 && (
              <>
                <p className="text-muted-foreground px-3 pt-4 pb-2 text-xs font-medium tracking-wider uppercase">
                  Arquivadas
                </p>
                {archivedConvos.map((c) => (
                  <ConversationRow
                    key={c.id}
                    convo={c}
                    active={c.id === activeId}
                    muted
                    onSelect={() => handleSelect(c.id)}
                  />
                ))}
              </>
            )}
          </div>

          <div className="border-border flex items-center justify-between border-t px-5 py-3">
            <span className="text-muted-foreground flex items-center gap-2 text-xs">
              <span className="bg-primary size-1.5 rounded-full" />
              {activeConvos.length} conversas ativas
            </span>
            <button
              type="button"
              onClick={() => setToast('Exibindo todas as conversas.')}
              className="text-primary text-xs hover:underline"
            >
              Ver todas
            </button>
          </div>
        </aside>

        {/* chat panel */}
        <section className="flex min-w-0 flex-1 flex-col">
          <div className="border-border flex items-center justify-between gap-4 border-b px-6 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative">
                <Avatar convo={active} size={44} />
                {active.online && (
                  <span className="border-background bg-primary absolute right-0 bottom-0 size-3 rounded-full border-2" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-display text-foreground truncate text-base font-semibold">
                    {active.name}
                  </p>
                  {active.verified && (
                    <span className="bg-primary/10 text-primary flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium">
                      <BadgeCheck className="size-3.5" />
                      Verificado
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground truncate text-xs">
                  {active.company} · {active.presence}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setToast('Chamada iniciada (demonstração).')}
                className="border-border text-foreground hover:bg-secondary/60 hidden items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors sm:flex"
              >
                <Phone className="size-4" />
                Ligar
              </button>
              <button
                type="button"
                onClick={() => setToast('Abrir agenda para marcar reunião.')}
                className="border-border text-foreground hover:bg-secondary/60 hidden items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors sm:flex"
              >
                <Calendar className="size-4" />
                Agendar
              </button>
              <button
                type="button"
                aria-label="Mais opções"
                onClick={() => setToast('Mais opções em breve.')}
                className="text-muted-foreground hover:bg-secondary/60 hover:text-foreground grid size-9 place-items-center rounded-lg transition-colors"
              >
                <MoreVertical className="size-5" />
              </button>
            </div>
          </div>

          {/* pinned event banner */}
          {active.banner && bannerOpen && (
            <div className="border-border bg-secondary/30 flex flex-wrap items-center gap-3 border-b px-6 py-3">
              <span className="bg-primary/10 text-primary grid size-9 shrink-0 place-items-center rounded-lg">
                <Receipt className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-foreground text-sm font-semibold">{active.banner.title}</p>
                <p className="text-muted-foreground truncate text-xs">{active.banner.subtitle}</p>
              </div>
              <span className="border-border bg-background/60 text-foreground flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs">
                <span className="bg-primary size-1.5 rounded-full" />
                {active.banner.status}
              </span>
              <span className="text-muted-foreground hidden items-center gap-1.5 text-xs sm:flex">
                <Users className="size-3.5" />
                {active.banner.guests}
              </span>
              <span className="text-muted-foreground hidden items-center gap-1.5 text-xs sm:flex">
                <Receipt className="size-3.5" />
                {active.banner.budget}
              </span>
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setToast('Abrindo detalhes da proposta.')}
                  className="border-primary/40 text-primary hover:bg-primary/10 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
                >
                  Ver Proposta
                </button>
                <button
                  type="button"
                  aria-label="Fechar"
                  onClick={() => setBannerOpen(false)}
                  className="text-muted-foreground hover:bg-secondary/60 hover:text-foreground grid size-7 place-items-center rounded-lg transition-colors"
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
                <span className="bg-secondary/50 text-muted-foreground rounded-full px-3 py-1 text-xs">
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
              <div className="border-primary/30 bg-card flex items-end gap-2 rounded-2xl border px-3 py-2">
                <button
                  type="button"
                  aria-label="Anexar arquivo"
                  onClick={() => setToast('Anexar arquivo em breve.')}
                  className="text-muted-foreground hover:text-foreground grid size-9 shrink-0 place-items-center rounded-lg transition-colors"
                >
                  <Paperclip className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label="Enviar imagem"
                  onClick={() => setToast('Enviar imagem em breve.')}
                  className="text-muted-foreground hover:text-foreground grid size-9 shrink-0 place-items-center rounded-lg transition-colors"
                >
                  <ImageIcon className="size-5" />
                </button>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onComposerKeyDown}
                  rows={1}
                  placeholder={`${SUPPLIER_CHAT_COMPOSER.placeholderPrefix} ${active.shortName}...`}
                  className="text-foreground placeholder:text-muted-foreground max-h-32 min-h-9 flex-1 resize-none bg-transparent py-2 text-sm outline-none"
                />
                <button
                  type="button"
                  aria-label="Emoji"
                  onClick={() => setToast('Seletor de emoji em breve.')}
                  className="text-muted-foreground hover:text-foreground grid size-9 shrink-0 place-items-center rounded-lg transition-colors"
                >
                  <Smile className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label="Enviar mensagem"
                  onClick={handleSend}
                  disabled={!draft.trim()}
                  className="bg-primary text-primary-foreground grid size-10 shrink-0 place-items-center rounded-full transition-opacity disabled:opacity-40"
                >
                  <Send className="size-4" />
                </button>
              </div>
              <div className="text-muted-foreground mt-2 flex items-center justify-between px-1 text-xs">
                <span className="flex items-center gap-1.5">
                  <Link2 className="size-3.5" />
                  {SUPPLIER_CHAT_COMPOSER.secureNote}
                </span>
                <span className="hidden sm:block">{SUPPLIER_CHAT_COMPOSER.hint}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {toast && (
        <div className="border-primary/30 bg-card text-foreground fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border px-4 py-3 text-sm shadow-xl">
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
        className="bg-secondary text-muted-foreground grid shrink-0 place-items-center rounded-full text-xs font-semibold"
        style={{ width: size, height: size }}
      >
        {initials}
      </span>
    )
  }
  return (
    <Image
      src={convo.avatar || '/placeholder.svg'}
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
  convo: SupplierConversation
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
          <span className="border-background bg-primary absolute right-0 bottom-0 size-3 rounded-full border-2" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              'truncate text-sm',
              active ? 'text-foreground font-semibold' : 'text-foreground font-medium',
              muted && 'text-muted-foreground line-through',
            )}
          >
            {convo.shortName}
          </p>
          <span className="text-muted-foreground shrink-0 text-xs">{convo.timestamp}</span>
        </div>
        <p className="text-muted-foreground mt-0.5 truncate text-xs">{convo.preview}</p>
        <div className="mt-1.5 flex items-center gap-2">
          {convo.tag && (
            <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-[10px] font-medium">
              {convo.tag}
            </span>
          )}
          {convo.unread > 0 && (
            <span className="bg-primary text-primary-foreground ml-auto grid size-5 place-items-center rounded-full text-[10px] font-semibold">
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
  message: SupplierChatMessage
  convo: { avatar: string; name: string; shortName: string }
}) {
  if (message.from === 'system') {
    return (
      <div className="flex justify-center">
        <span className="bg-secondary/50 text-muted-foreground rounded-full px-3 py-1 text-xs">
          {message.text}
        </span>
      </div>
    )
  }

  const isSupplier = message.from === 'supplier'

  return (
    <div className={cn('flex items-end gap-2', isSupplier ? 'justify-end' : 'justify-start')}>
      {!isSupplier && <Avatar convo={convo} size={32} />}
      <div className={cn('max-w-[75%]', isSupplier ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line',
            isSupplier
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-secondary/70 text-foreground rounded-bl-md',
          )}
        >
          {message.text}
        </div>
        <div
          className={cn(
            'text-muted-foreground mt-1 flex items-center gap-1 px-1 text-[10px]',
            isSupplier ? 'justify-end' : 'justify-start',
          )}
        >
          <span>{message.time}</span>
          {isSupplier && message.status && (
            <span className="flex items-center gap-0.5">
              {message.status === 'Lida' ? (
                <CheckCheck className="text-primary size-3" />
              ) : message.status === 'Entregue' ? (
                <CheckCheck className="size-3" />
              ) : (
                <Check className="size-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
