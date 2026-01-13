import { useEffect, useState } from 'react'

import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { mockApi } from '../../api/mockApi'
import type { Report } from '../../types'

import adminIllustration from '../../assets/illustrations/admin.svg'

export function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(false)

  async function refresh() {
    setLoading(true)
    const r = await mockApi.listReports()
    setReports(r)
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  async function resolve(reportId: string) {
    await mockApi.resolveReport(reportId)
    await refresh()
  }

  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="min-w-0">
              <div className="text-lg font-semibold text-slate-900">Signalements</div>
              <div className="mt-1 text-sm text-slate-600">Livres ou utilisateurs signalés.</div>
            </div>
            <div className="hidden md:block md:w-[140px]">
              <img src={adminIllustration} alt="" className="h-auto w-full" loading="lazy" />
            </div>
          </div>
          <Button variant="secondary" onClick={refresh}>
            Rafraîchir
          </Button>
        </div>
      </Card>

      <Card>
        {loading ? (
          <div className="text-sm text-slate-600">Chargement…</div>
        ) : reports.length ? (
          <div className="grid gap-3">
            {reports.map((r) => (
              <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {r.target} • {r.targetId}
                    </div>
                    <div className="mt-1 text-sm text-slate-700">{r.reason}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={r.status === 'Traité' ? 'green' : 'amber'}>{r.status}</Badge>
                    {r.status !== 'Traité' ? (
                      <Button onClick={() => resolve(r.id)}>Marquer traité</Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aucun signalement"
            description="Quand un utilisateur signale un livre ou un compte, ça apparaîtra ici."
            illustrationSrc={adminIllustration}
            illustrationAlt=""
          />
        )}
      </Card>
    </div>
  )
}
