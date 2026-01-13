import { useEffect, useMemo } from 'react'

import { Card } from '../../components/ui/Card'
import { useMarketStore } from '../../stores/marketStore'
import { useAuthStore } from '../../stores/authStore'

import adminIllustration from '../../assets/illustrations/admin.svg'

export function AdminDashboardPage() {
  const { books, fetchBooks } = useMarketStore()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  const stats = useMemo(() => {
    const totalBooks = books.length
    const available = books.filter((b) => b.status === 'Disponible').length
    const reserved = books.filter((b) => b.status === 'Réservé').length
    const sold = books.filter((b) => b.status === 'Vendu').length
    return { totalBooks, available, reserved, sold }
  }, [books])

  if (!user) return null

  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-lg font-semibold text-slate-900">Dashboard admin</div>
            <div className="mt-2 text-sm text-slate-600">
              Statistiques (démo).
            </div>
          </div>
          <div className="hidden md:block md:w-[240px]">
            <img src={adminIllustration} alt="" className="h-auto w-full" loading="lazy" />
          </div>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat title="Livres" value={stats.totalBooks} />
        <Stat title="Disponibles" value={stats.available} />
        <Stat title="Réservés" value={stats.reserved} />
        <Stat title="Vendus" value={stats.sold} />
      </div>

      <Card>
        <div className="text-sm font-semibold text-slate-900">Raccourcis</div>
        <div className="mt-2 text-sm text-slate-600">
          Comptes admin peuvent gérer utilisateurs, livres et signalements.
        </div>
        <div className="mt-3 text-xs text-slate-500">
          Démo: les données viennent d’un mock localStorage.
        </div>
      </Card>
    </div>
  )
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-medium text-slate-500">{title}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  )
}
