'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  ArrowRight,
  BadgeCheck,
  Check,
  Clock,
  Copy,
  CreditCard,
  HelpCircle,
  Lock,
  QrCode,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import { PIX_CODE, type BillingCycle, type PlanData } from '../data/checkout-data'

type Method = 'card' | 'pix'

const PAYMENT_ICONS = ['VISA', 'MC', 'AMEX'] as const

export function PaymentPanel({
  plan,
  cycle,
  onConfirm,
}: {
  plan: PlanData
  cycle: BillingCycle
  onConfirm: () => void
}) {
  const b = plan.billing[cycle]
  const [method, setMethod] = useState<Method>('card')
  const isAssessor = plan.role === 'assessor'

  return (
    <div className="border-border bg-card/40 rounded-3xl border p-6 md:p-8">
      {/* header */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-foreground flex items-center gap-2 text-xl font-semibold">
          <Lock className="text-primary size-4" />
          Pagamento Seguro
        </h2>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        {isAssessor
          ? 'Seus dados são protegidos com criptografia de ponta a ponta'
          : 'Criptografia SSL 256-bit · Seus dados estão protegidos'}
      </p>

      {/* accepted methods (fornecedor only) */}
      {!isAssessor && (
        <div className="mt-4 flex items-center gap-2">
          {PAYMENT_ICONS.map((label) => (
            <span
              key={label}
              className="border-border/70 bg-background/60 text-muted-foreground grid h-7 w-11 place-items-center rounded-md border text-[0.55rem] font-semibold"
            >
              {label}
            </span>
          ))}
          <span
            className={cn(
              'flex h-7 items-center gap-1 rounded-md border px-2 text-[0.6rem] font-semibold',
              method === 'pix'
                ? 'border-primary/50 bg-primary/10 text-primary'
                : 'border-border/70 bg-background/60 text-muted-foreground',
            )}
          >
            <QrCode className="size-3" />
            PIX
          </span>
        </div>
      )}

      {/* tabs */}
      {isAssessor ? (
        <div className="mt-6 grid grid-cols-2 gap-3">
          <BoxTab active={method === 'card'} onClick={() => setMethod('card')}>
            <CreditCard className="size-4" />
            CARTÃO DE CRÉDITO
          </BoxTab>
          <BoxTab active={method === 'pix'} onClick={() => setMethod('pix')}>
            <QrCode className="size-4" />
            PIX
          </BoxTab>
        </div>
      ) : (
        <div className="border-border/60 mt-6 flex gap-6 border-b">
          <TabButton active={method === 'card'} onClick={() => setMethod('card')}>
            <CreditCard className="size-4" />
            Cartão de Crédito
          </TabButton>
          <TabButton active={method === 'pix'} onClick={() => setMethod('pix')}>
            <QrCode className="size-4" />
            Pix
          </TabButton>
        </div>
      )}

      {method === 'card' ? <CardForm b={b} /> : <PixView b={b} planName={plan.name} />}

      {/* coupon (shared across card & pix, all plans) */}
      <div className="mt-6">
        <CouponField />
      </div>

      {/* order summary */}
      <OrderSummary plan={plan} cycle={cycle} method={method} simple={isAssessor} />

      {/* confirm */}
      <Button
        onClick={onConfirm}
        className={cn(
          'mt-6 h-14 w-full gap-2 text-sm font-semibold tracking-wide',
          isAssessor && 'tracking-wider uppercase',
        )}
      >
        {method === 'pix' ? (
          <QrCode className="size-4" />
        ) : isAssessor ? (
          <Zap className="size-4" />
        ) : (
          <Lock className="size-4" />
        )}
        Confirmar e Ativar Assinatura
        <ArrowRight className="size-4" />
      </Button>
      {isAssessor ? (
        <p className="text-muted-foreground mt-3 flex items-center justify-center gap-1.5 text-center text-xs">
          <ShieldCheck className="text-primary size-3.5" />
          Seus dados de pagamento são criptografados e protegidos
        </p>
      ) : (
        <p className="text-muted-foreground mt-3 text-center text-xs">
          Ao confirmar, você concorda com os{' '}
          <span className="text-foreground underline underline-offset-2">Termos de Uso</span> e a{' '}
          <span className="text-foreground underline underline-offset-2">
            Política de Privacidade
          </span>{' '}
          da TimTim.
        </p>
      )}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        '-mb-px flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition-colors',
        active
          ? 'border-primary text-primary'
          : 'text-muted-foreground hover:text-foreground border-transparent',
      )}
    >
      {children}
    </button>
  )
}

function BoxTab({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-semibold tracking-wide transition-colors',
        active
          ? 'border-primary/60 bg-primary/10 text-primary'
          : 'border-border/70 bg-background/40 text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

// ---------- Coupon (shared) ----------
function CouponField() {
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  return (
    <div>
      <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-widest">
        POSSUI CUPOM DE ASSESSOR?
      </p>
      <div className="flex gap-2">
        <Input
          value={coupon}
          onChange={(e) => {
            setCoupon(e.target.value.toUpperCase())
            setCouponApplied(false)
          }}
          placeholder="Insira seu código aqui"
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          disabled={coupon.trim().length === 0}
          onClick={() => setCouponApplied(true)}
          className="h-12 px-6 text-xs font-semibold tracking-widest"
        >
          Aplicar
        </Button>
      </div>
      {couponApplied && (
        <p className="text-primary mt-2 flex items-center gap-1.5 text-xs">
          <BadgeCheck className="size-3.5" />
          Cupom “{coupon}” aplicado com sucesso.
        </p>
      )}
    </div>
  )
}

// ---------- Credit card form ----------
function CardForm({ b }: { b: PlanData['billing'][BillingCycle] }) {
  const [number, setNumber] = useState('')
  const [name, setName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  const maskedNumber = useMemo(() => {
    const digits = number.replace(/\D/g, '').slice(0, 16)
    const groups = digits.match(/.{1,4}/g) ?? []
    const filled = groups.join(' ')
    return filled || '•••• •••• •••• ••••'
  }, [number])

  return (
    <div className="mt-6 space-y-5">
      {/* card visual */}
      <div className="border-border/70 from-secondary to-background relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5">
        <div className="flex items-start justify-between">
          <span className="bg-primary/20 text-primary grid size-9 place-items-center rounded-lg text-xs font-bold">
            TT
          </span>
          <span className="text-muted-foreground text-xs font-semibold tracking-widest">VISA</span>
        </div>
        <p className="text-foreground/90 mt-6 font-mono text-lg tracking-widest">{maskedNumber}</p>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-muted-foreground text-[0.6rem] tracking-widest">NOME NO CARTÃO</p>
            <p className="text-foreground text-sm font-medium uppercase">{name || 'SEU NOME'}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-[0.6rem] tracking-widest">VALIDADE</p>
            <p className="text-foreground text-sm font-medium">{expiry || 'MM/AA'}</p>
          </div>
        </div>
      </div>

      <Field label="Número do Cartão">
        <Input
          value={number}
          onChange={(e) => setNumber(formatCardNumber(e.target.value))}
          placeholder="0000 0000 0000 0000"
          inputMode="numeric"
        />
      </Field>

      <Field label="Nome no Cartão">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Como aparece no cartão"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Validade (MM/AA)">
          <Input
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            placeholder="MM/AA"
            inputMode="numeric"
          />
        </Field>
        <Field label="CVV">
          <Input
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="•••"
            inputMode="numeric"
          />
        </Field>
      </div>

      <Field label="Parcelamento">
        <div className="border-input bg-background/40 text-foreground flex h-12 items-center rounded-xl border px-4 text-sm">
          {b.installment}
        </div>
      </Field>
    </div>
  )
}

// ---------- Pix view ----------
function PixView({ b, planName }: { b: PlanData['billing'][BillingCycle]; planName: string }) {
  const [remaining, setRemaining] = useState(30 * 60)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setRemaining((r) => (r > 0 ? r - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [])

  const mmss = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(
    remaining % 60,
  ).padStart(2, '0')}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PIX_CODE)
    } catch {
      /* clipboard unavailable in prototype */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-6 space-y-5">
      {/* expiry */}
      <div className="border-border/70 bg-background/40 flex items-center justify-between rounded-xl border px-4 py-3 text-sm">
        <span className="text-muted-foreground flex items-center gap-2">
          <span className="bg-primary size-2 rounded-full" aria-hidden="true" />
          QR Code expira em
        </span>
        <span className="text-primary flex items-center gap-1.5 font-medium">
          <Clock className="size-4" />
          {mmss}
        </span>
      </div>

      {/* QR */}
      <div className="flex flex-col items-center">
        <div className="border-primary/40 relative rounded-2xl border-2 bg-white p-4">
          <QRCodeSVG value={PIX_CODE} size={176} level="M" bgColor="#ffffff" fgColor="#0b0f10" />
          <span className="bg-primary text-primary-foreground absolute top-1/2 left-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-md text-[0.6rem] font-bold ring-4 ring-white">
            TT
          </span>
        </div>
        <p className="text-foreground mt-4 text-sm font-medium">
          Escaneie o código com o aplicativo do seu banco
        </p>
        <p className="text-muted-foreground text-xs">
          Qualquer banco com Pix habilitado · Aprovação em segundos
        </p>
      </div>

      {/* copia e cola */}
      <div className="relative flex items-center py-1">
        <span className="bg-border h-px flex-1" />
        <span className="text-muted-foreground px-3 text-xs">ou copie o código</span>
        <span className="bg-border h-px flex-1" />
      </div>

      <div className="border-border/70 bg-background/40 rounded-xl border p-4">
        <p className="text-muted-foreground text-[0.6rem] font-semibold tracking-widest">
          CHAVE PIX · COPIA E COLA
        </p>
        <p className="text-foreground/80 mt-2 truncate font-mono text-xs">{PIX_CODE}</p>
        <p className="text-muted-foreground mt-2 text-xs">
          {b.total} · {planName} {b.summaryTag}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={copy}
        className="h-12 w-full gap-2 text-sm font-medium"
      >
        {copied ? <Check className="text-primary size-4" /> : <Copy className="size-4" />}
        {copied ? 'Código copiado!' : 'Copiar Código Pix'}
      </Button>

      {/* badges */}
      <div className="grid grid-cols-3 gap-3">
        <PixBadge icon={<Zap className="size-4" />} text="Aprovação imediata" />
        <PixBadge icon={<HelpCircle className="size-4" />} text="100% seguro" />
        <PixBadge icon={<Clock className="size-4" />} text="Disponível 24/7" />
      </div>
    </div>
  )
}

function PixBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="border-border/70 bg-background/40 flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center">
      <span className="text-primary">{icon}</span>
      <span className="text-muted-foreground text-[0.7rem] leading-tight">{text}</span>
    </div>
  )
}

// ---------- Order summary ----------
function OrderSummary({
  plan,
  cycle,
  method,
  simple = false,
}: {
  plan: PlanData
  cycle: BillingCycle
  method: Method
  simple?: boolean
}) {
  const b = plan.billing[cycle]

  if (simple) {
    return (
      <div className="border-border/60 mt-8 border-t pt-6">
        <div className="space-y-3">
          {b.summary.map((line) => (
            <div key={line.label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{line.label}</span>
              <span
                className={cn(
                  'font-medium',
                  line.discount || line.value === 'Grátis' ? 'text-primary' : 'text-foreground',
                )}
              >
                {line.value}
              </span>
            </div>
          ))}
        </div>
        <div className="border-border/60 mt-5 flex items-end justify-between border-t pt-4">
          <p className="text-foreground text-sm font-medium">Total hoje</p>
          <p className="font-display text-primary text-2xl font-bold">{b.total}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border-border/60 mt-8 border-t pt-6">
      <p className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-widest">
        <ShieldCheck className="text-primary size-3.5" />
        RESUMO DO PEDIDO
      </p>

      <div className="border-primary bg-background/30 mt-4 space-y-3 rounded-xl border-l-2 py-3 pr-3 pl-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground flex items-center gap-2">
            Faturamento
            <span className="border-primary/40 bg-primary/10 text-primary rounded-full border px-2 py-0.5 text-[0.65rem] font-medium">
              {method === 'pix' ? `Pix · ${b.summaryTag}` : b.summaryTag}
            </span>
          </span>
          <span className="text-muted-foreground">{b.summaryPeriod}</span>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {b.summary.map((line) => (
          <div
            key={line.label}
            className={cn(
              'flex items-center justify-between text-sm',
              line.discount &&
                'border-primary/25 bg-primary/5 text-primary rounded-lg border px-3 py-2',
            )}
          >
            <span className={line.discount ? 'font-medium' : 'text-muted-foreground'}>
              {line.label}
            </span>
            <span
              className={cn(
                'font-medium',
                line.discount
                  ? 'text-primary'
                  : line.value === 'Grátis'
                    ? 'text-primary'
                    : 'text-foreground',
              )}
            >
              {line.value}
            </span>
          </div>
        ))}
      </div>

      <div className="border-border/60 mt-5 flex items-end justify-between border-t pt-4">
        <div>
          <p className="text-foreground text-sm font-medium">Total hoje</p>
          <p className="text-muted-foreground text-xs">{b.nextCharge}</p>
        </div>
        <div className="text-right">
          <p className="font-display text-foreground text-2xl font-bold">{b.total}</p>
          <p className="text-primary text-xs">{b.monthlyEquivalent}</p>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
      {children}
    </label>
  )
}

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return (digits.match(/.{1,4}/g) ?? []).join(' ')
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}
