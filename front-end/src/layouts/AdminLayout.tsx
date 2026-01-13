import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../stores/authStore'
import { PageBackground } from '../components/PageBackground'

export function AdminLayout() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  return (
    <div className="relative min-h-full bg-slate-50 text-slate-900">
      <PageBackground variant="admin" />
      <header className="border-b border-slate-200 bg-white">
        <Container>
          <div className="flex items-center justify-between py-4">
            <div className="text-base font-semibold">Back-office</div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/')}
                >
                Retour site
              </Button>
              <Button variant="ghost" onClick={() => logout()}>
                Déconnexion
              </Button>
            </div>
          </div>
        </Container>
      </header>

      <Container>
        <div className="grid gap-6 py-6 md:grid-cols-[240px_1fr]">
          <aside className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <nav className="flex flex-col gap-1">
              <AdminLink to="/admin">Dashboard</AdminLink>
              <AdminLink to="/admin/users">Utilisateurs</AdminLink>
              <AdminLink to="/admin/books">Livres</AdminLink>
              <AdminLink to="/admin/reports">Signalements</AdminLink>
            </nav>
          </aside>
          <div className="relative">
            <Outlet />
          </div>
        </div>
      </Container>
    </div>
  )
}

function AdminLink({ to, children }: { to: string; children: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/admin'}
      className={({ isActive }) =>
        [
          'rounded-md px-3 py-2 text-sm font-medium',
          isActive ? 'bg-amber-50 text-amber-900' : 'text-slate-700 hover:bg-slate-50',
        ].join(' ')
      }
    >
      {children}
    </NavLink>
  )
}
