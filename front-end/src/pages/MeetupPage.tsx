import { useState } from 'react'

import { Container } from '../components/ui/Container'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'

import meetupIllustration from '../assets/illustrations/meetup.svg'

export function MeetupPage() {
  const [place, setPlace] = useState('')
  const [dateTime, setDateTime] = useState('')
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  return (
    <Container>
      <div className="mx-auto max-w-2xl grid gap-4">
        <Card>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-lg font-semibold text-slate-900">Rendez-vous / Localisation</div>
              <div className="mt-2 text-sm text-slate-600">
                Optionnel: fixe un lieu de rencontre et partage les infos.
              </div>
            </div>
            <div className="hidden md:block md:w-[240px]">
              <img src={meetupIllustration} alt="" className="h-auto w-full" loading="lazy" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="grid gap-3">
            <label className="grid gap-1">
              <div className="text-sm font-medium text-slate-700">Lieu</div>
              <Input
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="ex: Gare, Université, Centre commercial…"
              />
            </label>
            <label className="grid gap-1">
              <div className="text-sm font-medium text-slate-700">Date & heure</div>
              <Input
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                placeholder="ex: Samedi 14h"
              />
            </label>
            <label className="grid gap-1">
              <div className="text-sm font-medium text-slate-700">Notes</div>
              <Textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Point de repère, numéro, instructions…"
              />
            </label>

            <div className="flex gap-2">
              <Button onClick={() => setSaved(true)}>Enregistrer</Button>
              <Button variant="ghost" onClick={() => { setPlace(''); setDateTime(''); setNotes(''); setSaved(false) }}>
                Réinitialiser
              </Button>
            </div>
            {saved ? (
              <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">
                Rendez-vous enregistré (démo). Tu peux copier/partager les infos.
              </div>
            ) : null}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">Carte</div>
              <div className="mt-2 text-sm text-slate-600">
                Démo: emplacement carte (intégration possible plus tard).
              </div>
              <div className="mt-3 h-48 rounded-lg bg-white border border-slate-200" />
            </div>
          </div>
        </Card>
      </div>
    </Container>
  )
}
