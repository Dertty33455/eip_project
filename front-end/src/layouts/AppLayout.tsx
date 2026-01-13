import { Outlet } from 'react-router-dom'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { PageBackground } from '../components/PageBackground'

export function AppLayout() {
  return (
    <div className="relative min-h-full bg-slate-50 text-slate-900">
      <PageBackground variant="app" />
      <SiteHeader />
      <main className="relative py-6">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
