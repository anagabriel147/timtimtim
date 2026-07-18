'use client'

import { useEffect, useMemo, useState } from 'react'

import Image from 'next/image'

import {
  BadgeCheck,
  Check,
  Copy,
  CreditCard,
  Loader2,
  Lock,
  QrCode,
  ShieldCheck,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ---- Mocked payment config ----
const PIX = {
  key: '00020126580014br.gov.bcb.pix0136timtim-escrow-4f2c-9a11-casamento52040000',
  expiresIn: '14:59',
}

const INSTALLMENTS = [
  { value: '1', label: '1x sem juros' },
  { value: '2', label: '2x sem juros' },
  { value: '3', label: '3x sem juros' },
  { value: '6', label: '6x sem juros' },
  { value: '12', label: '12x com juros' },
]

export type PendingPayment = {
  id: string
  vendor: string
  event: string
  category: string
  avatar: string
  value: string
  location: string
}

type Status = 'idle' | 'processing' | 'approved'

export function PaymentModal({
  payment,
  onClose,
  onApproved,
}: {
  payment: PendingPayment | null
  onClose: () => void
  onApproved: (p: PendingPayment) => void
}) {
  const [method, setMethod] = useState<'pix' | 'card'>('pix')
  const [status, setStatus] = useState<Status>('idle')
  const [copied, setCopied] = useState(false)
  // card fields
  const [number, setNumber] = useState('')
  const [name, setName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [installment, setInstallment] = useState('1')

  const open = payment !== null

  // reset when opening a fresh payment
  useEffect(() => {
    if (open) {
      setMethod('pix')
      setStatus('idle')
      setCopied(false)
      setNumber('')
      setName('')
      setExpiry('')
      setCvv('')
      setInstallment('1')
    }
  }, [open])

  // after approval, hand off (parent creates contract + redirects)
  useEffect(() => {
    if (status !== 'approved' || !payment) return
    const t = setTimeout(() => onApproved(payment), 1600)
    return () => clearTimeout(t)
  }, [status, payment, onApproved])

  const cardValid = useMemo(
    () =>
      number.replace(/\s/g, '').length >= 16 &&
      name.trim().length > 2 &&
      expiry.length >= 4 &&
      cvv.length >= 3,
    [number, name, expiry, cvv],
  )

  if (!open || !payment) return null

  const pay = () => {
    setStatus('processing')
    setTimeout(() => setStatus('approved'), 2000)
  }

  const copyPix = () => {
    navigator.clipboard?.writeText(PIX.key).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="bg-background/80 absolute inset-0 backdrop-blur-sm"
      />

      <div className="border-border bg-card relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl">
        {status === 'approved' ? (
          <ApprovedView payment={payment} method={method} />
        ) : (
          <>
            {/* header */}
            <div className="border-border flex items-start justify-between border-b p-6">
              <div className="flex items-center gap-3">
                <Image
                  src={payment.avatar || '/placeholder.svg'}
                  alt={payment.vendor}
                  width={44}
                  height={44}
                  className="size-11 rounded-full object-cover"
                />
                <div>
                  <p className="font-display text-foreground flex items-center gap-1.5 text-base font-semibold">
                    {payment.vendor}
                    <BadgeCheck className="text-primary size-4" />
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {payment.category} · {payment.event}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-muted-foreground hover:bg-secondary hover:text-foreground grid size-8 place-items-center rounded-lg transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* amount */}
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-muted-foreground text-sm">Total do contrato</span>
              <span className="font-display text-primary text-2xl font-bold">{payment.value}</span>
            </div>

            {/* method tabs */}
            <div className="grid grid-cols-2 gap-2 px-6">
              <MethodTab
                active={method === 'pix'}
                onClick={() => setMethod('pix')}
                icon={<QrCode className="size-4" />}
                label="Pix"
                hint="Aprovação imediata"
              />
              <MethodTab
                active={method === 'card'}
                onClick={() => setMethod('card')}
                icon={<CreditCard className="size-4" />}
                label="Cartão de Crédito"
                hint="Até 12x"
              />
            </div>

            {/* body */}
            <div className="p-6">
              {method === 'pix' ? (
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-xl bg-white p-3">
                    <Image
                      src="/images/pagamento/pix-qr.png"
                      alt="QR Code Pix"
                      width={180}
                      height={180}
                      className="size-44"
                    />
                  </div>
                  <p className="text-muted-foreground mt-4 text-sm">
                    Escaneie o QR Code no app do seu banco ou copie o código abaixo.
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Expira em <span className="text-primary font-semibold">{PIX.expiresIn}</span>
                  </p>
                  <div className="border-border bg-background/60 mt-4 flex w-full items-center gap-2 rounded-lg border p-2">
                    <span className="text-muted-foreground flex-1 truncate px-2 text-left text-xs">
                      {PIX.key}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyPix}
                      className="h-8 shrink-0 gap-1.5 text-xs"
                    >
                      {copied ? (
                        <Check className="text-primary size-3.5" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                      {copied ? 'Copiado' : 'Copiar'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Field label="Número do cartão">
                    <input
                      value={number}
                      onChange={(e) => setNumber(formatCardNumber(e.target.value))}
                      inputMode="numeric"
                      placeholder="0000 0000 0000 0000"
                      className="border-border bg-background/60 text-foreground placeholder:text-muted-foreground focus:border-primary w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                    />
                  </Field>
                  <Field label="Nome impresso no cartão">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value.toUpperCase())}
                      placeholder="MARIANA C SILVA"
                      className="border-border bg-background/60 text-foreground placeholder:text-muted-foreground focus:border-primary w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Validade">
                      <input
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        inputMode="numeric"
                        placeholder="MM/AA"
                        className="border-border bg-background/60 text-foreground placeholder:text-muted-foreground focus:border-primary w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                      />
                    </Field>
                    <Field label="CVV">
                      <input
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        inputMode="numeric"
                        placeholder="123"
                        className="border-border bg-background/60 text-foreground placeholder:text-muted-foreground focus:border-primary w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                      />
                    </Field>
                  </div>
                  <Field label="Parcelas">
                    <select
                      value={installment}
                      onChange={(e) => setInstallment(e.target.value)}
                      className="border-border bg-background/60 text-foreground focus:border-primary w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                    >
                      {INSTALLMENTS.map((i) => (
                        <option key={i.value} value={i.value} className="bg-card">
                          {i.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              )}

              <Button
                onClick={pay}
                disabled={status === 'processing' || (method === 'card' && !cardValid)}
                className="mt-5 h-12 w-full gap-2 text-sm font-semibold"
              >
                {status === 'processing' ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Processando pagamento...
                  </>
                ) : (
                  <>
                    <Lock className="size-4" />
                    {method === 'pix' ? 'Já fiz o pagamento' : `Pagar ${payment.value}`}
                  </>
                )}
              </Button>

              <p className="text-muted-foreground mt-3 flex items-center justify-center gap-1.5 text-center text-xs">
                <ShieldCheck className="text-primary size-3.5" />
                Pagamento protegido em escrow pelo TimTim até a confirmação do evento.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function ApprovedView({ payment, method }: { payment: PendingPayment; method: 'pix' | 'card' }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span className="bg-primary/15 text-primary grid size-16 place-items-center rounded-full">
        <Check className="size-8" strokeWidth={3} />
      </span>
      <h2 className="font-display text-foreground mt-5 text-2xl font-bold">Pagamento aprovado!</h2>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">
        O contrato com <span className="text-foreground font-medium">{payment.vendor}</span> foi
        firmado e o valor de <span className="text-primary font-semibold">{payment.value}</span>{' '}
        está retido em escrow
        {method === 'pix' ? ' (Pix confirmado)' : ' (cartão aprovado)'}.
      </p>
      <div className="border-primary/40 bg-primary/10 text-primary mt-6 flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
        <Loader2 className="size-4 animate-spin" />
        Redirecionando para os seus contratos...
      </div>
    </div>
  )
}

function MethodTab({
  active,
  onClick,
  icon,
  label,
  hint,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  hint: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left transition-colors',
        active
          ? 'border-primary bg-primary/10'
          : 'border-border bg-background/40 hover:border-primary/40',
      )}
    >
      <span
        className={cn(
          'flex items-center gap-2 text-sm font-medium',
          active ? 'text-primary' : 'text-foreground',
        )}
      >
        {icon}
        {label}
      </span>
      <span className="text-muted-foreground text-xs">{hint}</span>
    </button>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-muted-foreground mb-1.5 block text-xs font-medium">{label}</span>
      {children}
    </label>
  )
}

function formatCardNumber(v: string) {
  return v
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim()
}

function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}
