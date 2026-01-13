import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Container } from '../components/ui/Container'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuthStore } from '../stores/authStore'

import authIllustration from '../assets/illustrations/auth.svg'

type Tab = 'login' | 'register' | 'forgot'

export function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, login, isLoading, error } = useAuthStore()
  const [tab, setTab] = useState<Tab>('login')
  const [identifier, setIdentifier] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPhone, setRegisterPhone] = useState('')
  const [forgotId, setForgotId] = useState('')
  const [forgotSent, setForgotSent] = useState(false)

  const redirectTo = useMemo(() => {
    const state = location.state as { from?: string } | null
    return state?.from ?? '/'
  }, [location.state])

  if (user) {
    navigate(redirectTo, { replace: true })
  }

  return (
    <Container>
      <div className="mx-auto max-w-xl">
        <Card className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="text-xl font-semibold text-slate-900">Connexion / Inscription</div>
              <div className="mt-2 text-sm text-slate-600">
                Connecte-toi pour vendre, acheter, discuter et gérer tes annonces.
              </div>
            </div>
            <div className="hidden md:block md:w-[220px]">
              <img src={authIllustration} alt="" className="h-auto w-full" loading="lazy" />
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <TabButton active={tab === 'login'} onClick={() => setTab('login')}>
              Connexion
            </TabButton>
            <TabButton
              active={tab === 'register'}
              onClick={() => setTab('register')}
            >
              Inscription
            </TabButton>
            <TabButton active={tab === 'forgot'} onClick={() => setTab('forgot')}>
              Mot de passe oublié
            </TabButton>
          </div>

          {tab === 'login' ? (
            <div className="mt-5 grid gap-3">
              <label className="grid gap-1">
                <div className="text-sm font-medium text-slate-700">Email ou téléphone</div>
                <Input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="ex: admin@demo.com ou +225..."
                />
              </label>
              {error ? <div className="text-sm text-rose-700">{error}</div> : null}
              <Button
                disabled={!identifier.trim() || isLoading}
                onClick={() => login(identifier).then(() => navigate(redirectTo))}
              >
                Se connecter
              </Button>

              <div className="grid gap-2 border-t border-slate-200 pt-4">
                <div className="text-sm font-medium text-slate-700">Ou</div>
                <Button
                  variant="secondary"
                  onClick={() => login('user@gmail.com').then(() => navigate(redirectTo))}
                >
                  Continuer avec Google (démo)
                </Button>
              </div>
            </div>
          ) : null}

          {tab === 'register' ? (
            <div className="mt-5 grid gap-3">
              <label className="grid gap-1">
                <div className="text-sm font-medium text-slate-700">Email</div>
                <Input
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="ex: moi@email.com"
                />
              </label>
              <label className="grid gap-1">
                <div className="text-sm font-medium text-slate-700">Téléphone</div>
                <Input
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  placeholder="ex: +225..."
                />
              </label>
              <div className="text-xs text-slate-500">
                Démo: l’inscription crée un compte local (mock).
              </div>
              <Button
                disabled={isLoading || (!registerEmail.trim() && !registerPhone.trim())}
                onClick={() =>
                  login(registerEmail || registerPhone).then(() => navigate(redirectTo))
                }
              >
                Créer un compte
              </Button>
            </div>
          ) : null}

          {tab === 'forgot' ? (
            <div className="mt-5 grid gap-3">
              <label className="grid gap-1">
                <div className="text-sm font-medium text-slate-700">Email ou téléphone</div>
                <Input
                  value={forgotId}
                  onChange={(e) => setForgotId(e.target.value)}
                  placeholder="ex: moi@email.com"
                />
              </label>
              <Button
                variant="secondary"
                disabled={!forgotId.trim()}
                onClick={() => setForgotSent(true)}
              >
                Envoyer un lien / code
              </Button>
              {forgotSent ? (
                <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">
                  Si un compte existe, un lien/code de réinitialisation a été envoyé (démo).
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-6 text-xs text-slate-500">
            Démo admin: connecte-toi avec <span className="font-medium">admin@demo.com</span>
          </div>
        </Card>
      </div>
    </Container>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-md px-3 py-2 text-sm font-medium',
        active
          ? 'bg-amber-50 text-amber-900'
          : 'text-slate-700 hover:bg-slate-50',
      ].join(' ')}
    >
      {children}
    </button>
  )
}
