import { useEffect, useMemo } from 'react'

import { Container } from '../components/ui/Container'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { BookCard } from '../components/BookCard'
import { useAuthStore } from '../stores/authStore'
import { useMarketStore } from '../stores/marketStore'

import favoritesIllustration from '../assets/illustrations/favorites.svg'

export function FavoritesPage() {
  const { user } = useAuthStore()
  const { books, favorites, fetchBooks, fetchFavorites, toggleFavorite } = useMarketStore()

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  useEffect(() => {
    if (!user) return
    fetchFavorites(user.id)
  }, [fetchFavorites, user])

  const favoriteBooks = useMemo(() => {
    return books.filter((b) => favorites.includes(b.id))
  }, [books, favorites])

  if (!user) return null

  return (
    <Container>
      <div className="grid gap-4">
        <Card>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-lg font-semibold text-slate-900">Favoris</div>
              <div className="mt-2 text-sm text-slate-600">Livres enregistrés pour plus tard.</div>
            </div>
            <div className="hidden md:block md:w-[220px]">
              <img src={favoritesIllustration} alt="" className="h-auto w-full" loading="lazy" />
            </div>
          </div>
        </Card>

        {favoriteBooks.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {favoriteBooks.map((b) => (
              <BookCard
                key={b.id}
                book={b}
                isFavorite={true}
                onToggleFavorite={() => toggleFavorite(user.id, b.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aucun favori"
            description="Ajoute des livres en favoris depuis la liste ou la page détails."
            illustrationSrc={favoritesIllustration}
            illustrationAlt=""
          />
        )}
      </div>
    </Container>
  )
}
