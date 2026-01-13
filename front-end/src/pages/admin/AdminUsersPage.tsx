import { useEffect, useState } from 'react'

import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { mockApi } from '../../api/mockApi'
import type { User } from '../../types'

import adminIllustration from '../../assets/illustrations/admin.svg'

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      const u = await mockApi.listUsers()
      setUsers(u)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function toggleBlocked(user: User) {
    const updated = await mockApi.setUserBlocked(user.id, !user.isBlocked)
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
  }

  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="min-w-0">
              <div className="text-lg font-semibold text-slate-900">Gestion des utilisateurs</div>
              <div className="mt-1 text-sm text-slate-600">Activer / bloquer (démo).</div>
            </div>
            <div className="hidden md:block md:w-[140px]">
              <img src={adminIllustration} alt="" className="h-auto w-full" loading="lazy" />
            </div>
          </div>
          <Button variant="secondary" onClick={refresh}>
            Rafraîchir
          </Button>
        </div>
        {error ? <div className="mt-3 text-sm text-rose-700">{error}</div> : null}
      </Card>

      <Card>
        {loading ? (
          <div className="text-sm text-slate-600">Chargement…</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2">Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-slate-200">
                    <td className="py-2 font-medium text-slate-900">{u.displayName}</td>
                    <td>{u.email ?? '-'}</td>
                    <td>{u.phone ?? '-'}</td>
                    <td>{u.role}</td>
                    <td>{u.isBlocked ? 'Bloqué' : 'Actif'}</td>
                    <td className="text-right">
                      <Button
                        variant={u.isBlocked ? 'secondary' : 'danger'}
                        onClick={() => toggleBlocked(u)}
                      >
                        {u.isBlocked ? 'Débloquer' : 'Bloquer'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
