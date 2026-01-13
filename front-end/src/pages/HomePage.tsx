import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo } from 'react'

import { Container } from '../components/ui/Container'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useMarketStore } from '../stores/marketStore'
import { categories } from '../data/mockSeed'
import { BookCard } from '../components/BookCard'
import { useAuthStore } from '../stores/authStore'

import readingIllustration from '../assets/illustrations/reading.svg'

export function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { books, favorites, fetchBooks, toggleFavorite } = useMarketStore()

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  const recent = useMemo(() => {
    return [...books]
      .sort((a, b) => b.publishedAtISO.localeCompare(a.publishedAtISO))
      .slice(0, 6)
  }, [books])

  const popular = useMemo(() => {
    return [...books]
      .sort(
        (a, b) =>
          b.views + b.favoritesCount - (a.views + a.favoritesCount),
      )
      .slice(0, 6)
  }, [books])

  return (
    <Container>
      <div className="grid gap-6">
        <Card className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="text-2xl font-bold text-slate-900">
                Marketplace de livres (neufs & d’occasion)
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Trouve des livres moins chers, et vends facilement tes livres inutilisés.
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="indigo">Seconde main</Badge>
                <Badge tone="green">Paiement flexible</Badge>
                <Badge tone="slate">Confiance & avis</Badge>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <div className="hidden md:block md:w-[240px]">
                <img
                  src={readingIllustration}
                  alt=""
                  className="h-auto w-full"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="secondary" onClick={() => navigate('/books')}>
                  Explorer les livres
                </Button>
                <Button
                  onClick={() => (user ? navigate('/sell') : navigate('/auth'))}
                >
                  Vendre un livre
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-slate-900">Catégories</div>
            <Link className="text-sm text-amber-800 hover:underline" to="/books">
              Voir tout
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {categories.slice(0, 8).map((c) => (
              <Link
                key={c}
                to={`/books?category=${encodeURIComponent(c)}`}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-800 shadow-sm hover:bg-stone-50"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-slate-900">Livres récents</div>
            <Link className="text-sm text-amber-800 hover:underline" to="/books">
              Voir la liste
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {recent.map((b) => (
              <BookCard
                key={b.id}
                book={b}
                isFavorite={favorites.includes(b.id)}
                onToggleFavorite={
                  user ? () => toggleFavorite(user.id, b.id) : undefined
                }
              />
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="text-lg font-semibold text-slate-900">Populaires</div>
          <div className="grid gap-3 md:grid-cols-2">
            {popular.map((b) => (
              <BookCard
                key={b.id}
                book={b}
                isFavorite={favorites.includes(b.id)}
                onToggleFavorite={
                  user ? () => toggleFavorite(user.id, b.id) : undefined
                }
              />
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
