import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { Container } from '../components/ui/Container'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Textarea } from '../components/ui/Textarea'
import { useMarketStore } from '../stores/marketStore'
import { useAuthStore } from '../stores/authStore'
import { useMessagingStore } from '../stores/messagingStore'
import { formatXof } from '../lib/format'
import { mockApi } from '../api/mockApi'

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

export function BookDetailsPage() {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { books, fetchBooks, favorites, toggleFavorite } = useMarketStore()
  const { openConversationForBook } = useMessagingStore()

  const [reportReason, setReportReason] = useState('')
  const [reportSent, setReportSent] = useState(false)
  const [reportError, setReportError] = useState<string | null>(null)

  useEffect(() => {
    if (books.length === 0) fetchBooks()
  }, [books.length, fetchBooks])

  const book = useMemo(() => books.find((b) => b.id === bookId), [books, bookId])
  const isFavorite = !!book && favorites.includes(book.id)

  if (!bookId) return null

  if (!book) {
    return (
      <Container>
        <Card>
          <div className="text-sm text-slate-600">Livre introuvable.</div>
          <div className="mt-3">
            <Link className="text-amber-800 hover:underline" to="/books">
              Retour à la liste
            </Link>
          </div>
        </Card>
      </Container>
    )
  }

  const currentBook = book

  const statusTone =
    book.status === 'Vendu' ? 'rose' : book.status === 'Réservé' ? 'amber' : 'green'

  async function contactSeller() {
    if (!user) {
      navigate('/auth', { state: { from: `/books/${currentBook.id}` } })
      return
    }
    const convId = await openConversationForBook({
      bookId: currentBook.id,
      buyerUserId: user.id,
      sellerUserId: currentBook.seller.id,
    })
    navigate('/messages', { state: { conversationId: convId } })
  }

  function buyNow() {
    if (!user) {
      navigate('/auth', { state: { from: `/books/${currentBook.id}` } })
      return
    }
    navigate(`/payment?bookId=${encodeURIComponent(currentBook.id)}`)
  }

  async function sendReport() {
    setReportError(null)
    setReportSent(false)
    try {
      await mockApi.createReport({
        target: 'Livre',
        targetId: currentBook.id,
        reason: reportReason.trim() || 'Signalement sans précision.',
      })
      setReportSent(true)
      setReportReason('')
    } catch (e) {
      setReportError((e as Error).message)
    }
  }

  return (
    <Container>
      <div className="grid gap-4">
        <Card>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-900">{book.title}</div>
              <div className="mt-1 text-sm text-slate-600">{book.author}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone={statusTone}>{book.status}</Badge>
                <Badge tone="slate">{book.category}</Badge>
                <Badge tone="amber">{book.condition}</Badge>
                <Badge tone="slate">{book.location}</Badge>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 md:items-end">
              <div className="text-lg font-semibold text-slate-900">
                {formatXof(book.priceXof)}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={contactSeller}>
                  Contacter le vendeur
                </Button>
                <Button onClick={buyNow}>Acheter</Button>
              </div>
              <Button
                variant={isFavorite ? 'secondary' : 'ghost'}
                onClick={() => (user ? toggleFavorite(user.id, book.id) : navigate('/auth'))}
              >
                {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">Photos</div>
              {book.photos.length ? (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {book.photos.map((p) => (
                    <img
                      key={p}
                      src={p}
                      alt="Photo du livre"
                      className="h-36 w-full rounded-lg object-cover"
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-3 grid gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={coverForCategory(book.category)}
                      alt={`Illustration de couverture (${book.category})`}
                      className="h-28 w-24 rounded-lg border border-slate-200 bg-white object-cover"
                      loading="lazy"
                    />
                    <div className="text-sm text-slate-600">
                      Pas de photo (démo). Ajoute des photos lors de la publication.
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold text-slate-900">Description</div>
              <div className="mt-2 text-sm text-slate-700 whitespace-pre-line">
                {book.description}
              </div>
              <div className="mt-4 border-t border-slate-200 pt-4">
                <div className="text-sm font-semibold text-slate-900">Vendeur</div>
                <div className="mt-1 text-sm text-slate-700">
                  {book.seller.displayName}
                </div>
                <div className="text-xs text-slate-500">
                  Note: {book.seller.rating.toFixed(1)} ({book.seller.reviewsCount} avis)
                  {book.seller.location ? ` • ${book.seller.location}` : ''}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold text-slate-900">Signaler</div>
          <div className="mt-2 text-sm text-slate-600">
            Signale un livre ou un comportement suspect pour modération.
          </div>
          <div className="mt-3 grid gap-2">
            <Textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Raison du signalement…"
              rows={3}
            />
            <div className="flex gap-2">
              <Button variant="danger" onClick={sendReport}>
                Envoyer le signalement
              </Button>
            </div>
            {reportSent ? (
              <div className="text-sm text-emerald-700">Signalement envoyé.</div>
            ) : null}
            {reportError ? (
              <div className="text-sm text-rose-700">{reportError}</div>
            ) : null}
          </div>
        </Card>
      </div>
    </Container>
  )
}
