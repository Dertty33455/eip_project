import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { Container } from '../components/ui/Container'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Select'
import { useAuthStore } from '../stores/authStore'
import { useMarketStore } from '../stores/marketStore'
import { useOrdersStore } from '../stores/ordersStore'
import type { PaymentMethod } from '../types'
import { formatXof } from '../lib/format'

import paymentIllustration from '../assets/illustrations/payment.svg'
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

export function PaymentPage() {
  const { user } = useAuthStore()
  const { books, fetchBooks } = useMarketStore()
  const { createOrder, isLoading, error } = useOrdersStore()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const bookId = params.get('bookId')

  const [method, setMethod] = useState<PaymentMethod>('Mobile Money')

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  const book = useMemo(() => {
    if (!bookId) return null
    return books.find((b) => b.id === bookId) ?? null
  }, [bookId, books])

  if (!user) return null

  if (!bookId || !book) {
    return (
      <Container>
        <Card>
          <div className="text-sm text-slate-700">Livre introuvable pour paiement.</div>
          <div className="mt-3">
            <Link to="/books" className="text-amber-800 hover:underline">
              Revenir à la liste
            </Link>
          </div>
        </Card>
      </Container>
    )
  }

  async function confirm() {
    if (!user || !book) return
    const order = await createOrder({
      bookId: book.id,
      buyerUserId: user.id,
      paymentMethod: method,
    })
    if (order) navigate('/orders')
  }

  return (
    <Container>
      <div className="mx-auto max-w-2xl grid gap-4">
        <Card>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-lg font-semibold text-slate-900">Paiement</div>
              <div className="mt-2 text-sm text-slate-600">
                Choisis un moyen de paiement puis confirme la commande.
              </div>
            </div>
            <div className="hidden md:block md:w-[240px]">
              <img src={paymentIllustration} alt="" className="h-auto w-full" loading="lazy" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <img
                src={book.photos[0] ?? coverForCategory(book.category)}
                alt={book.photos[0] ? `Couverture de ${book.title}` : `Illustration de couverture (${book.category})`}
                className="mt-0.5 h-14 w-12 shrink-0 rounded-lg border border-slate-200 bg-white object-cover"
                loading="lazy"
              />
              <div className="min-w-0">
                <div className="truncate text-base font-semibold text-slate-900">{book.title}</div>
                <div className="text-sm text-slate-600">Vendeur: {book.seller.displayName}</div>
              </div>
            </div>
            <div className="text-base font-semibold">{formatXof(book.priceXof)}</div>
          </div>

          <div className="mt-4 grid gap-1">
            <div className="text-sm font-medium text-slate-700">Moyen de paiement</div>
            <Select value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Cash">Cash</option>
              <option value="Carte">Carte</option>
            </Select>
            <div className="mt-2 text-xs text-slate-500">
              Démo: la confirmation crée une commande et réserve le livre.
            </div>
          </div>

          {error ? <div className="mt-3 text-sm text-rose-700">{error}</div> : null}

          <div className="mt-4 flex gap-2">
            <Button disabled={isLoading} onClick={confirm}>
              Confirmer
            </Button>
            <Button variant="ghost" onClick={() => navigate(`/books/${book.id}`)}>
              Annuler
            </Button>
          </div>
        </Card>
      </div>
    </Container>
  )
}
