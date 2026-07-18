'use client'

import { useMemo, useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import {
  ArrowLeft,
  BadgeCheck,
  CalendarCheck,
  ChevronDown,
  Eye,
  FileText,
  Info,
  Laptop,
  Link2,
  Paperclip,
  Save,
  SendHorizonal,
  Shirt,
  Utensils,
  X,
} from 'lucide-react'

import { BrandMark } from '@/components/brand/brand-mark'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import {
  CATEGORY_OPTIONS,
  CLAUSE_CHIPS,
  OPPORTUNITIES,
  PAYMENT_OPTIONS,
  PROPOSAL_DEFAULTS,
  SUPPLIER_USER,
  VALIDITY_OPTIONS,
  type ProposalItem,
} from '../data/supplier-data'

const OPP_ICONS = {
  shirt: Shirt,
  utensils: Utensils,
  laptop: Laptop,
} as const

const TAG_STYLES: Record<string, string> = {
  URGENTE: 'border-destructive/40 bg-destructive/10 text-destructive',
  'ALTO VALOR': 'border-primary/40 bg-primary/10 text-primary',
  RECORRENTE: 'border-border bg-muted/40 text-muted-foreground',
}

const SCOPE_CLAUSES: Record<string, string> = {
  GARANTIA: 'Garantia de 12 meses contra defeitos de fabricação.',
  'TROCA & DEVOLUÇÃO': 'Troca ou devolução em até 7 dias após o recebimento.',
  'FRETE INCLUSO': 'Frete incluso para o endereço de entrega informado.',
  'NF ELETRÔNICA': 'Emissão de nota fiscal eletrônica em todas as etapas.',
  'SUPORTE PÓS-VENDA': 'Suporte pós-venda dedicado por 90 dias.',
}

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function ProposalForm({ opportunityId }: { opportunityId: string }) {
  const router = useRouter()

  const opportunity = OPPORTUNITIES.find((o) => o.id === opportunityId) ?? OPPORTUNITIES[0]
  const defaults = PROPOSAL_DEFAULTS[opportunity.id] ?? PROPOSAL_DEFAULTS['op-1']

  const [title, setTitle] = useState(defaults.title)
  const [category, setCategory] = useState(defaults.category)
  const [deadline, setDeadline] = useState(defaults.deadline)
  const [amount, setAmount] = useState(defaults.amount)
  const [paymentTerm, setPaymentTerm] = useState(defaults.paymentTerm)
  const [validity, setValidity] = useState(defaults.validity)
  const [items, setItems] = useState<ProposalItem[]>(defaults.items)
  const [scope, setScope] = useState(defaults.scope)
  const [notes, setNotes] = useState('')
  const [attachments, setAttachments] = useState<string[]>(['ficha_tecnica_uniformes.pdf'])
  const [toast, setToast] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const itemsSubtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.qty * it.unitValue, 0),
    [items],
  )
  const total = amount

  function flash(msg: string) {
    setToast(msg)
    window.clearTimeout((flash as unknown as { t?: number }).t)
    ;(flash as unknown as { t?: number }).t = window.setTimeout(() => setToast(null), 2600)
  }

  function updateItem(id: string, patch: Partial<ProposalItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: `it-${Date.now()}`, description: '', qty: 1, unit: 'un', unitValue: 0 },
    ])
  }

  function insertClause(clause: string) {
    const text = SCOPE_CLAUSES[clause]
    setScope((prev) => (prev.includes(text) ? prev : `${prev}\n\n• ${text}`))
    flash(`Cláusula "${clause}" inserida no escopo.`)
  }

  function handleSubmit() {
    setSent(true)
    flash(
      `Proposta enviada e vinculada ao evento ${opportunity.eventCode}! O comprador foi notificado.`,
    )
    window.setTimeout(() => router.push('/fornecedor'), 1800)
  }

  const OppIcon = OPP_ICONS[opportunity.icon as keyof typeof OPP_ICONS] ?? FileText

  return (
    <div className="bg-background min-h-screen">
      {/* topbar */}
      <header className="border-border/60 bg-background/90 sticky top-0 z-30 border-b backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <BrandMark size="sm" />
          <nav className="text-muted-foreground hidden items-center gap-2 text-sm md:flex">
            <button
              type="button"
              onClick={() => router.push('/fornecedor')}
              className="hover:text-foreground transition-colors"
            >
              Início
            </button>
            <span className="text-border">/</span>
            <button
              type="button"
              onClick={() => router.push('/fornecedor')}
              className="hover:text-foreground transition-colors"
            >
              Oportunidades
            </button>
            <span className="text-border">/</span>
            <span className="text-foreground font-medium">Nova Proposta</span>
          </nav>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push('/fornecedor')}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
            >
              <ArrowLeft className="size-4" />
              Voltar
            </button>
            <div className="flex items-center gap-2">
              <Image
                src={SUPPLIER_USER.avatar || '/placeholder.svg'}
                alt={SUPPLIER_USER.name}
                width={32}
                height={32}
                className="size-8 rounded-full object-cover"
              />
              <span className="text-foreground hidden text-sm font-medium sm:inline">
                {SUPPLIER_USER.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* heading */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-3">
            <span className="border-primary/40 bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide">
              <span className="bg-primary size-1.5 rounded-full" />
              RASCUNHO
            </span>
            <span className="text-muted-foreground text-xs">Salvo automaticamente</span>
          </div>
          <h1 className="font-display text-foreground text-3xl font-semibold">
            Nova Proposta Comercial
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Preencha os detalhes abaixo para enviar sua proposta ao comprador.
          </p>
        </div>

        {/* opportunity summary */}
        <div className="border-border bg-card mb-6 rounded-xl border p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-muted/50 text-primary grid size-11 shrink-0 place-items-center rounded-lg">
                <OppIcon className="size-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-foreground font-semibold">{opportunity.title}</h2>
                  <span
                    className={cn(
                      'rounded-md border px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide',
                      TAG_STYLES[opportunity.tag],
                    )}
                  >
                    {opportunity.tag}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {opportunity.company} · {opportunity.location} · {opportunity.expires}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-xs">Orçamento disponível</p>
              <p className="font-display text-foreground text-xl font-semibold">
                {opportunity.budget}
              </p>
            </div>
          </div>

          {/* linked event association */}
          <div className="border-primary/25 bg-primary/5 mt-4 rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <Link2 className="text-primary size-3.5" />
              <span className="text-primary text-[0.65rem] font-semibold tracking-widest">
                EVENTO VINCULADO
              </span>
              <span className="bg-primary/10 text-primary ml-auto inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.65rem] font-semibold">
                <BadgeCheck className="size-3" />
                Verificado
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
              <div>
                <p className="text-foreground text-sm font-semibold">
                  {opportunity.eventName}{' '}
                  <span className="text-muted-foreground font-mono text-xs font-normal">
                    · {opportunity.eventCode}
                  </span>
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">{opportunity.clientName}</p>
              </div>
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <CalendarCheck className="text-primary size-3.5" />
                {opportunity.eventDate}
              </div>
            </div>
            <p className="border-primary/15 text-muted-foreground mt-3 border-t pt-3 text-xs">
              Esta proposta será enviada e associada automaticamente ao evento{' '}
              <span className="text-foreground">{opportunity.eventCode}</span> criado pelo cliente.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* 01 identification */}
          <Section number="01" title="Identificação da Proposta">
            <Field label="TÍTULO DA PROPOSTA">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-border bg-input text-foreground focus:border-primary h-12 w-full rounded-lg border px-4 text-sm transition-colors outline-none"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="CATEGORIA">
                <SelectBox
                  value={category}
                  onChange={setCategory}
                  options={[...CATEGORY_OPTIONS]}
                />
              </Field>
              <Field label="PRAZO DE ENTREGA">
                <input
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="border-border bg-input text-foreground focus:border-primary h-12 w-full rounded-lg border px-4 text-sm transition-colors outline-none"
                />
              </Field>
            </div>
          </Section>

          {/* 02 value */}
          <Section number="02" title="Valor Proposto">
            <div className="border-border bg-input focus-within:border-primary flex items-center gap-3 rounded-xl border px-5 py-4">
              <span className="font-display text-primary text-2xl font-semibold">R$</span>
              <div className="bg-border h-8 w-px" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="font-display text-foreground w-full bg-transparent text-2xl font-semibold outline-none"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="CONDIÇÃO DE PAGAMENTO">
                <SelectBox
                  value={paymentTerm}
                  onChange={setPaymentTerm}
                  options={[...PAYMENT_OPTIONS]}
                />
              </Field>
              <Field label="VALIDADE DA PROPOSTA">
                <SelectBox
                  value={validity}
                  onChange={setValidity}
                  options={[...VALIDITY_OPTIONS]}
                />
              </Field>
            </div>
            <div className="border-primary/30 bg-primary/5 text-muted-foreground flex items-start gap-2 rounded-lg border px-4 py-3 text-xs">
              <Info className="text-primary mt-0.5 size-4 shrink-0" />
              <p>
                Sua proposta expirará em{' '}
                <span className="text-foreground font-medium">{defaults.validUntil}</span>. O
                comprador tem até esta data para aceitar.
              </p>
            </div>
          </Section>

          {/* 03 items */}
          <Section number="03" title="Itens da Proposta">
            <div className="text-muted-foreground hidden grid-cols-[1fr_70px_70px_110px_36px] gap-3 px-1 text-[0.65rem] font-semibold tracking-widest sm:grid">
              <span>DESCRIÇÃO</span>
              <span className="text-center">QTD</span>
              <span className="text-center">UNIDADE</span>
              <span className="text-right">VALOR UNIT.</span>
              <span />
            </div>
            <div className="space-y-2">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="border-border bg-input/60 grid grid-cols-1 gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_70px_70px_110px_36px] sm:items-center"
                >
                  <input
                    value={it.description}
                    onChange={(e) => updateItem(it.id, { description: e.target.value })}
                    placeholder="Descrição do item"
                    className="text-foreground focus:border-primary h-10 rounded-md border border-transparent bg-transparent px-2 text-sm outline-none"
                  />
                  <input
                    type="number"
                    value={it.qty}
                    onChange={(e) => updateItem(it.id, { qty: Number(e.target.value) || 0 })}
                    className="text-foreground focus:border-primary h-10 rounded-md border border-transparent bg-transparent px-2 text-center text-sm outline-none"
                  />
                  <input
                    value={it.unit}
                    onChange={(e) => updateItem(it.id, { unit: e.target.value })}
                    className="text-muted-foreground focus:border-primary h-10 rounded-md border border-transparent bg-transparent px-2 text-center text-sm outline-none"
                  />
                  <div className="focus-within:border-primary flex items-center gap-1 rounded-md border border-transparent px-2">
                    <span className="text-muted-foreground text-xs">R$</span>
                    <input
                      type="number"
                      value={it.unitValue}
                      onChange={(e) =>
                        updateItem(it.id, { unitValue: Number(e.target.value) || 0 })
                      }
                      className="text-foreground h-10 w-full bg-transparent text-right text-sm outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    aria-label="Remover item"
                    onClick={() => removeItem(it.id)}
                    className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive grid size-9 place-items-center justify-self-end rounded-md transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="border-border/60 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
              <button
                type="button"
                onClick={addItem}
                className="text-primary flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-80"
              >
                <span className="text-lg leading-none">+</span> Adicionar item
              </button>
              <div className="flex items-center gap-6 text-right">
                <div>
                  <p className="text-muted-foreground text-[0.65rem] font-semibold tracking-widest">
                    SUBTOTAL
                  </p>
                  <p className="text-foreground text-sm font-medium">
                    R$ {formatBRL(itemsSubtotal)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[0.65rem] font-semibold tracking-widest">
                    IMPOSTOS (EST.)
                  </p>
                  <p className="text-muted-foreground text-sm font-medium">+ R$ 0,00</p>
                </div>
                <div>
                  <p className="text-primary text-[0.65rem] font-semibold tracking-widest">TOTAL</p>
                  <p className="font-display text-foreground text-lg font-semibold">
                    R$ {formatBRL(total)}
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* 04 scope */}
          <Section number="04" title="Escopo Técnico">
            <div className="relative">
              <textarea
                value={scope}
                onChange={(e) => setScope(e.target.value.slice(0, 2000))}
                rows={10}
                className="border-border bg-input text-foreground focus:border-primary w-full resize-none rounded-xl border p-4 font-mono text-sm leading-relaxed transition-colors outline-none"
              />
              <span className="text-muted-foreground pointer-events-none absolute right-4 bottom-3 text-xs">
                {scope.length} / 2000
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground text-xs">Inserir cláusula:</span>
              {CLAUSE_CHIPS.map((clause) => (
                <button
                  key={clause}
                  type="button"
                  onClick={() => insertClause(clause)}
                  className="border-border bg-muted/30 text-muted-foreground hover:border-primary/50 hover:text-primary rounded-md border px-3 py-1.5 text-[0.65rem] font-semibold tracking-wide transition-colors"
                >
                  {clause}
                </button>
              ))}
            </div>
          </Section>

          {/* 05 attachments */}
          <Section number="05" title="Anexos & Observações">
            <button
              type="button"
              onClick={() => {
                const name = `anexo_${attachments.length + 1}.pdf`
                setAttachments((prev) => [...prev, name])
                flash(`Arquivo "${name}" anexado.`)
              }}
              className="border-border bg-input/40 hover:border-primary/50 flex w-full flex-col items-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center transition-colors"
            >
              <span className="bg-muted/50 text-primary grid size-11 place-items-center rounded-lg">
                <Paperclip className="size-5" />
              </span>
              <span className="text-foreground text-sm font-medium">
                Arraste arquivos ou clique para anexar
              </span>
              <span className="text-muted-foreground text-xs">
                PDF, DOCX, XLSX, PNG · Máx. 10MB por arquivo
              </span>
            </button>
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachments.map((file) => (
                  <span
                    key={file}
                    className="border-primary/30 bg-primary/5 text-foreground inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs"
                  >
                    <FileText className="text-primary size-3.5" />
                    {file}
                    <button
                      type="button"
                      aria-label={`Remover ${file}`}
                      onClick={() => setAttachments((prev) => prev.filter((f) => f !== file))}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="size-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <Field label="OBSERVAÇÕES INTERNAS (não visível ao comprador)">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Notas internas, referências de custo, contatos..."
                className="border-border bg-input text-foreground placeholder:text-muted-foreground focus:border-primary w-full resize-none rounded-xl border p-4 text-sm transition-colors outline-none"
              />
            </Field>
          </Section>
        </div>

        {/* action bar */}
        <div className="border-border bg-card mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => flash('Rascunho salvo com sucesso.')}
              className="h-11 gap-2 text-sm"
            >
              <Save className="size-4" />
              Salvar Rascunho
            </Button>
            <Button
              variant="outline"
              onClick={() => flash('Abrindo pré-visualização...')}
              className="text-muted-foreground h-11 gap-2 text-sm"
            >
              <Eye className="size-4" />
              Pré-visualizar
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-muted-foreground text-[0.65rem] font-semibold tracking-widest">
                TOTAL A ENVIAR
              </p>
              <p className="font-display text-foreground text-lg font-semibold">
                R$ {formatBRL(total)}
              </p>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={sent}
              className="h-11 gap-2 px-6 text-sm font-semibold"
            >
              {sent ? 'Enviada' : 'Enviar Proposta'}
              <SendHorizonal className="size-4" />
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground mt-4 text-center text-xs">
          Ao enviar, você concorda com os{' '}
          <span className="text-primary underline underline-offset-2">Termos de Uso</span> e a{' '}
          <span className="text-primary underline underline-offset-2">Política de Propostas</span>{' '}
          da TimTim. O comprador será notificado imediatamente.
        </p>
      </main>

      <footer className="border-border/60 border-t py-6">
        <div className="text-muted-foreground mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-xs">
          <div className="flex items-center gap-2">
            <BrandMark size="sm" showWordmark={false} />
            <span>TimTim · Plataforma de Fornecedores</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Termos</span>
            <span>Privacidade</span>
            <span>Suporte</span>
            <span>© 2025</span>
          </div>
        </div>
      </footer>

      {toast && (
        <div className="border-primary/40 bg-card text-foreground fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border px-5 py-3 text-sm shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

function Section({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div className="border-border/60 flex items-center gap-3 border-b pb-3">
        <span className="bg-muted/50 text-primary grid size-7 place-items-center rounded-md text-[0.65rem] font-semibold">
          {number}
        </span>
        <h3 className="text-foreground font-semibold">{title}</h3>
      </div>
      {children}
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-muted-foreground block text-[0.65rem] font-semibold tracking-widest">
        {label}
      </label>
      {children}
    </div>
  )
}

function SelectBox({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-border bg-input text-foreground focus:border-primary h-12 w-full appearance-none rounded-lg border px-4 pr-10 text-sm transition-colors outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-card text-foreground">
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" />
    </div>
  )
}
