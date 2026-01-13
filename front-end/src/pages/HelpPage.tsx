import { Container } from '../components/ui/Container'
import { Card } from '../components/ui/Card'

import helpIllustration from '../assets/illustrations/help.svg'

export function HelpPage() {
  return (
    <Container>
      <div className="mx-auto max-w-3xl grid gap-4">
        <Card>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-xl font-semibold text-slate-900">Aide / FAQ</div>
              <div className="mt-3 text-sm text-slate-700 leading-6">
            <div className="font-semibold">Comment vendre un livre ?</div>
            <div>Va sur “Vendre un livre”, remplis le formulaire et publie.</div>
            <div className="mt-3 font-semibold">Comment contacter un vendeur ?</div>
            <div>Ouvre la page d’un livre puis clique sur “Contacter le vendeur”.</div>
            <div className="mt-3 font-semibold">Paiement et livraison ?</div>
            <div>Selon le modèle: paiement intégré ou vente directe via rendez-vous (démo).</div>
              </div>
            </div>
            <div className="hidden md:block md:w-[240px]">
              <img src={helpIllustration} alt="" className="h-auto w-full" loading="lazy" />
            </div>
          </div>
        </Card>
      </div>
    </Container>
  )
}
