import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

import { Container } from './ui/Container'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { useAuthStore } from '../stores/authStore'
import { useMarketStore } from '../stores/marketStore'
import { useMessagingStore } from '../stores/messagingStore'

export function SiteHeader() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { favorites, fetchFavorites } = useMarketStore()
  const { conversations, fetchConversations } = useMessagingStore()
  const [q, setQ] = useState('')

  useEffect(() => {
    if (!user) return
    fetchFavorites(user.id)
    fetchConversations(user.id)
  }, [user, fetchFavorites, fetchConversations])

  const unread = useMemo(() => {
    if (!user) return 0
    return conversations.reduce(
      (sum, c) => sum + (c.unreadCountByUserId[user.id] ?? 0),
      0,
    )
  }, [conversations, user])

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-stone-50/90 backdrop-blur">
      <Container>
        <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="text-lg font-bold text-slate-900">
              BookMarket
            </Link>
            <div className="flex items-center gap-2 md:hidden">
              {user ? (
                <Button variant="ghost" onClick={() => logout()}>
                  Déconnexion
                </Button>
              ) : (
                <Button variant="primary" onClick={() => navigate('/auth')}>
                  Connexion
                </Button>
              )}
            </div>
          </div>

          <div className="flex w-full items-center gap-2 md:max-w-xl">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un livre, un auteur, une catégorie…"
            />
            <Button
              type="button"
              onClick={() => navigate(`/books?q=${encodeURIComponent(q)}`)}
            >
              Rechercher
            </Button>
          </div>

          <nav className="hidden items-center gap-3 md:flex">
            <NavLink
              to="/books"
              className={({ isActive }) =>
                [
                  'text-sm font-medium',
                  isActive ? 'text-amber-800' : 'text-slate-700 hover:text-slate-900',
                ].join(' ')
              }
            >
              Livres
            </NavLink>
            {user ? (
              <>
                <NavLink
                  to="/favorites"
                  className={({ isActive }) =>
                    [
                      'text-sm font-medium',
                      isActive ? 'text-amber-800' : 'text-slate-700 hover:text-slate-900',
                    ].join(' ')
                  }
                >
                  Favoris ({favorites.length})
                </NavLink>
                <NavLink
                  to="/messages"
                  className={({ isActive }) =>
                    [
                      'text-sm font-medium',
                      isActive ? 'text-amber-800' : 'text-slate-700 hover:text-slate-900',
                    ].join(' ')
                  }
                >
                  Messages{unread ? ` (${unread})` : ''}
                </NavLink>
                <NavLink
                  to="/my-listings"
                  className={({ isActive }) =>
                    [
                      'text-sm font-medium',
                      isActive ? 'text-amber-800' : 'text-slate-700 hover:text-slate-900',
                    ].join(' ')
                  }
                >
                  Mes annonces
                </NavLink>
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    [
                      'text-sm font-medium',
                      isActive ? 'text-amber-800' : 'text-slate-700 hover:text-slate-900',
                    ].join(' ')
                  }
                >
                  Commandes
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    [
                      'text-sm font-medium',
                      isActive ? 'text-amber-800' : 'text-slate-700 hover:text-slate-900',
                    ].join(' ')
                  }
                >
                  Profil
                </NavLink>

                <Button variant="secondary" onClick={() => navigate('/sell')}>
                  Vendre un livre
                </Button>
                {user.role === 'admin' ? (
                  <Button variant="ghost" onClick={() => navigate('/admin')}>
                    Admin
                  </Button>
                ) : null}
                <Button variant="ghost" onClick={() => logout()}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => navigate('/sell')}>
                  Vendre un livre
                </Button>
                <Button variant="primary" onClick={() => navigate('/auth')}>
                  Connexion / Inscription
                </Button>
              </>
            )}
          </nav>
        </div>
      </Container>
    </header>
  )
}
