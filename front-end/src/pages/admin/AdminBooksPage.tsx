import { useEffect } from 'react'

import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useMarketStore } from '../../stores/marketStore'
import { Badge } from '../../components/ui/Badge'

import adminIllustration from '../../assets/illustrations/admin.svg'

export function AdminBooksPage() {
  const { books, fetchBooks, deleteBook } = useMarketStore()

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-lg font-semibold text-slate-900">Gestion des livres</div>
            <div className="mt-1 text-sm text-slate-600">Supprimer annonces frauduleuses (démo).</div>
          </div>
          <div className="hidden md:block md:w-[220px]">
            <img src={adminIllustration} alt="" className="h-auto w-full" loading="lazy" />
          </div>
        </div>
      </Card>

      <div className="grid gap-3">
        {books.map((b) => (
          <Card key={b.id}>
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-base font-semibold text-slate-900">{b.title}</div>
                <div className="text-sm text-slate-600">{b.author} • {b.location}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge tone="slate">{b.category}</Badge>
                  <Badge tone={b.status === 'Vendu' ? 'rose' : b.status === 'Réservé' ? 'amber' : 'green'}>
                    {b.status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="danger" onClick={() => deleteBook(b.id)}>
                  Supprimer
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
