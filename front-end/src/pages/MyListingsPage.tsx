import { useEffect, useMemo, useState } from 'react'

import { Container } from '../components/ui/Container'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { Textarea } from '../components/ui/Textarea'
import { useAuthStore } from '../stores/authStore'
import { useMarketStore } from '../stores/marketStore'
import type { BookStatus } from '../types'
import { categories } from '../data/mockSeed'

import sellIllustration from '../assets/illustrations/sell.svg'

export function MyListingsPage() {
  const { user } = useAuthStore()
  const { books, fetchBooks, deleteBook, setBookStatus, updateBook } = useMarketStore()
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  const myBooks = useMemo(() => {
    if (!user) return []
    return books.filter((b) => b.seller.id === user.id)
  }, [books, user])

  if (!user) return null

  return (
    <Container>
      <div className="grid gap-4">
        <Card>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="min-w-0">
                <div className="text-lg font-semibold text-slate-900">Mes annonces</div>
                <div className="text-sm text-slate-600">
                  Modifier / supprimer / marquer comme vendu.
                </div>
              </div>
              <div className="hidden md:block md:w-[160px]">
                <img src={sellIllustration} alt="" className="h-auto w-full" loading="lazy" />
              </div>
            </div>
            <Button onClick={() => (window.location.href = '/sell')}>Publier un livre</Button>
          </div>
        </Card>

        {myBooks.length ? (
          <div className="grid gap-3">
            {myBooks.map((b) => (
              <Card key={b.id}>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-base font-semibold text-slate-900">{b.title}</div>
                    <div className="text-sm text-slate-600">{b.author}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge tone="slate">{b.category}</Badge>
                      <Badge
                        tone={b.status === 'Vendu' ? 'rose' : b.status === 'Réservé' ? 'amber' : 'green'}
                      >
                        {b.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select
                      value={b.status}
                      onChange={(e) => setBookStatus(b.id, e.target.value as BookStatus)}
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="Réservé">Réservé</option>
                      <option value="Vendu">Vendu</option>
                    </Select>
                    <Button variant="secondary" onClick={() => setEditingId((p) => (p === b.id ? null : b.id))}>
                      {editingId === b.id ? 'Fermer' : 'Modifier'}
                    </Button>
                    <Button variant="danger" onClick={() => deleteBook(b.id)}>
                      Supprimer
                    </Button>
                  </div>
                </div>

                {editingId === b.id ? (
                  <EditPanel
                    initial={b}
                    onSave={(patch) => updateBook(b.id, patch)}
                  />
                ) : null}
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aucune annonce"
            description="Publie un livre pour commencer à vendre."
            illustrationSrc={sellIllustration}
            illustrationAlt=""
            action={<Button onClick={() => (window.location.href = '/sell')}>Vendre un livre</Button>}
          />
        )}
      </div>
    </Container>
  )
}

function EditPanel({
  initial,
  onSave,
}: {
  initial: {
    id: string
    title: string
    author: string
    category: string
    priceXof: number
    location: string
    description: string
  }
  onSave: (patch: { title: string; author: string; category: string; priceXof: number; location: string; description: string }) => void
}) {
  const [title, setTitle] = useState(initial.title)
  const [author, setAuthor] = useState(initial.author)
  const [category, setCategory] = useState(initial.category)
  const [price, setPrice] = useState(String(initial.priceXof))
  const [location, setLocation] = useState(initial.location)
  const [description, setDescription] = useState(initial.description)

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-sm font-semibold text-slate-900">Modifier l’annonce</div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <label className="grid gap-1">
          <div className="text-sm font-medium text-slate-700">Titre</div>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className="grid gap-1">
          <div className="text-sm font-medium text-slate-700">Auteur</div>
          <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </label>
        <label className="grid gap-1">
          <div className="text-sm font-medium text-slate-700">Catégorie</div>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </label>
        <label className="grid gap-1">
          <div className="text-sm font-medium text-slate-700">Prix</div>
          <Input value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <label className="grid gap-1 md:col-span-2">
          <div className="text-sm font-medium text-slate-700">Localisation</div>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
        <label className="grid gap-1 md:col-span-2">
          <div className="text-sm font-medium text-slate-700">Description</div>
          <Textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </div>
      <div className="mt-3">
        <Button
          onClick={() =>
            onSave({
              title: title.trim(),
              author: author.trim(),
              category,
              priceXof: Number(price) || initial.priceXof,
              location: location.trim(),
              description: description.trim(),
            })
          }
        >
          Enregistrer
        </Button>
      </div>
    </div>
  )
}
