import { Link } from 'react-router-dom'
import type { Book } from '../types'
import { formatXof } from '../lib/format'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'

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

export function BookCard({
  book,
  isFavorite,
  onToggleFavorite,
}: {
  book: Book
  isFavorite: boolean
  onToggleFavorite?: () => void
}) {
  const tone =
    book.status === 'Vendu'
      ? 'rose'
      : book.status === 'Réservé'
        ? 'amber'
        : 'green'

  const coverSrc = book.photos[0] ?? coverForCategory(book.category)
  const coverAlt = book.photos[0]
    ? `Couverture de ${book.title}`
    : `Illustration de couverture (${book.category})`

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:bg-stone-50">
      <div className="flex gap-4">
        <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-stone-50 to-stone-100">
          <img
            src={coverSrc}
            alt={coverAlt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                to={`/books/${book.id}`}
                className="line-clamp-2 text-base font-semibold text-slate-900 hover:underline"
              >
                {book.title}
              </Link>
              <div className="mt-1 truncate text-sm text-slate-600">{book.author}</div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <Badge tone={tone}>{book.status}</Badge>
              <div className="text-sm font-semibold text-slate-900">
                {formatXof(book.priceXof)}
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone="slate">{book.category}</Badge>
            <Badge tone="amber">{book.condition}</Badge>
            <Badge tone="slate">{book.location}</Badge>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="truncate text-xs text-slate-500">
              Vendeur:{' '}
              <span className="font-medium text-slate-700">{book.seller.displayName}</span>
            </div>
            {onToggleFavorite ? (
              <Button
                type="button"
                variant={isFavorite ? 'secondary' : 'ghost'}
                onClick={onToggleFavorite}
              >
                {isFavorite ? 'Retirer favori' : 'Ajouter favori'}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
