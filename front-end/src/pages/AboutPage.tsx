import { Container } from '../components/ui/Container'
import { Card } from '../components/ui/Card'

import readingIllustration from '../assets/illustrations/reading.svg'

export function AboutPage() {
  return (
    <Container>
      <div className="mx-auto max-w-3xl">
        <Card>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-xl font-semibold text-slate-900">À propos</div>
              <div className="mt-3 text-sm text-slate-700 leading-6">
                BookMarket met en relation des acheteurs et des vendeurs de livres, avec un fort accent sur la seconde main.
                L’objectif est de faciliter l’accès aux livres et permettre aux particuliers de monétiser leurs livres inutilisés.
              </div>
            </div>
            <div className="hidden md:block md:w-[240px]">
              <img src={readingIllustration} alt="" className="h-auto w-full" loading="lazy" />
            </div>
          </div>
        </Card>
      </div>
    </Container>
  )
}
