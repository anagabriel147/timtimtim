'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Banknote,
  BadgeCheck,
  Calendar,
  Check,
  ChevronDown,
  CircleCheck,
  Coins,
  FileText,
  Image as ImageIcon,
  Lightbulb,
  Lock,
  MessageSquareQuote,
  OctagonAlert,
  RotateCcw,
  Save,
  Scale,
  Send,
  Shield,
  Tag,
  TriangleAlert,
  UploadCloud,
  X,
} from 'lucide-react'

import { AppTopbar } from '@/components/layout/app-topbar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DISPUTE_DATA as D } from '../data/dispute-data'

const RES_ICONS = { banknote: Banknote, coins: Coins, 'rotate-ccw': RotateCcw } as const
const SEV_ICONS = {
  'circle-check': CircleCheck,
  'triangle-alert': TriangleAlert,
  'octagon-alert': OctagonAlert,
} as const
const FILE_ICONS = { 'file-text': FileText, image: ImageIcon } as const

function SectionCard({
  icon: Icon,
  title,
  subtitle,
  badge,
  children,
}: {
  icon: React.ElementType
  title: string
  subtitle: string
  badge?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-border bg-card/40 p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" />
          </span>
          <div>
            <h2 className="font-display text-base font-semibold text-foreground">{title}</h2>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {badge}
      </div>
      {children}
    </section>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
      {children}
    </label>
  )
}

export function DisputeClient() {
  const router = useRouter()

  const [contractId, setContractId] = useState('ct-089')
  const [disputeValue, setDisputeValue] = useState('12000')
  const [incidentDate, setIncidentDate] = useState('2025-06-14')
  const [category, setCategory] = useState('')
  const [severity, setSeverity] = useState('medio')
  const [statement, setStatement] = useState('')
  const [files, setFiles] = useState(D.uploadedFiles.map((f) => f.id))
  const [resolution, setResolution] = useState('total')
  const [requestedValue, setRequestedValue] = useState('12000')
  const [notes, setNotes] = useState('')
  const [legal, setLegal] = useState<boolean[]>([false, false, false])
  const [submitted, setSubmitted] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)

  const contract = useMemo(
    () => D.contracts.find((c) => c.id === contractId) ?? D.contracts[0],
    [contractId],
  )

  const charCount = statement.length
  const charPct = Math.min(100, Math.round((charCount / D.maxChars) * 100))
  const minReached = charCount >= D.minChars
  const allLegal = legal.every(Boolean)
  const canSubmit = Boolean(contractId) && Boolean(category) && minReached && allLegal

  const toggleLegal = (i: number) =>
    setLegal((prev) => prev.map((v, idx) => (idx === i ? !v : v)))

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f !== id))

  function handleSubmit() {
    if (!canSubmit) return
    setSubmitted(true)
    setTimeout(() => router.push('/cliente/contratos'), 2600)
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <AppTopbar activeLabel="Disputas" />

      <main className="mx-auto w-full max-w-3xl px-4 pb-40 pt-8 sm:px-6">
        {/* breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
          {D.breadcrumb.map((b, i) => (
            <span key={b} className="flex items-center gap-2">
              {i > 0 && <span className="text-border">/</span>}
              <span className={i === D.breadcrumb.length - 1 ? 'text-foreground' : ''}>{b}</span>
            </span>
          ))}
        </nav>

        {/* header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <span className="size-1.5 rounded-full bg-primary" />
              {D.eyebrow}
              <span className="ml-1 font-normal normal-case tracking-normal text-muted-foreground">
                {D.arbitrage}
              </span>
            </div>
            <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
              {D.titleLead} <span className="text-muted-foreground">{D.titleAccent}</span>
            </h1>
            <p className="mt-2 max-w-xl text-pretty text-sm text-muted-foreground">{D.subtitle}</p>
          </div>
          <div className="hidden shrink-0 flex-col items-center gap-1 rounded-xl border border-border bg-card/40 px-4 py-3 text-center sm:flex">
            <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
              <Shield className="size-4" />
            </span>
            <span className="mt-1 text-xs font-medium text-foreground">{D.badge.title}</span>
            <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              {D.badge.caption}
            </span>
          </div>
        </div>

        {/* stepper */}
        <div className="mb-8 flex items-center gap-2">
          {D.steps.map((s, i) => {
            const active = i <= 1
            return (
              <div key={s.id} className="flex flex-1 items-center gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'grid size-6 place-items-center rounded-full text-[11px] font-semibold',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border text-muted-foreground',
                    )}
                  >
                    {s.id}
                  </span>
                  <span
                    className={cn(
                      'text-xs',
                      active ? 'font-medium text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < D.steps.length - 1 && (
                  <span
                    className={cn('h-px flex-1', i === 0 ? 'bg-primary/50' : 'bg-border')}
                  />
                )}
              </div>
            )
          })}
        </div>

        <div className="space-y-5">
          {/* 1. Identificação */}
          <SectionCard
            icon={Scale}
            title="Identificação do Evento"
            subtitle="Vincule esta disputa ao contrato e evento correspondente"
            badge={
              <span className="rounded-md border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                Obrigatório
              </span>
            }
          >
            <FieldLabel>Contrato vinculado</FieldLabel>
            <div className="relative">
              <select
                value={contractId}
                onChange={(e) => {
                  const c = D.contracts.find((x) => x.id === e.target.value)
                  setContractId(e.target.value)
                  if (c) {
                    setDisputeValue(String(c.valueNumber))
                    setRequestedValue(String(c.valueNumber))
                  }
                }}
                className="w-full appearance-none rounded-lg border-l-2 border-l-primary border-y border-r border-border bg-input px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
              >
                {D.contracts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.event}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            {/* contract summary strip */}
            <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-lg border-l-2 border-l-primary border-y border-r border-border bg-card/60 px-4 py-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Evento</p>
                <p className="text-sm font-medium text-foreground">{contract.event}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Fornecedor
                </p>
                <p className="text-sm font-medium text-foreground">{contract.vendor}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Valor contratado
                </p>
                <p className="text-sm font-medium text-primary">{contract.value}</p>
              </div>
              {contract.verified && (
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  <BadgeCheck className="size-3.5" />
                  Verificado
                </span>
              )}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Valor em disputa (R$)</FieldLabel>
                <div className="flex items-center rounded-lg border border-border bg-input px-3">
                  <span className="text-sm text-muted-foreground">R$</span>
                  <input
                    value={disputeValue}
                    onChange={(e) => setDisputeValue(e.target.value.replace(/\D/g, ''))}
                    inputMode="numeric"
                    className="w-full bg-transparent px-2 py-3 text-sm text-foreground outline-none"
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Data do incidente</FieldLabel>
                <div className="flex items-center rounded-lg border border-border bg-input px-3">
                  <Calendar className="size-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full bg-transparent px-2 py-3 text-sm text-foreground outline-none [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* 2. Categoria & Gravidade */}
          <SectionCard
            icon={Tag}
            title="Categoria & Gravidade da Reclamação"
            subtitle="Classifique o tipo e a severidade da falha de serviço"
          >
            <FieldLabel>Categoria da disputa</FieldLabel>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={cn(
                  'w-full appearance-none rounded-lg border-l-2 border-l-primary border-y border-r border-border bg-input px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary',
                  category ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                <option value="">Selecione a categoria do problema...</option>
                {D.categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            <div className="mt-5">
              <FieldLabel>Gravidade do impacto</FieldLabel>
              <div className="space-y-3">
                {D.severities.map((s) => {
                  const SevIcon = SEV_ICONS[s.icon as keyof typeof SEV_ICONS]
                  const active = severity === s.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSeverity(s.id)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors',
                        active ? cn(s.ring, s.bg) : 'border-border bg-card/40 hover:border-muted-foreground/40',
                      )}
                    >
                      <span className={cn('grid size-8 shrink-0 place-items-center rounded-lg', s.bg, s.tone)}>
                        <SevIcon className="size-4" />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-medium text-foreground">{s.label}</span>
                        <span className="block text-xs text-muted-foreground">{s.desc}</span>
                      </span>
                      <span
                        className={cn(
                          'grid size-4 shrink-0 place-items-center rounded-full border',
                          active ? 'border-primary bg-primary' : 'border-muted-foreground/50',
                        )}
                      >
                        {active && <span className="size-1.5 rounded-full bg-primary-foreground" />}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </SectionCard>

          {/* 3. Declaração formal */}
          <SectionCard
            icon={MessageSquareQuote}
            title="Declaração Formal de Reclamação"
            subtitle="Sua deposição oficial — seja factual e detalhado"
            badge={
              <span className="text-xs text-muted-foreground">
                {charCount} / {D.maxChars}
              </span>
            }
          >
            <div className="mb-3 grid gap-2 rounded-lg border border-border bg-card/40 p-3 sm:grid-cols-2">
              {D.statementTips.map((t) => (
                <p key={t} className="flex items-start gap-2 border-l-2 border-primary/50 pl-2 text-xs text-muted-foreground">
                  <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  {t}
                </p>
              ))}
            </div>
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value.slice(0, D.maxChars))}
              rows={7}
              placeholder={D.statementPlaceholder}
              className="w-full resize-y rounded-lg border border-border bg-input px-4 py-3 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-primary"
            />
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className={cn('flex items-center gap-1.5', minReached ? 'text-primary' : 'text-muted-foreground')}>
                <span className={cn('size-1.5 rounded-full', minReached ? 'bg-primary' : 'bg-muted-foreground')} />
                Mínimo de {D.minChars} caracteres requerido
              </span>
              <span className="text-muted-foreground">{charPct}%</span>
            </div>
          </SectionCard>

          {/* 4. Cofre de evidências */}
          <SectionCard
            icon={ImageIcon}
            title="Cofre de Evidências"
            subtitle="Anexe provas documentais — contrato, fotos, mensagens"
            badge={
              <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                {files.length} / {D.maxFiles}
              </span>
            }
          >
            <div className="rounded-xl border border-dashed border-border bg-card/40 px-4 py-8 text-center">
              <span className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                <UploadCloud className="size-5" />
              </span>
              <p className="text-sm font-medium text-foreground">Arraste arquivos aqui</p>
              <p className="text-xs text-muted-foreground">
                ou <span className="text-primary underline">clique para selecionar</span>
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {D.acceptedTypes.map((t) => (
                  <span key={t} className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <p className="mb-2 mt-4 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Arquivos carregados
            </p>
            <div className="space-y-2">
              {D.uploadedFiles
                .filter((f) => files.includes(f.id))
                .map((f) => {
                  const FIcon = FILE_ICONS[f.icon as keyof typeof FILE_ICONS]
                  return (
                    <div
                      key={f.id}
                      className="flex items-center gap-3 rounded-lg border border-border bg-card/40 px-3 py-2.5"
                    >
                      <span className="grid size-8 place-items-center rounded-md bg-primary/10 text-primary">
                        <FIcon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-foreground">{f.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {f.meta} · {f.tag}
                        </p>
                      </div>
                      <span className="flex items-center gap-1.5 text-xs text-primary">
                        <span className="size-1.5 rounded-full bg-primary" />
                        OK
                      </span>
                      <button
                        type="button"
                        aria-label={`Remover ${f.name}`}
                        onClick={() => removeFile(f.id)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  )
                })}
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-lg border border-border bg-card/40 p-3">
              <Lock className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-medium text-foreground">
                  Protocolo de Custódia Digital SHA-256
                </p>
                <p className="text-xs text-muted-foreground">
                  Todos os arquivos são registrados com hash imutável e certificação de
                  autenticidade. Uma vez enviados, não podem ser alterados ou excluídos. O árbitro
                  verificará a integridade de cada arquivo.
                </p>
              </div>
            </div>
          </SectionCard>

          {/* 5. Resolução desejada */}
          <SectionCard
            icon={Scale}
            title="Resolução Desejada"
            subtitle="Indique o que você está solicitando como compensação"
          >
            <FieldLabel>Tipo de resolução</FieldLabel>
            <div className="grid gap-3 sm:grid-cols-3">
              {D.resolutions.map((r) => {
                const RIcon = RES_ICONS[r.icon as keyof typeof RES_ICONS]
                const active = resolution === r.id
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setResolution(r.id)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-xl border px-3 py-4 text-center transition-colors',
                      active
                        ? 'border-primary/50 bg-primary/10'
                        : 'border-border bg-card/40 hover:border-muted-foreground/40',
                    )}
                  >
                    <span className={cn('text-primary', !active && 'text-muted-foreground')}>
                      <RIcon className="size-5" />
                    </span>
                    <span className="text-sm font-medium text-foreground">{r.label}</span>
                    <span className="text-[11px] text-muted-foreground">{r.desc}</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-4">
              <FieldLabel>Valor solicitado (R$)</FieldLabel>
              <div className="flex items-center rounded-lg border-l-2 border-l-primary border-y border-r border-border bg-input px-3">
                <span className="text-sm text-muted-foreground">R$</span>
                <input
                  value={requestedValue}
                  onChange={(e) => setRequestedValue(e.target.value.replace(/\D/g, ''))}
                  inputMode="numeric"
                  className="w-full bg-transparent px-2 py-3 text-sm text-foreground outline-none"
                />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Máximo: {contract.value},00 (valor total do contrato)
              </p>
            </div>

            <div className="mt-4">
              <FieldLabel>Observações adicionais (opcional)</FieldLabel>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Alguma informação adicional que o árbitro deva considerar..."
                className="w-full resize-y rounded-lg border border-border bg-input px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-primary"
              />
            </div>
          </SectionCard>

          {/* 6. Declarações legais */}
          <SectionCard
            icon={Shield}
            title="Declarações Legais & Consentimento"
            subtitle="Confirmações obrigatórias antes do envio"
          >
            <div className="space-y-3">
              {D.legalTerms.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleLegal(i)}
                  className="flex w-full items-start gap-3 text-left"
                >
                  <span
                    className={cn(
                      'mt-0.5 grid size-5 shrink-0 place-items-center rounded border transition-colors',
                      legal[i] ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/50',
                    )}
                  >
                    {legal[i] && <Check className="size-3.5" />}
                  </span>
                  <span className="text-sm text-muted-foreground">{t}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-lg border border-border bg-card/40 p-3">
              <Shield className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-medium text-foreground">{D.confidentialNote.title}</p>
                <p className="text-xs text-muted-foreground">{D.confidentialNote.desc}</p>
              </div>
            </div>
          </SectionCard>
        </div>
      </main>

      {/* fixed bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                <Scale className="size-4" />
              </span>
              <div className="text-xs">
                <p className="font-medium text-foreground">Nova Disputa</p>
                <p className="text-muted-foreground">
                  {contract.event} · {contract.value}
                </p>
              </div>
              <div className="ml-2 hidden gap-3 text-[11px] sm:flex">
                <span className="flex items-center gap-1 text-primary">
                  <CircleCheck className="size-3.5" />
                  {files.length} evidências
                </span>
                <span className={cn('flex items-center gap-1', allLegal ? 'text-primary' : 'text-muted-foreground')}>
                  <span className={cn('size-1.5 rounded-full', allLegal ? 'bg-primary' : 'bg-muted-foreground')} />
                  {allLegal ? 'Declarações OK' : 'Declaração pendente'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDraftSaved(true)
                  setTimeout(() => setDraftSaved(false), 2000)
                }}
                className="h-11 gap-2 text-sm"
              >
                <Save className="size-4" />
                {draftSaved ? 'Rascunho salvo!' : 'Salvar Rascunho'}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="h-11 gap-2 text-sm font-semibold"
              >
                {submitted ? <Check className="size-4" /> : <Send className="size-4" />}
                {submitted ? 'Disputa enviada!' : 'Enviar Disputa para Arbitragem'}
                {!submitted && <ArrowRight className="size-4" />}
              </Button>
            </div>
          </div>
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <TriangleAlert className="size-3.5 text-amber-400" />
            Ao enviar, sua disputa ficará bloqueada para edição. O fornecedor será notificado e terá{' '}
            <span className="font-medium text-foreground">72 horas</span> para responder. Esta ação
            é irreversível.
          </p>
        </div>
      </div>

      {/* success overlay */}
      {submitted && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur">
          <div className="w-full max-w-md rounded-2xl border border-primary/30 bg-card p-8 text-center">
            <span className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
              <Check className="size-8" />
            </span>
            <h2 className="font-display text-xl font-semibold text-foreground">
              Disputa enviada para arbitragem
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Protocolo <span className="font-medium text-primary">#DP-2025-0142</span> criado. O
              fornecedor {contract.vendor} foi notificado e tem 72 horas para responder.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Redirecionando para os seus contratos...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
