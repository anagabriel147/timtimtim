'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'

import { CONVERSATIONS, type ChatMessage, type Conversation } from '../data/messages-data'

type QuoteDetails = {
  date?: string
  period?: string
  guests?: string
  venue?: string
  services: string[]
  vision?: string
}

type ChatContextValue = {
  conversations: Conversation[]
  activeId: string
  setActiveId: (id: string) => void
  sendMessage: (conversationId: string, text: string) => void
  sendQuoteRequest: (conversationId: string, details: QuoteDetails) => void
  sendContactRequest: (conversationId: string) => void
  markRead: (conversationId: string) => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

function nowTime() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

// Deep clone the initial mock so runtime edits never mutate the source module.
function initialConversations(): Conversation[] {
  return CONVERSATIONS.map((c) => ({ ...c, messages: c.messages.map((m) => ({ ...m })) }))
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [activeId, setActiveId] = useState<string>(
    CONVERSATIONS.find((c) => c.active)?.id ?? CONVERSATIONS[0].id,
  )

  const appendMessage = useCallback(
    (conversationId: string, message: ChatMessage, preview: string) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: [...c.messages, message],
                preview,
                timestamp: message.time,
              }
            : c,
        ),
      )
    },
    [],
  )

  const sendMessage = useCallback(
    (conversationId: string, text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      appendMessage(
        conversationId,
        { id: `c-${Date.now()}`, from: 'client', time: nowTime(), text: trimmed, status: 'Enviada' },
        `Você: ${trimmed}`,
      )
    },
    [appendMessage],
  )

  const sendQuoteRequest = useCallback(
    (conversationId: string, details: QuoteDetails) => {
      const lines = [
        'Solicitação de orçamento enviada pelo TimTim:',
        details.date && `• Data: ${details.date}${details.period ? ` (${details.period})` : ''}`,
        details.guests && `• Convidados: ${details.guests}`,
        details.venue && `• Local: ${details.venue}`,
        details.services.length > 0 && `• Serviços: ${details.services.join(', ')}`,
        details.vision && `• Visão: ${details.vision}`,
      ].filter(Boolean)
      appendMessage(
        conversationId,
        {
          id: `q-${Date.now()}`,
          from: 'client',
          time: nowTime(),
          text: lines.join('\n'),
          status: 'Enviada',
        },
        'Você: Solicitação de orçamento enviada',
      )
    },
    [appendMessage],
  )

  const sendContactRequest = useCallback(
    (conversationId: string) => {
      appendMessage(
        conversationId,
        {
          id: `ct-${Date.now()}`,
          from: 'client',
          time: nowTime(),
          text: 'Olá! Tenho interesse nos seus serviços e gostaria de conversar sobre o meu evento.',
          status: 'Enviada',
        },
        'Você: Olá! Tenho interesse nos seus serviços',
      )
    },
    [appendMessage],
  )

  const markRead = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c)),
    )
  }, [])

  const value = useMemo(
    () => ({
      conversations,
      activeId,
      setActiveId,
      sendMessage,
      sendQuoteRequest,
      sendContactRequest,
      markRead,
    }),
    [conversations, activeId, sendMessage, sendQuoteRequest, sendContactRequest, markRead],
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within a ChatProvider')
  return ctx
}
