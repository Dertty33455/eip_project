import { Container } from '../components/ui/Container'
import { Card } from '../components/ui/Card'

import legalIllustration from '../assets/illustrations/legal.svg'

export function PrivacyPage() {
  return (
    <Container>
      <div className="mx-auto max-w-3xl">
        <Card>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-xl font-semibold text-slate-900">Politique de confidentialité</div>
              <div className="mt-3 text-sm text-slate-700 leading-6">
                Texte légal à compléter (démo): quelles données sont collectées (téléphone, email), pourquoi,
                durée de conservation, droits utilisateurs, partage avec partenaires (paiement/livraison), sécurité.
              </div>
            </div>
            <div className="hidden md:block md:w-[240px]">
              <img src={legalIllustration} alt="" className="h-auto w-full" loading="lazy" />
            </div>
          </div>
        </Card>
      </div>
    </Container>
  )
}
