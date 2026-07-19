const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export type SessionUser = {
  id: number
  name: string
  email: string
  role: 'contratante' | 'fornecedor' | 'assessor' | 'admin'
  avatar_url: string | null
}

export type LoginResponse = {
  access_token: string
  token_type: string
  user: SessionUser
}

export type ServiceCategory = {
  id: number
  name: string
  slug: string
  icon: string | null
}

export type Event = {
  id: number
  type: string
  name: string
  event_date: string | null
  guests_count: number | null
  notes: string | null
  country: string | null
  district: string | null
  city: string | null
  venue_name: string | null
  address: string | null
  venue_status: string | null
  phase: string
  budget_total: string | null
  created_at: string
  service_categories: ServiceCategory[]
}

export type EventCreateInput = {
  type: string
  name: string
  event_date?: string | null
  guests_count?: number | null
  notes?: string | null
  country?: string | null
  district?: string | null
  city?: string | null
  venue_name?: string | null
  address?: string | null
  venue_status?: string | null
  service_category_ids?: number[]
}

export type ProposalItem = {
  description: string
  qty: number
  unit: string | null
  unit_value: string
}

export type Proposal = {
  id: number
  quote_request_id: number
  provider_id: number
  provider_name: string
  provider_avatar: string | null
  contratante_name: string
  event_name: string | null
  category_name: string | null
  title: string
  amount: string
  payment_term: string | null
  validity_days: number | null
  scope_text: string | null
  status: string
  created_at: string
  items: ProposalItem[]
}

export type ProposalItemInput = {
  description: string
  qty: number
  unit?: string | null
  unit_value: number
}

export type ProposalCreateInput = {
  quote_request_id: number
  title: string
  category_id?: number | null
  deadline?: string | null
  amount: number
  payment_term?: string | null
  validity_days?: number | null
  scope_text?: string | null
  notes?: string | null
  items?: ProposalItemInput[]
}

export type Opportunity = {
  id: number
  event_id: number | null
  event_name: string | null
  contratante_name: string
  category_name: string | null
  source: string
  budget: string | null
  vision_text: string | null
  status: string
  created_at: string
  proposals_count: number
}

export type Payout = {
  id: number
  amount: string
  method: string
  pix_key: string | null
  status: string
  reference: string | null
  created_at: string
}

export type PayoutCreateInput = {
  amount: number
  pix_key?: string | null
}

export type Contract = {
  id: number
  contract_code: string
  event_id: number
  event_name: string
  event_city: string | null
  contratante_id: number
  contratante_name: string
  provider_id: number
  provider_name: string
  provider_avatar: string | null
  value: string
  installments_count: number
  service_status: string
  payment_status: string
  created_at: string
}

export type DisputeCreateInput = {
  contract_id: number
  category: string
  severity: string
  incident_date?: string | null
  statement_text: string
  requested_resolution: string
  requested_value?: number | null
}

export type ReviewCreateInput = {
  contract_id: number
  rating_overall: number
  rating_atendimento: number
  rating_pontualidade: number
  rating_qualidade: number
  highlights: string[]
  text: string
  recommend: boolean
  show_name: boolean
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
  }
}

const TOKEN_KEY = 'timtim.token'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  window.localStorage.removeItem(TOKEN_KEY)
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new ApiError(body?.detail ?? 'Ocorreu um erro ao falar com o servidor.', res.status)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new ApiError(body?.detail ?? 'E-mail ou senha incorretos.', res.status)
  }

  return res.json()
}

export function fetchCurrentUser(): Promise<SessionUser | null> {
  return apiFetch<SessionUser>('/auth/me').catch(() => null)
}

export function listCategories(): Promise<ServiceCategory[]> {
  return apiFetch('/categories')
}

export function listEvents(): Promise<Event[]> {
  return apiFetch('/events')
}

export function getEvent(id: number): Promise<Event> {
  return apiFetch(`/events/${id}`)
}

export function createEvent(input: EventCreateInput): Promise<Event> {
  return apiFetch('/events', { method: 'POST', body: JSON.stringify(input) })
}

export function listProposals(eventId: number): Promise<Proposal[]> {
  return apiFetch(`/proposals?event_id=${eventId}`)
}

export function listMyProposals(): Promise<Proposal[]> {
  return apiFetch('/proposals/mine')
}

export function createProposal(input: ProposalCreateInput): Promise<Proposal> {
  return apiFetch('/proposals', { method: 'POST', body: JSON.stringify(input) })
}

export function acceptProposal(id: number): Promise<Contract> {
  return apiFetch(`/proposals/${id}/accept`, { method: 'POST' })
}

export function rejectProposal(id: number): Promise<Proposal> {
  return apiFetch(`/proposals/${id}/reject`, { method: 'POST' })
}

export function listOpportunities(): Promise<Opportunity[]> {
  return apiFetch('/opportunities')
}

export function getOpportunity(id: number): Promise<Opportunity> {
  return apiFetch(`/opportunities/${id}`)
}

export function listContracts(): Promise<Contract[]> {
  return apiFetch('/contracts')
}

export function getContract(id: number): Promise<Contract> {
  return apiFetch(`/contracts/${id}`)
}

export function createDispute(input: DisputeCreateInput): Promise<{ id: number }> {
  return apiFetch('/disputes', { method: 'POST', body: JSON.stringify(input) })
}

export function createReview(input: ReviewCreateInput): Promise<{ id: number }> {
  return apiFetch('/reviews', { method: 'POST', body: JSON.stringify(input) })
}

export function listPayouts(): Promise<Payout[]> {
  return apiFetch('/payouts')
}

export function requestPayout(input: PayoutCreateInput): Promise<Payout> {
  return apiFetch('/payouts', { method: 'POST', body: JSON.stringify(input) })
}
