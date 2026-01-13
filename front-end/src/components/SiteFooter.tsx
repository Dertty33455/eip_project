import { Link } from 'react-router-dom'
import { Container } from './ui/Container'

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-stone-50">
      <Container>
        <div className="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-600">
            © {new Date().getFullYear()} BookMarket
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link className="text-slate-700 hover:underline hover:text-amber-800" to="/about">
              À propos
            </Link>
            <Link className="text-slate-700 hover:underline hover:text-amber-800" to="/help">
              Aide / FAQ
            </Link>
            <Link className="text-slate-700 hover:underline hover:text-amber-800" to="/terms">
              Conditions
            </Link>
            <Link className="text-slate-700 hover:underline hover:text-amber-800" to="/privacy">
              Confidentialité
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
