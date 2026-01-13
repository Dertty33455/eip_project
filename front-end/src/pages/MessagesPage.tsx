import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { Container } from '../components/ui/Container'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { useAuthStore } from '../stores/authStore'
import { useMessagingStore } from '../stores/messagingStore'
import { useMarketStore } from '../stores/marketStore'
import type { Message } from '../types'

import chatIllustration from '../assets/illustrations/chat.svg'
import coverPlaceholder from '../assets/covers/placeholder.svg'
import coverRoman from '../assets/covers/cover-roman.svg'
import coverSchool from '../assets/covers/cover-school.svg'
import coverTech from '../assets/covers/cover-tech.svg'

function coverForCategory(category: string) {
  if (category === 'Romans') return coverRoman
  if (category === 'Scolaires') return coverSchool
  if (category === 'Informatique') return coverTech
  return coverPlaceholder
}

export function MessagesPage() {
  const { user } = useAuthStore()
  const location = useLocation()
  const {
    conversations,
    messagesByConversationId,
    activeConversationId,
    fetchConversations,
    setActiveConversation,
    fetchMessages,
    sendMessage,
    markRead,
  } = useMessagingStore()
  const { books, fetchBooks } = useMarketStore()

  const [text, setText] = useState('')

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  useEffect(() => {
    if (!user) return
    fetchConversations(user.id)
  }, [fetchConversations, user])

  useEffect(() => {
    const state = location.state as { conversationId?: string } | null
    if (state?.conversationId) setActiveConversation(state.conversationId)
  }, [location.state, setActiveConversation])

  useEffect(() => {
    if (!user || !activeConversationId) return
    fetchMessages(activeConversationId)
    markRead(activeConversationId, user.id)
  }, [activeConversationId, fetchMessages, markRead, user])

  const activeMessages: Message[] = activeConversationId
    ? (messagesByConversationId[activeConversationId] ?? [])
    : []

  const activeConv = useMemo(() => {
    if (!activeConversationId) return null
    return conversations.find((c) => c.id === activeConversationId) ?? null
  }, [activeConversationId, conversations])

  const activeBook = useMemo(() => {
    if (!activeConv) return null
    return books.find((b) => b.id === activeConv.bookId) ?? null
  }, [activeConv, books])

  if (!user) return null

  async function onSend() {
    if (!user) return
    if (!activeConversationId) return
    if (!text.trim()) return
    await sendMessage({
      conversationId: activeConversationId,
      senderUserId: user.id,
      text: text.trim(),
    })
    setText('')
  }

  return (
    <Container>
      <div className="grid gap-6 md:grid-cols-[320px_1fr]">
        <Card>
          <div className="text-lg font-semibold text-slate-900">Historique</div>
          <div className="mt-3 grid gap-2">
            {conversations.length ? (
              conversations.map((c) => {
                const unread = c.unreadCountByUserId[user.id] ?? 0
                const book = books.find((b) => b.id === c.bookId)
                const coverSrc = book?.photos[0] ?? (book ? coverForCategory(book.category) : coverPlaceholder)
                const coverAlt = book ? `Couverture de ${book.title}` : 'Couverture'
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveConversation(c.id)}
                    className={[
                      'w-full rounded-lg border px-3 py-3 text-left',
                      c.id === activeConversationId
                        ? 'border-amber-200 bg-amber-50'
                        : 'border-slate-200 bg-white hover:bg-slate-50',
                    ].join(' ')}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-start gap-3">
                        <img
                          src={coverSrc}
                          alt={coverAlt}
                          className="mt-0.5 h-12 w-10 shrink-0 rounded-md border border-slate-200 bg-white object-cover"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-900">
                            {book?.title ?? 'Livre'}
                          </div>
                          <div className="mt-1 truncate text-xs text-slate-600">
                            {book?.seller.displayName ?? 'Vendeur'}
                          </div>
                        </div>
                      </div>
                      {unread ? <Badge tone="rose">{unread}</Badge> : null}
                    </div>
                  </button>
                )
              })
            ) : (
              <EmptyState
                title="Aucune conversation"
                description="Contacte un vendeur depuis la page d’un livre."
                illustrationSrc={chatIllustration}
                illustrationAlt=""
              />
            )}
          </div>
        </Card>

        <Card>
          {!activeConversationId ? (
            <EmptyState
              title="Sélectionne une conversation"
              description="Tu verras ici le chat avec le vendeur." 
              illustrationSrc={chatIllustration}
              illustrationAlt=""
            />
          ) : (
            <div className="flex h-[70vh] flex-col">
              <div className="border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={activeBook?.photos[0] ?? (activeBook ? coverForCategory(activeBook.category) : coverPlaceholder)}
                    alt={activeBook ? `Couverture de ${activeBook.title}` : 'Couverture'}
                    className="h-10 w-8 rounded-md border border-slate-200 bg-white object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {activeBook?.title ?? 'Conversation'}
                    </div>
                    <div className="text-xs text-slate-500">
                      Discussion acheteur ↔ vendeur
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex-1 overflow-auto rounded-lg bg-slate-50 p-3">
                <div className="grid gap-2">
                  {activeMessages.map((m) => {
                    const mine = m.senderUserId === user.id
                    return (
                      <div
                        key={m.id}
                        className={[
                          'max-w-[85%] rounded-lg px-3 py-2 text-sm',
                          mine
                            ? 'ml-auto bg-slate-900 text-white'
                            : 'mr-auto bg-white text-slate-900 border border-slate-200',
                        ].join(' ')}
                      >
                        {m.text}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Écrire un message…"
                />
                <Button onClick={onSend}>Envoyer</Button>
              </div>
              <div className="mt-2 flex gap-2">
                <Button variant="ghost" onClick={() => setActiveConversation(null)}>
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </Container>
  )
}
