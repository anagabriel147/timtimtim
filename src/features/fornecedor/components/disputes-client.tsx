'use client'

import { useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import {
  ArrowRight,
  Calendar,
  Check,
  CircleCheck,
  CircleHelp,
  Clock,
  CloudUpload,
  FileText,
  GitBranch,
  Gavel,
  Image as ImageIcon,
  Info,
  Lock,
  Quote,
  Save,
  Scale,
  SendHorizonal,
  ShieldCheck,
  TriangleAlert,
  User,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SupplierFooter, SupplierTopbar } from './supplier-topbar'

/* ------------------------------------------------------------------ */
/* Mocked data (frontend-only prototype)                               */
/* ------------------------------------------------------------------ */

const DISPUTE = {
  caseNumber: '#1042',
  event: 'Casamento Barra da Tijuca',
  status: 'AGUARDANDO DEFESA',
  deadlineHours: 72,
  deadlinePercent: 75,
  elapsedPercent: 25,
  eventDate: '14 Jun 2025',
  contractant: 'Mariana Fonseca',
  disputedValue: 'R$ 12.000',
  category: 'Serviço não entregue',
  openedAt: '22 Jun 2025',
  deadlineAt: '25 Jun 2025, 14:32',
  claim: {
    text: 'O fornecedor não entregou o serviço de buffet conforme contratado. Apenas 60% dos pratos acordados foram servidos durante o evento. O contrato estipulava 12 opções de entrada, porém apenas 7 foram disponibilizadas. Além disso, o serviço de garçons foi encerrado às 22h, duas horas antes do prazo estabelecido no contrato assinado em 02/05/2025. Solicito reembolso integral de R$ 12.000 pela inexecução parcial do contrato.',
    author: 'Mariana Fonseca',
    avatar: '/images/home/avatar-client-1.png',
    date: '22 Jun 2025, 14:32',
  },
  claimantEvidence: [
    { id: 'ce-1', name: 'Contrato_Assinado_02052025.pdf', meta: '824 KB · PDF', tag: 'Contrato', kind: 'pdf' },
    { id: 'ce-2', name: 'Fotos_Evento_Buffet.zip', meta: '18.4 MB · 23 imagens', tag: 'Fotográfico', kind: 'image' },
  ],
  timeline: [
    { id: 't-1', title: 'Contrato Assinado', detail: '02 Mai 2025 · Ambas as partes', state: 'done' },
    { id: 't-2', title: 'Evento Realizado', detail: '14 Jun 2025 · Barra da Tijuca, RJ', state: 'done' },
    { id: 't-3', title: 'Disputa Aberta', detail: '22 Jun 2025, 14:32 · pela contratante', state: 'alert', badge: 'R$ 12.000 solicitado' },
    { id: 't-4', title: 'Sua Defesa Pendente', detail: 'Prazo: 25 Jun 2025, 14:32', state: 'current', badge: 'Agora' },
  ],
} as const

const DEFENSE_TYPES = ['Serviço Entregue', 'Entrega Parcial', 'Força Maior', 'Outro'] as const

const DEFENSE_CHECKLIST = [
  'Seja factual e objetivo',
  'Cite os anexos pelo nome',
  'Mínimo 200 caracteres',
] as const

const INITIAL_EVIDENCE = [
  { id: 'ev-1', name: 'Contrato_Fornecedor_Assinado.pdf', meta: '1.2 MB · Carregado agora', kind: 'pdf' },
  { id: 'ev-2', name: 'Checklist_Itens_Entregues.pdf', meta: '340 KB · Checklist', kind: 'file' },
  { id: 'ev-3', name: 'Fotos_Buffet_Completo.zip', meta: '22.1 MB · 31 imagens', kind: 'image' },
]

const STATUS_TABS = [
  { id: 'pendente', label: '1 Pendente', dot: 'bg-yellow-500' },
  { id: 'analise', label: '2 Em Análise', dot: 'bg-muted-foreground' },
  { id: 'resolvidas', label: '4 Resolvidas', dot: 'bg-primary' },
] as const

const MAX_EVIDENCE = 10
const MIN_CHARS = 200

/* ------------------------------------------------------------------ */

function EvidenceIcon({ kind, className }: { kind: string; className?: string }) {
  if (kind === 'image') return <ImageIcon className={className} />
  if (kind === 'pdf') return <FileText className={className} />
  return <FileText className={className} />
}

export function DisputesClient() {
  const [activeTab, setActiveTab] = useState<(typeof STATUS_TABS)[number]['id']>('pendente')
  const [defenseType, setDefenseType] = useState<(typeof DEFENSE_TYPES)[number]>('Serviço Entregue')
  const [justification, setJustification] = useState('')
  const [evidence, setEvidence] = useState(INITIAL_EVIDENCE)
  const [submitted, setSubmitted] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const flash = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 3200)
  }

  const charCount = justification.length
  const meetsMinChars = charCount >= MIN_CHARS
  const hasEvidence = evidence.length > 0
  const canSubmit = meetsMinChars && hasEvidence && !submitted

  const checklistState = useMemo(
    () => [charCount > 0, /_/.test(justification) || justification.length > 0, meetsMinChars],
    [charCount, justification, meetsMinChars],
  )

  const addEvidence = (name: string) => {
    if (evidence.length >= MAX_EVIDENCE) {
      flash('Limite de 10 evidências atingido.')
      return
    }
    setEvidence((prev) => [
      ...prev,
      { id: `ev-${Date.now()}`, name, meta: `${(Math.random() * 4 + 0.5).toFixed(1)} MB · Carregado agora`, kind: 'file' },
    ])
    flash(`Evidência "${name}" adicionada ao cofre.`)
  }

  const removeEvidence = (id: string) => {
    setEvidence((prev) => prev.filter((e) => e.id !== id))
  }

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    files.forEach((f) => addEvidence(f.name))
    e.target.value = ''
  }

  const handleSubmit = () => {
    if (!canSubmit) {
      if (!meetsMinChars) flash('Sua justificativa precisa ter no mínimo 200 caracteres.')
      else if (!hasEvidence) flash('Anexe ao menos uma evidência antes de enviar.')
      return
    }
    setSubmitted(true)
    flash('Defesa enviada para arbitragem! O caso #1042 foi bloqueado para edição.')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SupplierTopbar active="Disputas" onUnavailable={(l) => flash(`${l} em breve`)} />

      {/* toast */}
      {toast && (
        <div className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-lg border border-primary/40 bg-card px-4 py-2.5 text-sm text-foreground shadow-lg">
          {toast}
        </div>
      )}

      <main className="mx-auto max-w-7xl px-6 pb-32 pt-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[0.7rem] font-semibold tracking-widest text-amber-500">
                <span className="size-1.5 rounded-full bg-amber-500" />
                PORTAL DE DISPUTAS
                <span className="size-1.5 rounded-full bg-amber-500" />
              </span>
              <span className="text-xs text-muted-foreground">Mediação · TimTim Arbitrage</span>
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-balance">
              Central de Disputas <span className="text-muted-foreground">&amp; Contestações</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Gerencie contestações formais e submeta sua defesa à equipe de arbitragem da plataforma.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3">
            <TriangleAlert className="size-5 shrink-0 text-amber-500" />
            <div>
              <p className="text-sm font-semibold text-foreground">1 Disputa Requer Sua Ação</p>
              <p className="text-xs text-amber-500/90">Prazo expira em 3 dias · Respond. obrigatória</p>
            </div>
          </div>
        </div>

        {/* status tabs */}
        <div className="mt-6 flex flex-col justify-between gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id)
                  if (tab.id !== 'pendente') flash(`Filtro "${tab.label}" — nenhum caso nesta demo`)
                }}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                  activeTab === tab.id
                    ? 'border-border bg-muted/40 text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                <span className={cn('size-1.5 rounded-full', tab.dot)} />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" />
            Disputas protegidas pelo{' '}
            <span className="text-foreground">Protocolo TimTim Arbitrage v2</span>
          </div>
        </div>

        {/* Case header card */}
        <section className="mt-6 rounded-2xl border border-border/60 bg-card">
          <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="grid size-11 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
                <Gavel className="size-5" />
              </div>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                <div>
                  <p className="text-[0.65rem] font-semibold tracking-widest text-muted-foreground">NÚMERO DO CASO</p>
                  <p className="font-display text-lg font-semibold text-foreground">{DISPUTE.caseNumber}</p>
                </div>
                <div>
                  <p className="text-[0.65rem] font-semibold tracking-widest text-muted-foreground">EVENTO VINCULADO</p>
                  <p className="font-display text-lg font-semibold text-foreground">{DISPUTE.event}</p>
                </div>
                <span className="inline-flex items-center gap-2 self-center rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500">
                  <span className="size-1.5 rounded-full bg-amber-500" />
                  {DISPUTE.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[0.65rem] font-semibold tracking-widest text-muted-foreground">PRAZO PARA DEFESA</p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-display text-lg font-semibold text-foreground">{DISPUTE.deadlineHours}</span> horas
                </p>
              </div>
              <div
                className="grid size-14 place-items-center rounded-full text-xs font-semibold text-amber-500"
                style={{
                  background: `conic-gradient(var(--color-amber-500, #f59e0b) ${DISPUTE.deadlinePercent}%, color-mix(in oklch, var(--color-amber-500, #f59e0b) 18%, transparent) 0)`,
                }}
              >
                <span className="grid size-11 place-items-center rounded-full bg-card">
                  {DISPUTE.deadlinePercent}%
                </span>
              </div>
            </div>
          </div>

          {/* metadata strip */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/60 px-5 py-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5" /> Evento: <span className="text-foreground">{DISPUTE.eventDate}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <User className="size-3.5" /> Contratante: <span className="text-foreground">{DISPUTE.contractant}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Scale className="size-3.5" /> Valor em disputa: <span className="text-foreground">{DISPUTE.disputedValue}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FileText className="size-3.5" /> Categoria: <span className="text-foreground">{DISPUTE.category}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" /> Aberta em: <span className="text-foreground">{DISPUTE.openedAt}</span>
            </span>
          </div>
        </section>

        {/* Claim + Timeline */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Claim */}
          <section className="rounded-2xl border border-border/60 bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Quote className="size-4 text-muted-foreground" />
                <h2 className="text-[0.7rem] font-semibold tracking-widest text-muted-foreground">
                  RECLAMAÇÃO DO CONTRATANTE
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-2.5 py-1 text-[0.7rem] text-muted-foreground">
                <Lock className="size-3" /> Somente árbitros
              </span>
            </div>

            <blockquote className="rounded-xl border-l-2 border-amber-500/60 bg-muted/20 p-4 text-sm italic leading-relaxed text-foreground/90">
              &ldquo;{DISPUTE.claim.text}&rdquo;
            </blockquote>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src={DISPUTE.claim.avatar || '/placeholder.svg'}
                  alt={DISPUTE.claim.author}
                  width={28}
                  height={28}
                  className="size-7 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-foreground">{DISPUTE.claim.author}</span>
                <span className="text-xs text-muted-foreground">· {DISPUTE.claim.date}</span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[0.7rem] font-semibold text-amber-500">
                <Info className="size-3" /> FORMAL
              </span>
            </div>

            <p className="mb-3 mt-6 text-[0.7rem] font-semibold tracking-widest text-muted-foreground">
              EVIDÊNCIAS ANEXADAS PELO CONTRATANTE
            </p>
            <div className="space-y-2">
              {DISPUTE.claimantEvidence.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-3"
                >
                  <div className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
                    <EvidenceIcon kind={ev.kind} className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{ev.name}</p>
                    <p className="text-xs text-muted-foreground">{ev.meta}</p>
                  </div>
                  <span className="rounded-md border border-border/60 px-2 py-0.5 text-[0.7rem] text-muted-foreground">
                    {ev.tag}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section className="rounded-2xl border border-border/60 bg-card p-6">
            <div className="mb-5 flex items-center gap-2">
              <GitBranch className="size-4 text-muted-foreground" />
              <h2 className="text-[0.7rem] font-semibold tracking-widest text-muted-foreground">
                LINHA DO TEMPO DA DISPUTA
              </h2>
            </div>

            <ol className="relative space-y-5 border-l border-border/60 pl-6">
              {DISPUTE.timeline.map((step) => (
                <li key={step.id} className="relative">
                  <span
                    className={cn(
                      'absolute -left-[1.9rem] top-0.5 size-3 rounded-full ring-4 ring-card',
                      step.state === 'done' && 'bg-primary',
                      step.state === 'alert' && 'bg-amber-500',
                      step.state === 'current' && 'bg-amber-500 animate-pulse',
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        step.state === 'current' ? 'text-amber-500' : 'text-foreground',
                      )}
                    >
                      {step.title}
                    </p>
                    {'badge' in step && step.badge === 'Agora' && (
                      <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[0.65rem] font-semibold text-amber-500">
                        Agora
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{step.detail}</p>
                  {'badge' in step && step.badge && step.badge !== 'Agora' && (
                    <span className="mt-2 inline-flex rounded-md border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[0.7rem] font-semibold text-amber-500">
                      {step.badge}
                    </span>
                  )}
                </li>
              ))}
            </ol>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-[0.7rem] font-semibold tracking-widest">
                <span className="text-muted-foreground">PRAZO DECORRIDO</span>
                <span className="text-amber-500">{DISPUTE.elapsedPercent}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${DISPUTE.elapsedPercent}%` }} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {DISPUTE.deadlineHours} horas restantes para submissão da defesa.
              </p>
            </div>

            <div className="mt-5 flex items-start gap-2 rounded-lg border border-border/60 bg-muted/20 p-3">
              <CircleHelp className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Sua defesa será analisada por árbitros certificados. O processo é confidencial e protegido pelo
                protocolo TimTim Arbitrage.
              </p>
            </div>
          </section>
        </div>

        {/* Defense + Evidence vault */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Defense */}
          <section className="rounded-2xl border border-border/60 bg-card">
            <div className="flex items-center justify-between border-b border-border/60 p-5">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Gavel className="size-4" />
                </div>
                <div>
                  <h2 className="font-display text-base font-semibold text-foreground">Declaração Formal de Defesa</h2>
                  <p className="text-xs text-muted-foreground">
                    Para Disputa {DISPUTE.caseNumber} · Mediação Oficial
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-2.5 py-1 text-[0.7rem] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-primary" /> Rascunho salvo
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-b border-border/60 p-5">
              <span className="mr-1 text-xs text-muted-foreground">Tipo de defesa:</span>
              {DEFENSE_TYPES.map((type) => {
                const active = defenseType === type
                return (
                  <button
                    key={type}
                    type="button"
                    disabled={submitted}
                    onClick={() => setDefenseType(type)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50',
                      active
                        ? 'border-primary/50 bg-primary/10 text-primary'
                        : 'border-border/60 text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {active && <Check className="size-3" />}
                    {type}
                  </button>
                )
              })}
            </div>

            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="defense-text" className="text-[0.7rem] font-semibold tracking-widest text-muted-foreground">
                  SUA JUSTIFICATIVA OFICIAL
                </label>
                <span className={cn('text-xs', meetsMinChars ? 'text-primary' : 'text-muted-foreground')}>
                  {charCount} / 2000
                </span>
              </div>
              <textarea
                id="defense-text"
                value={justification}
                onChange={(e) => setJustification(e.target.value.slice(0, 2000))}
                disabled={submitted}
                rows={11}
                placeholder="Descreva sua defesa com clareza e objetividade. Inclua: (1) confirmação dos itens entregues, (2) justificativa para qualquer variação do contrato, (3) referências às evidências anexadas. Sua declaração será lida por árbitros certificados e deverá ser formal e factual…"
                className="w-full resize-none rounded-xl border border-border/60 bg-input p-4 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-primary disabled:opacity-60"
              />

              <div className="mt-4 flex flex-wrap gap-2">
                {DEFENSE_CHECKLIST.map((item, i) => (
                  <span
                    key={item}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs',
                      checklistState[i]
                        ? 'border-primary/40 bg-primary/10 text-primary'
                        : 'border-border/60 text-muted-foreground',
                    )}
                  >
                    <CircleCheck className="size-3.5" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Evidence vault */}
          <section className="rounded-2xl border border-border/60 bg-card">
            <div className="flex items-center justify-between border-b border-border/60 p-5">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <h2 className="font-display text-base font-semibold text-foreground">Cofre de Evidências</h2>
                  <p className="text-xs text-muted-foreground">Repositório legal oficial</p>
                </div>
              </div>
              <span className="rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 text-[0.7rem] font-semibold text-primary">
                {evidence.length} / {MAX_EVIDENCE}
              </span>
            </div>

            <div className="p-5">
              {/* dropzone */}
              <button
                type="button"
                disabled={submitted}
                onClick={() => fileInputRef.current?.click()}
                className="grid w-full place-items-center gap-3 rounded-xl border border-dashed border-primary/40 bg-primary/[0.03] px-6 py-8 text-center transition-colors hover:bg-primary/[0.06] disabled:opacity-50"
              >
                <span className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
                  <CloudUpload className="size-6" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-foreground">Arraste arquivos aqui</span>
                  <span className="block text-xs text-muted-foreground">
                    ou <span className="text-primary underline">clique para selecionar</span>
                  </span>
                </span>
                <span className="flex flex-wrap justify-center gap-2 text-[0.65rem] text-muted-foreground">
                  {['PDF', 'JPG/PNG', 'MP4', 'max 50MB'].map((t) => (
                    <span key={t} className="rounded-md border border-border/60 px-2 py-0.5">
                      {t}
                    </span>
                  ))}
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFilePick}
              />

              <p className="mb-3 mt-5 text-[0.7rem] font-semibold tracking-widest text-muted-foreground">
                EVIDÊNCIAS CARREGADAS
              </p>
              <div className="space-y-2">
                {evidence.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-3"
                  >
                    <div className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
                      <EvidenceIcon kind={ev.kind} className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{ev.name}</p>
                      <p className="text-xs text-muted-foreground">{ev.meta}</p>
                    </div>
                    <span className="size-1.5 rounded-full bg-primary" />
                    <button
                      type="button"
                      disabled={submitted}
                      aria-label={`Remover ${ev.name}`}
                      onClick={() => removeEvidence(ev.id)}
                      className="text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
                {evidence.length === 0 && (
                  <p className="rounded-lg border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
                    Nenhuma evidência anexada ainda.
                  </p>
                )}
              </div>

              <div className="mt-5 flex items-start gap-2 rounded-lg border border-border/60 bg-muted/20 p-3">
                <Info className="mt-0.5 size-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Protocolo de Custódia Digital</p>
                  <p className="text-xs text-muted-foreground">
                    Todos os arquivos são armazenados com hash SHA-256 e certificação de autenticidade. Não podem ser
                    alterados após o envio.
                  </p>
                </div>
              </div>

              <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 text-primary" />
                Aceito por árbitros certificados · Criptografia AES-256
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-lg bg-amber-500/10 text-amber-500">
                <Gavel className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Disputa {DISPUTE.caseNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {DISPUTE.event} · {DISPUTE.disputedValue}
                </p>
              </div>
              <div className="ml-4 hidden items-center gap-4 text-xs md:flex">
                <span className="inline-flex items-center gap-1.5 text-primary">
                  <CircleCheck className="size-3.5" /> {evidence.length} evidências
                </span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5',
                    meetsMinChars ? 'text-primary' : 'text-muted-foreground',
                  )}
                >
                  {meetsMinChars ? <CircleCheck className="size-3.5" /> : <span className="size-3 rounded-full border border-muted-foreground" />}
                  {meetsMinChars ? 'Justificativa pronta' : 'Justificativa pendente'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                disabled={submitted}
                onClick={() => flash('Rascunho salvo com sucesso.')}
                className="h-11 gap-2"
              >
                <Save className="size-4" /> Salvar Rascunho
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitted}
                className="h-11 gap-2 px-5 font-semibold"
              >
                {submitted ? (
                  <>
                    <CircleCheck className="size-4" /> Defesa Enviada
                  </>
                ) : (
                  <>
                    <SendHorizonal className="size-4" /> Enviar Defesa para Arbitragem
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">
            <TriangleAlert className="size-3 text-amber-500" />
            Ao enviar, sua defesa ficará bloqueada para edição. O árbitro terá acesso total ao conteúdo e evidências
            anexadas. Esta ação é irreversível.
          </p>
        </div>
      </div>

      <SupplierFooter />
    </div>
  )
}
