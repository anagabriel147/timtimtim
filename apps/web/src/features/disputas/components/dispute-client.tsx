'use client'

import { useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  ArrowRight,
  Banknote,
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
import { useContracts } from '@/features/contratos'
import { createDispute } from '@/lib/api'
import { cn } from '@/lib/utils'

import { DISPUTE_DATA as D } from '../data/dispute-data'

const CATEGORY_TO_ENUM: Record<string, string> = {
  'Serviço não entregue': 'servico_nao_entregue',
  'Qualidade abaixo do contratado': 'qualidade_abaixo',
  'Atraso ou descumprimento de prazo': 'atraso_descumprimento',
  'Cobrança indevida': 'cobranca_indevida',
  'Cancelamento unilateral': 'cancelamento_unilateral',
  'Danos materiais no evento': 'danos_materiais',
  Outro: 'outro',
}

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
    <section className="border-border bg-card/40 rounded-2xl border p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="bg-primary/10 text-primary grid size-9 shrink-0 place-items-center rounded-lg">
            <Icon className="size-4" />
          </span>
          <div>
            <h2 className="font-display text-foreground text-base font-semibold">{title}</h2>
            <p className="text-muted-foreground text-xs">{subtitle}</p>
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
    <label className="text-muted-foreground mb-2 block text-[11px] font-medium tracking-wider uppercase">
      {children}
    </label>
  )
}

export function DisputeClient() {
  const router = useRouter()
  const { contracts, loading: contractsLoading } = useContracts()

  const [contractId, setContractId] = useState('')
  const [disputeValue, setDisputeValue] = useState('0')
  const [incidentDate, setIncidentDate] = useState('')
  const [category, setCategory] = useState('')
  const [severity, setSeverity] = useState('medio')
  const [statement, setStatement] = useState('')
  const [files, setFiles] = useState(D.uploadedFiles.map((f) => f.id))
  const [resolution, setResolution] = useState('total')
  const [requestedValue, setRequestedValue] = useState('0')
  const [notes, setNotes] = useState('')
  const [legal, setLegal] = useState<boolean[]>([false, false, false])
  const [submitted, setSubmitted] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [disputeId, setDisputeId] = useState<number | null>(null)

  useEffect(() => {
    if (contracts.length > 0 && !contractId) {
      setContractId(contracts[0].id)
      const raw = Number.parseFloat(contracts[0].value.replace(/[^\d,]/g, '').replace(',', '.'))
      if (!Number.isNaN(raw)) {
        setDisputeValue(String(raw))
        setRequestedValue(String(raw))
      }
    }
  }, [contracts, contractId])

  const contract = useMemo(
    () => contracts.find((c) => c.id === contractId) ?? contracts[0],
    [contractId, contracts],
  )

  const charCount = statement.length
  const charPct = Math.min(100, Math.round((charCount / D.maxChars) * 100))
  const minReached = charCount >= D.minChars
  const allLegal = legal.every(Boolean)
  const canSubmit = Boolean(contractId) && Boolean(category) && minReached && allLegal

  const toggleLegal = (i: number) => setLegal((prev) => prev.map((v, idx) => (idx === i ? !v : v)))

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f !== id))

  async function handleSubmit() {
    if (!canSubmit || !contract) return
    setSubmitError(null)
    setSubmitting(true)
    try {
      const created = await createDispute({
        contract_id: Number(contractId),
        category: CATEGORY_TO_ENUM[category] ?? 'outro',
        severity,
        incident_date: incidentDate || null,
        statement_text: statement,
        requested_resolution: resolution,
        requested_value: Number(requestedValue) || null,
      })
      setDisputeId(created.id)
      setSubmitted(true)
      setTimeout(() => router.push('/contratante/contratos'), 2600)
    } catch {
      setSubmitError('Não foi possível enviar a disputa. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (contractsLoading) {
    return (
      <div className="bg-background flex min-h-svh flex-col">
        <AppTopbar activeLabel="Disputas" />
        <main className="text-muted-foreground mx-auto w-full max-w-3xl px-6 py-16 text-center text-sm">
          Carregando...
        </main>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="bg-background flex min-h-svh flex-col">
        <AppTopbar activeLabel="Disputas" />
        <main className="mx-auto w-full max-w-3xl px-6 py-16 text-center">
          <p className="text-foreground font-display text-xl font-semibold">
            Você ainda não tem contratos
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Uma disputa precisa estar vinculada a um contrato existente.
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-background flex min-h-svh flex-col">
      <AppTopbar activeLabel="Disputas" />

      <main className="mx-auto w-full max-w-3xl px-4 pt-8 pb-40 sm:px-6">
        {/* breadcrumb */}
        <nav className="text-muted-foreground mb-4 flex items-center gap-2 text-xs">
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
            <div className="border-primary/40 bg-primary/10 text-primary mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wider uppercase">
              <span className="bg-primary size-1.5 rounded-full" />
              {D.eyebrow}
              <span className="text-muted-foreground ml-1 font-normal tracking-normal normal-case">
                {D.arbitrage}
              </span>
            </div>
            <h1 className="font-display text-foreground text-3xl font-semibold sm:text-4xl">
              {D.titleLead} <span className="text-muted-foreground">{D.titleAccent}</span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl text-sm text-pretty">{D.subtitle}</p>
          </div>
          <div className="border-border bg-card/40 hidden shrink-0 flex-col items-center gap-1 rounded-xl border px-4 py-3 text-center sm:flex">
            <span className="bg-primary/10 text-primary grid size-9 place-items-center rounded-lg">
              <Shield className="size-4" />
            </span>
            <span className="text-foreground mt-1 text-xs font-medium">{D.badge.title}</span>
            <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-[10px]">
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
                        : 'border-border text-muted-foreground border',
                    )}
                  >
                    {s.id}
                  </span>
                  <span
                    className={cn(
                      'text-xs',
                      active ? 'text-foreground font-medium' : 'text-muted-foreground',
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < D.steps.length - 1 && (
                  <span className={cn('h-px flex-1', i === 0 ? 'bg-primary/50' : 'bg-border')} />
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
              <span className="border-border text-muted-foreground rounded-md border px-2 py-0.5 text-[10px]">
                Obrigatório
              </span>
            }
          >
            <FieldLabel>Contrato vinculado</FieldLabel>
            <div className="relative">
              <select
                value={contractId}
                onChange={(e) => {
                  const c = contracts.find((x) => x.id === e.target.value)
                  setContractId(e.target.value)
                  if (c) {
                    const raw = Number.parseFloat(c.value.replace(/[^\d,]/g, '').replace(',', '.'))
                    if (!Number.isNaN(raw)) {
                      setDisputeValue(String(raw))
                      setRequestedValue(String(raw))
                    }
                  }
                }}
                className="border-l-primary border-border bg-input text-foreground focus:ring-primary w-full appearance-none rounded-lg border-y border-r border-l-2 px-4 py-3 text-sm outline-none focus:ring-1"
              >
                {contracts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.contractCode} — {c.event}
                  </option>
                ))}
              </select>
              <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
            </div>

            {/* contract summary strip */}
            <div className="border-l-primary border-border bg-card/60 mt-3 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-lg border-y border-r border-l-2 px-4 py-3">
              <div>
                <p className="text-muted-foreground text-[10px] tracking-wider uppercase">Evento</p>
                <p className="text-foreground text-sm font-medium">{contract.event}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
                  Fornecedor
                </p>
                <p className="text-foreground text-sm font-medium">{contract.vendor}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
                  Valor contratado
                </p>
                <p className="text-primary text-sm font-medium">{contract.value}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Valor em disputa (R$)</FieldLabel>
                <div className="border-border bg-input flex items-center rounded-lg border px-3">
                  <span className="text-muted-foreground text-sm">R$</span>
                  <input
                    value={disputeValue}
                    onChange={(e) => setDisputeValue(e.target.value.replace(/\D/g, ''))}
                    inputMode="numeric"
                    className="text-foreground w-full bg-transparent px-2 py-3 text-sm outline-none"
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Data do incidente</FieldLabel>
                <div className="border-border bg-input flex items-center rounded-lg border px-3">
                  <Calendar className="text-muted-foreground size-4" />
                  <input
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="text-foreground w-full bg-transparent px-2 py-3 text-sm [color-scheme:dark] outline-none"
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
                  'border-l-primary border-border bg-input focus:ring-primary w-full appearance-none rounded-lg border-y border-r border-l-2 px-4 py-3 text-sm outline-none focus:ring-1',
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
              <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
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
                        active
                          ? cn(s.ring, s.bg)
                          : 'border-border bg-card/40 hover:border-muted-foreground/40',
                      )}
                    >
                      <span
                        className={cn(
                          'grid size-8 shrink-0 place-items-center rounded-lg',
                          s.bg,
                          s.tone,
                        )}
                      >
                        <SevIcon className="size-4" />
                      </span>
                      <span className="flex-1">
                        <span className="text-foreground block text-sm font-medium">{s.label}</span>
                        <span className="text-muted-foreground block text-xs">{s.desc}</span>
                      </span>
                      <span
                        className={cn(
                          'grid size-4 shrink-0 place-items-center rounded-full border',
                          active ? 'border-primary bg-primary' : 'border-muted-foreground/50',
                        )}
                      >
                        {active && <span className="bg-primary-foreground size-1.5 rounded-full" />}
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
              <span className="text-muted-foreground text-xs">
                {charCount} / {D.maxChars}
              </span>
            }
          >
            <div className="border-border bg-card/40 mb-3 grid gap-2 rounded-lg border p-3 sm:grid-cols-2">
              {D.statementTips.map((t) => (
                <p
                  key={t}
                  className="border-primary/50 text-muted-foreground flex items-start gap-2 border-l-2 pl-2 text-xs"
                >
                  <Lightbulb className="text-primary mt-0.5 size-3.5 shrink-0" />
                  {t}
                </p>
              ))}
            </div>
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value.slice(0, D.maxChars))}
              rows={7}
              placeholder={D.statementPlaceholder}
              className="border-border bg-input text-foreground placeholder:text-muted-foreground/60 focus:ring-primary w-full resize-y rounded-lg border px-4 py-3 text-sm leading-relaxed outline-none focus:ring-1"
            />
            <div className="mt-2 flex items-center justify-between text-xs">
              <span
                className={cn(
                  'flex items-center gap-1.5',
                  minReached ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <span
                  className={cn(
                    'size-1.5 rounded-full',
                    minReached ? 'bg-primary' : 'bg-muted-foreground',
                  )}
                />
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
              <span className="border-primary/30 bg-primary/10 text-primary rounded-md border px-2 py-0.5 text-[10px]">
                {files.length} / {D.maxFiles}
              </span>
            }
          >
            <div className="border-border bg-card/40 rounded-xl border border-dashed px-4 py-8 text-center">
              <span className="bg-primary/10 text-primary mx-auto mb-3 grid size-12 place-items-center rounded-full">
                <UploadCloud className="size-5" />
              </span>
              <p className="text-foreground text-sm font-medium">Arraste arquivos aqui</p>
              <p className="text-muted-foreground text-xs">
                ou <span className="text-primary underline">clique para selecionar</span>
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {D.acceptedTypes.map((t) => (
                  <span
                    key={t}
                    className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-[10px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-muted-foreground mt-4 mb-2 text-[11px] font-medium tracking-wider uppercase">
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
                      className="border-border bg-card/40 flex items-center gap-3 rounded-lg border px-3 py-2.5"
                    >
                      <span className="bg-primary/10 text-primary grid size-8 place-items-center rounded-md">
                        <FIcon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground truncate text-sm">{f.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {f.meta} · {f.tag}
                        </p>
                      </div>
                      <span className="text-primary flex items-center gap-1.5 text-xs">
                        <span className="bg-primary size-1.5 rounded-full" />
                        OK
                      </span>
                      <button
                        type="button"
                        aria-label={`Remover ${f.name}`}
                        onClick={() => removeFile(f.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  )
                })}
            </div>

            <div className="border-border bg-card/40 mt-4 flex items-start gap-3 rounded-lg border p-3">
              <Lock className="text-primary mt-0.5 size-4 shrink-0" />
              <div>
                <p className="text-foreground text-xs font-medium">
                  Protocolo de Custódia Digital SHA-256
                </p>
                <p className="text-muted-foreground text-xs">
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
                    <span className="text-foreground text-sm font-medium">{r.label}</span>
                    <span className="text-muted-foreground text-[11px]">{r.desc}</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-4">
              <FieldLabel>Valor solicitado (R$)</FieldLabel>
              <div className="border-l-primary border-border bg-input flex items-center rounded-lg border-y border-r border-l-2 px-3">
                <span className="text-muted-foreground text-sm">R$</span>
                <input
                  value={requestedValue}
                  onChange={(e) => setRequestedValue(e.target.value.replace(/\D/g, ''))}
                  inputMode="numeric"
                  className="text-foreground w-full bg-transparent px-2 py-3 text-sm outline-none"
                />
              </div>
              <p className="text-muted-foreground mt-1 text-[11px]">
                Máximo: {contract?.value} (valor total do contrato)
              </p>
            </div>

            <div className="mt-4">
              <FieldLabel>Observações adicionais (opcional)</FieldLabel>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Alguma informação adicional que o árbitro deva considerar..."
                className="border-border bg-input text-foreground placeholder:text-muted-foreground/60 focus:ring-primary w-full resize-y rounded-lg border px-4 py-3 text-sm outline-none focus:ring-1"
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
                      legal[i]
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/50',
                    )}
                  >
                    {legal[i] && <Check className="size-3.5" />}
                  </span>
                  <span className="text-muted-foreground text-sm">{t}</span>
                </button>
              ))}
            </div>

            <div className="border-border bg-card/40 mt-4 flex items-start gap-3 rounded-lg border p-3">
              <Shield className="text-primary mt-0.5 size-4 shrink-0" />
              <div>
                <p className="text-foreground text-xs font-medium">{D.confidentialNote.title}</p>
                <p className="text-muted-foreground text-xs">{D.confidentialNote.desc}</p>
              </div>
            </div>
          </SectionCard>
        </div>
      </main>

      {/* fixed bottom bar */}
      <div className="border-border bg-background/90 fixed inset-x-0 bottom-0 z-30 border-t backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="bg-primary/10 text-primary grid size-9 place-items-center rounded-lg">
                <Scale className="size-4" />
              </span>
              <div className="text-xs">
                <p className="text-foreground font-medium">Nova Disputa</p>
                <p className="text-muted-foreground">
                  {contract.event} · {contract.value}
                </p>
              </div>
              <div className="ml-2 hidden gap-3 text-[11px] sm:flex">
                <span className="text-primary flex items-center gap-1">
                  <CircleCheck className="size-3.5" />
                  {files.length} evidências
                </span>
                <span
                  className={cn(
                    'flex items-center gap-1',
                    allLegal ? 'text-primary' : 'text-muted-foreground',
                  )}
                >
                  <span
                    className={cn(
                      'size-1.5 rounded-full',
                      allLegal ? 'bg-primary' : 'bg-muted-foreground',
                    )}
                  />
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
                disabled={!canSubmit || submitting}
                className="h-11 gap-2 text-sm font-semibold"
              >
                {submitted ? <Check className="size-4" /> : <Send className="size-4" />}
                {submitted
                  ? 'Disputa enviada!'
                  : submitting
                    ? 'Enviando...'
                    : 'Enviar Disputa para Arbitragem'}
                {!submitted && !submitting && <ArrowRight className="size-4" />}
              </Button>
            </div>
          </div>
          {submitError && <p className="text-destructive text-[11px]">{submitError}</p>}
          <p className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
            <TriangleAlert className="size-3.5 text-amber-400" />
            Ao enviar, sua disputa ficará bloqueada para edição. O fornecedor será notificado e terá{' '}
            <span className="text-foreground font-medium">72 horas</span> para responder. Esta ação
            é irreversível.
          </p>
        </div>
      </div>

      {/* success overlay */}
      {submitted && (
        <div className="bg-background/80 fixed inset-0 z-50 grid place-items-center p-4 backdrop-blur">
          <div className="border-primary/30 bg-card w-full max-w-md rounded-2xl border p-8 text-center">
            <span className="bg-primary/10 text-primary mx-auto mb-4 grid size-16 place-items-center rounded-full">
              <Check className="size-8" />
            </span>
            <h2 className="font-display text-foreground text-xl font-semibold">
              Disputa enviada para arbitragem
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Protocolo <span className="text-primary font-medium">#DP-{disputeId}</span> criado. O
              fornecedor {contract.vendor} foi notificado e tem 72 horas para responder.
            </p>
            <p className="text-muted-foreground mt-4 text-xs">
              Redirecionando para os seus contratos...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
