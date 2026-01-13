import { useEffect, useMemo, useState } from 'react'

import { Container } from '../components/ui/Container'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { useAuthStore } from '../stores/authStore'
import { useMarketStore } from '../stores/marketStore'
import { EmptyState } from '../components/ui/EmptyState'

import readingIllustration from '../assets/illustrations/reading.svg'

export function UserProfilePage() {
  const { user, updateProfile, isLoading } = useAuthStore()
  const { books, fetchBooks } = useMarketStore()

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  const myBooks = useMemo(() => {
    if (!user) return []
    return books.filter((b) => b.seller.id === user.id)
  }, [books, user])

  const [displayName, setDisplayName] = useState(user?.displayName ?? '')
  const [location, setLocation] = useState(user?.location ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')

  if (!user) return null

  return (
    <Container>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="text-lg font-semibold text-slate-900">Profil utilisateur</div>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1">
              <div className="text-sm font-medium text-slate-700">Nom</div>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </label>
            <label className="grid gap-1">
              <div className="text-sm font-medium text-slate-700">Téléphone</div>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label className="grid gap-1">
              <div className="text-sm font-medium text-slate-700">Localisation</div>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </label>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge tone={user.role === 'admin' ? 'indigo' : 'slate'}>
                {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
              </Badge>
              {user.isBlocked ? <Badge tone="rose">Bloqué</Badge> : <Badge tone="green">Actif</Badge>}
            </div>
            <Button
              disabled={isLoading}
              onClick={() => updateProfile({ displayName, location, phone })}
            >
              Modifier profil
            </Button>
          </div>
        </Card>

        <Card>
          <div className="text-lg font-semibold text-slate-900">Évaluations / avis</div>
          <div className="mt-2 text-sm text-slate-600">
            Démo: les avis apparaîtront après des ventes terminées.
          </div>
          <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
            Aucun avis pour le moment.
          </div>
        </Card>

        <Card className="md:col-span-2">
          <div className="text-lg font-semibold text-slate-900">Livres publiés</div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {myBooks.length ? (
              myBooks.map((b) => (
                <div key={b.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="font-semibold text-slate-900">{b.title}</div>
                  <div className="text-sm text-slate-600">{b.author}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge tone="slate">{b.category}</Badge>
                    <Badge tone="indigo">{b.condition}</Badge>
                    <Badge
                      tone={b.status === 'Vendu' ? 'rose' : b.status === 'Réservé' ? 'amber' : 'green'}
                    >
                      {b.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="Aucune annonce"
                description="Publie ton premier livre pour commencer à vendre."
                illustrationSrc={readingIllustration}
                illustrationAlt=""
                action={
                  <Button onClick={() => (window.location.href = '/sell')}>Publier un livre</Button>
                }
              />
            )}
          </div>
        </Card>
      </div>
    </Container>
  )
}
