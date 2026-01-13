import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Container } from '../components/ui/Container'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { BookCard } from '../components/BookCard'
import { categories } from '../data/mockSeed'
import type { BookCondition } from '../types'
import { useMarketStore, type BookSort } from '../stores/marketStore'
import { useAuthStore } from '../stores/authStore'

import readingIllustration from '../assets/illustrations/reading.svg'

export function BooksListPage() {
  const [params, setParams] = useSearchParams()
  const { user } = useAuthStore()
  const { books, isLoading, fetchBooks, favorites, toggleFavorite } = useMarketStore()

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  const [query, setQuery] = useState(params.get('q') ?? '')
  const [category, setCategory] = useState(params.get('category') ?? '')
  const [condition, setCondition] = useState<'' | BookCondition>(
    (params.get('condition') as BookCondition) ?? '',
  )
  const [location, setLocation] = useState(params.get('location') ?? '')
  const [priceMin, setPriceMin] = useState(params.get('min') ?? '')
  const [priceMax, setPriceMax] = useState(params.get('max') ?? '')
  const [sort, setSort] = useState<BookSort>((params.get('sort') as BookSort) ?? 'Date')

  const filtered = useMemo(() => {
    const min = priceMin ? Number(priceMin) : null
    const max = priceMax ? Number(priceMax) : null

    let list = books
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q),
      )
    }
    if (category) list = list.filter((b) => b.category === category)
    if (condition) list = list.filter((b) => b.condition === condition)
    if (location.trim()) {
      const loc = location.trim().toLowerCase()
      list = list.filter((b) => b.location.toLowerCase().includes(loc))
    }
    if (min !== null && !Number.isNaN(min)) list = list.filter((b) => b.priceXof >= min)
    if (max !== null && !Number.isNaN(max)) list = list.filter((b) => b.priceXof <= max)

    if (sort === 'Prix') {
      list = [...list].sort((a, b) => a.priceXof - b.priceXof)
    } else if (sort === 'Popularité') {
      list = [...list].sort(
        (a, b) =>
          b.views + b.favoritesCount - (a.views + a.favoritesCount),
      )
    } else {
      list = [...list].sort((a, b) => b.publishedAtISO.localeCompare(a.publishedAtISO))
    }
    return list
  }, [books, category, condition, location, priceMax, priceMin, query, sort])

  function applyFilters() {
    const next = new URLSearchParams()
    if (query.trim()) next.set('q', query.trim())
    if (category) next.set('category', category)
    if (condition) next.set('condition', condition)
    if (location.trim()) next.set('location', location.trim())
    if (priceMin.trim()) next.set('min', priceMin.trim())
    if (priceMax.trim()) next.set('max', priceMax.trim())
    if (sort) next.set('sort', sort)
    setParams(next)
  }

  function resetFilters() {
    setQuery('')
    setCategory('')
    setCondition('')
    setLocation('')
    setPriceMin('')
    setPriceMax('')
    setSort('Date')
    setParams(new URLSearchParams())
  }

  return (
    <Container>
      <div className="grid gap-4">
        <Card>
          <div className="text-lg font-semibold text-slate-900">Liste des livres</div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="md:col-span-3">
              <label className="grid gap-1">
                <div className="text-sm font-medium text-slate-700">Recherche</div>
                <Input value={query} onChange={(e) => setQuery(e.target.value)} />
              </label>
            </div>
            <label className="grid gap-1">
              <div className="text-sm font-medium text-slate-700">Catégorie</div>
              <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Toutes</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </label>
            <label className="grid gap-1">
              <div className="text-sm font-medium text-slate-700">État</div>
              <Select
                value={condition}
                onChange={(e) => setCondition(e.target.value as '' | BookCondition)}
              >
                <option value="">Tous</option>
                <option value="Neuf">Neuf</option>
                <option value="Occasion">Occasion</option>
              </Select>
            </label>
            <label className="grid gap-1">
              <div className="text-sm font-medium text-slate-700">Localisation</div>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ville / quartier"
              />
            </label>
            <label className="grid gap-1">
              <div className="text-sm font-medium text-slate-700">Prix min</div>
              <Input value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
            </label>
            <label className="grid gap-1">
              <div className="text-sm font-medium text-slate-700">Prix max</div>
              <Input value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
            </label>
            <label className="grid gap-1">
              <div className="text-sm font-medium text-slate-700">Tri</div>
              <Select value={sort} onChange={(e) => setSort(e.target.value as BookSort)}>
                <option value="Date">Date</option>
                <option value="Prix">Prix</option>
                <option value="Popularité">Popularité</option>
              </Select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" onClick={applyFilters}>
              Appliquer
            </Button>
            <Button type="button" variant="ghost" onClick={resetFilters}>
              Réinitialiser
            </Button>
          </div>
        </Card>

        {isLoading ? (
          <div className="text-sm text-slate-600">Chargement…</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Aucun livre trouvé"
            description="Change les filtres ou essaie une autre recherche."
            illustrationSrc={readingIllustration}
            illustrationAlt=""
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map((b) => (
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
        )}
      </div>
    </Container>
  )
}
