import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Container } from '../components/ui/Container'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Textarea } from '../components/ui/Textarea'
import { categories } from '../data/mockSeed'
import type { BookCondition } from '../types'
import { useAuthStore } from '../stores/authStore'
import { useMarketStore } from '../stores/marketStore'

import sellIllustration from '../assets/illustrations/sell.svg'

export function PublishBookPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { publishBook, isLoading, error } = useMarketStore()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState(categories[0] ?? 'Romans')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [condition, setCondition] = useState<BookCondition>('Occasion')
  const [location, setLocation] = useState(user?.location ?? '')
  const [photos, setPhotos] = useState<string[]>([])

  const canPublish = useMemo(() => {
    return (
      !!user &&
      title.trim().length >= 2 &&
      author.trim().length >= 2 &&
      description.trim().length >= 10 &&
      Number(price) > 0 &&
      location.trim().length >= 2
    )
  }, [author, description, location, price, title, user])

  const MAX_PHOTOS = 4

  function readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(new Error('Lecture du fichier impossible'))
      reader.readAsDataURL(file)
    })
  }

  async function onSelectPhotos(files: FileList | null) {
    if (!files) return
    const picked = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (!picked.length) return

    const remainingSlots = Math.max(0, MAX_PHOTOS - photos.length)
    const toRead = picked.slice(0, remainingSlots)
    const urls: string[] = []
    for (const file of toRead) {
      // Store data URLs so they persist in localStorage (mock backend)
      // and keep working after refresh.
      // eslint-disable-next-line no-await-in-loop
      urls.push(await readFileAsDataUrl(file))
    }

    setPhotos((prev) => [...prev, ...urls])
  }

  async function onPublish() {
    if (!user) return
    const created = await publishBook({
      sellerUserId: user.id,
      title: title.trim(),
      author: author.trim(),
      category,
      description: description.trim(),
      priceXof: Number(price),
      condition,
      location: location.trim(),
      photos,
    })
    if (created) navigate(`/books/${created.id}`)
  }

  return (
    <Container>
      <div className="mx-auto max-w-3xl">
        <Card>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-xl font-semibold text-slate-900">Publier un livre</div>
              <div className="mt-2 text-sm text-slate-600">
                Renseigne les informations pour vendre (neuf ou occasion).
              </div>
            </div>
            <div className="hidden md:block md:w-[240px]">
              <img src={sellIllustration} alt="" className="h-auto w-full" loading="lazy" />
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="grid gap-1">
              <div className="text-sm font-medium text-slate-700">Titre</div>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label className="grid gap-1">
              <div className="text-sm font-medium text-slate-700">Auteur</div>
              <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
            </label>
            <label className="grid gap-1">
              <div className="text-sm font-medium text-slate-700">Catégorie</div>
              <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </label>
            <label className="grid gap-1">
              <div className="text-sm font-medium text-slate-700">État</div>
              <Select
                value={condition}
                onChange={(e) => setCondition(e.target.value as BookCondition)}
              >
                <option value="Neuf">Neuf</option>
                <option value="Occasion">Occasion</option>
              </Select>
            </label>

            <label className="grid gap-1 md:col-span-2">
              <div className="text-sm font-medium text-slate-700">Description</div>
              <Textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décris l’état, l’édition, les défauts, etc."
              />
            </label>

            <label className="grid gap-1">
              <div className="text-sm font-medium text-slate-700">Prix (FCFA)</div>
              <Input value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>
            <label className="grid gap-1">
              <div className="text-sm font-medium text-slate-700">Localisation</div>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ville / quartier"
              />
            </label>

            <div className="md:col-span-2">
              <div className="text-sm font-medium text-slate-700">Photos</div>
              <div className="mt-2 flex flex-col gap-3">
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => onSelectPhotos(e.target.files)}
                />
                {photos.length ? (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {photos.map((p) => (
                      <img
                        key={p}
                        src={p}
                        alt="Aperçu"
                        className="h-24 w-full rounded-lg object-cover"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-600">Ajoute 1 à 4 photos idéalement.</div>
                )}
              </div>
            </div>
          </div>

          {error ? <div className="mt-4 text-sm text-rose-700">{error}</div> : null}

          <div className="mt-5 flex gap-2">
            <Button disabled={!canPublish || isLoading} onClick={onPublish}>
              Publier
            </Button>
            <Button variant="ghost" onClick={() => navigate('/my-listings')}>
              Mes annonces
            </Button>
          </div>
        </Card>
      </div>
    </Container>
  )
}
