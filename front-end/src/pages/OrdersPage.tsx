import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { Container } from '../components/ui/Container'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { useAuthStore } from '../stores/authStore'
import { useOrdersStore } from '../stores/ordersStore'
import { useMarketStore } from '../stores/marketStore'
import { formatXof } from '../lib/format'

import ordersIllustration from '../assets/illustrations/orders.svg'
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

export function OrdersPage() {
  const { user } = useAuthStore()
  const { orders, fetchOrders, isLoading } = useOrdersStore()
  const { books, fetchBooks } = useMarketStore()

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  useEffect(() => {
    if (!user) return
    fetchOrders(user.id)
  }, [fetchOrders, user])

  const enriched = useMemo(() => {
    return orders.map((o) => ({
      order: o,
      book: books.find((b) => b.id === o.bookId),
    }))
  }, [books, orders])

  if (!user) return null

  return (
    <Container>
      <div className="grid gap-4">
        <Card>
          <div className="text-lg font-semibold text-slate-900">Commandes / Achats</div>
          <div className="mt-2 text-sm text-slate-600">
            Historique des achats et statuts.
          </div>
        </Card>

        {isLoading ? (
          <div className="text-sm text-slate-600">Chargement…</div>
        ) : enriched.length ? (
          <div className="grid gap-3">
            {enriched.map(({ order, book }) => (
              <Card key={order.id}>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <img
                      src={book?.photos[0] ?? (book ? coverForCategory(book.category) : coverPlaceholder)}
                      alt={book ? `Couverture de ${book.title}` : 'Couverture'}
                      className="mt-0.5 h-14 w-12 shrink-0 rounded-lg border border-slate-200 bg-white object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                    <div className="text-base font-semibold text-slate-900">
                      {book ? (
                        <Link className="hover:underline" to={`/books/${book.id}`}>
                          {book.title}
                        </Link>
                      ) : (
                        'Livre'
                      )}
                    </div>
                    <div className="text-sm text-slate-600">
                      Paiement: {order.paymentMethod} • Montant: {formatXof(order.amountXof)}
                    </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={order.status === 'Terminé' ? 'green' : order.status === 'Annulé' ? 'rose' : 'amber'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aucune commande"
            description="Quand tu achèteras un livre, tes commandes apparaîtront ici."
            illustrationSrc={ordersIllustration}
            illustrationAlt=""
          />
        )}
      </div>
    </Container>
  )
}
