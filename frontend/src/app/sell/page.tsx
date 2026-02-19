'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiArrowLeft, 
  FiCamera, 
  FiUpload, 
  FiX, 
  FiCheck,
  FiInfo,
  FiDollarSign,
  FiBook,
  FiTag,
  FiPackage,
  FiImage,
  FiAlertCircle,
  FiHelpCircle,
  FiPercent
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

interface Category {
  id: string
  name: string
  slug: string
}

const conditions = [
  { value: 'NEW', label: 'Neuf', description: 'Livre neuf, jamais lu, état parfait' },
  { value: 'LIKE_NEW', label: 'Comme neuf', description: 'Livre lu une fois, aucune trace d\'usure' },
  { value: 'GOOD', label: 'Bon état', description: 'Quelques traces d\'usure légères' },
  { value: 'ACCEPTABLE', label: 'Acceptable', description: 'Usure visible mais lisible' }
]

export default function SellBookPage() {
  const router = useRouter()
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [showPriceGuide, setShowPriceGuide] = useState(false)
  
  const [form, setForm] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    categoryId: '',
    condition: '',
    price: '',
    stock: '1',
    publisher: '',
    publicationYear: '',
    pageCount: '',
    language: 'Français'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/sell')
      return
    }
    fetchCategories()
  }, [user])

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/categories`)
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      } else {
        // Demo categories
        setCategories([
          { id: '1', name: 'Romans Africains', slug: 'romans-africains' },
          { id: '2', name: 'Littérature Classique', slug: 'litterature-classique' },
          { id: '3', name: 'Histoire & Politique', slug: 'histoire-politique' },
          { id: '4', name: 'Développement Personnel', slug: 'developpement-personnel' },
          { id: '5', name: 'Sciences & Technologies', slug: 'sciences-technologies' },
          { id: '6', name: 'Jeunesse', slug: 'jeunesse' },
          { id: '7', name: 'Religion & Spiritualité', slug: 'religion-spiritualite' },
          { id: '8', name: 'Art & Culture', slug: 'art-culture' },
          { id: '9', name: 'Économie & Finance', slug: 'economie-finance' },
          { id: '10', name: 'Éducation & Scolaire', slug: 'education-scolaire' }
        ])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images autorisées')
      return
    }

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image trop grande (max 5MB)')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setImages((prev) => [...prev, event.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!form.title.trim()) newErrors.title = 'Le titre est requis'
      if (!form.author.trim()) newErrors.author = 'L\'auteur est requis'
      if (!form.categoryId) newErrors.categoryId = 'La catégorie est requise'
    }

    if (step === 2) {
      if (!form.condition) newErrors.condition = 'L\'état est requis'
      if (!form.description.trim()) newErrors.description = 'La description est requise'
      if (form.description.trim().length < 50) newErrors.description = 'La description doit contenir au moins 50 caractères'
    }

    if (step === 3) {
      if (!form.price) newErrors.price = 'Le prix est requis'
      if (Number(form.price) < 500) newErrors.price = 'Le prix minimum est de 500 FCFA'
      if (Number(form.stock) < 1) newErrors.stock = 'Le stock minimum est de 1'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const calculateCommission = () => {
    const price = Number(form.price) || 0
    return Math.round(price * 0.05)
  }

  const calculateNetPrice = () => {
    const price = Number(form.price) || 0
    return price - calculateCommission()
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return
    
    if (images.length === 0) {
      toast.error('Ajoutez au moins une photo du livre')
      return
    }

    setLoading(true)

    try {
      // Upload images first
      const imageUrls: string[] = []
      for (const image of images) {
        // In real implementation, upload to cloud storage
        imageUrls.push(image)
      }

      const bookData = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        publicationYear: form.publicationYear ? Number(form.publicationYear) : undefined,
        pageCount: form.pageCount ? Number(form.pageCount) : undefined,
        images: imageUrls
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      })

      if (res.ok) {
        const data = await res.json()
        toast.success('Livre mis en vente avec succès !')
        router.push(`/books/${data.id}`)
      } else {
        const error = await res.json()
        toast.error(error.message || 'Erreur lors de la mise en vente')
      }
    } catch (error) {
      toast.error('Erreur lors de la mise en vente')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Vendre un livre</h1>
            </div>
            <button
              onClick={() => setShowPriceGuide(true)}
              className="text-primary hover:underline text-sm flex items-center gap-1"
            >
              <FiHelpCircle className="w-4 h-4" />
              Guide des prix
            </button>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Informations' },
              { num: 2, label: 'Description' },
              { num: 3, label: 'Prix' },
              { num: 4, label: 'Photos' }
            ].map((step, index) => (
              <div key={step.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep >= step.num
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.num ? <FiCheck className="w-5 h-5" /> : step.num}
                  </div>
                  <span className={`text-xs mt-1 ${
                    currentStep >= step.num ? 'text-primary font-medium' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < 3 && (
                  <div className={`w-12 sm:w-24 h-1 mx-2 rounded transition-colors ${
                    currentStep > step.num ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FiBook className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Informations du livre</h2>
                  <p className="text-sm text-gray-500">Renseignez les détails de base</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre du livre *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: L'Enfant Noir"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auteur *
                  </label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors ${
                      errors.author ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Camara Laye"
                  />
                  {errors.author && <p className="mt-1 text-sm text-red-500">{errors.author}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors ${
                      errors.categoryId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ISBN (optionnel)
                    </label>
                    <input
                      type="text"
                      value={form.isbn}
                      onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      placeholder="978-..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Éditeur (optionnel)
                    </label>
                    <input
                      type="text"
                      value={form.publisher}
                      onChange={(e) => setForm({ ...form, publisher: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      placeholder="Ex: Éditions Présence Africaine"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Année de publication
                    </label>
                    <input
                      type="number"
                      value={form.publicationYear}
                      onChange={(e) => setForm({ ...form, publicationYear: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      placeholder="2020"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de pages
                    </label>
                    <input
                      type="number"
                      value={form.pageCount}
                      onChange={(e) => setForm({ ...form, pageCount: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      placeholder="200"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Langue
                    </label>
                    <select
                      value={form.language}
                      onChange={(e) => setForm({ ...form, language: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    >
                      <option value="Français">Français</option>
                      <option value="Anglais">Anglais</option>
                      <option value="Arabe">Arabe</option>
                      <option value="Wolof">Wolof</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={nextStep}
                  className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Continuer
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Description & Condition */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FiTag className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">État et description</h2>
                  <p className="text-sm text-gray-500">Décrivez l'état de votre livre</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    État du livre *
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {conditions.map((condition) => (
                      <button
                        key={condition.value}
                        type="button"
                        onClick={() => setForm({ ...form, condition: condition.value })}
                        className={`p-4 border-2 rounded-xl text-left transition-colors ${
                          form.condition === condition.value
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-800">{condition.label}</span>
                          {form.condition === condition.value && (
                            <FiCheck className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{condition.description}</p>
                      </button>
                    ))}
                  </div>
                  {errors.condition && <p className="mt-2 text-sm text-red-500">{errors.condition}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description détaillée *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Décrivez l'état du livre, sa couverture, s'il y a des annotations, etc. Plus votre description est détaillée, plus les acheteurs seront confiants."
                  />
                  <div className="flex justify-between mt-1">
                    {errors.description ? (
                      <p className="text-sm text-red-500">{errors.description}</p>
                    ) : (
                      <p className="text-sm text-gray-500">Minimum 50 caractères</p>
                    )}
                    <span className={`text-sm ${form.description.length < 50 ? 'text-red-500' : 'text-gray-500'}`}>
                      {form.description.length}/50
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex gap-3">
                    <FiInfo className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-800 mb-1">Conseils pour une bonne description</p>
                      <ul className="text-blue-700 space-y-1">
                        <li>• Mentionnez l'état de la couverture et des pages</li>
                        <li>• Indiquez s'il y a des annotations ou surlignages</li>
                        <li>• Précisez si c'est une édition spéciale</li>
                        <li>• Soyez honnête sur les défauts éventuels</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="px-8 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Retour
                </button>
                <button
                  onClick={nextStep}
                  className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Continuer
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Price & Stock */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FiDollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Prix et stock</h2>
                  <p className="text-sm text-gray-500">Définissez votre prix de vente</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix de vente (FCFA) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className={`w-full px-4 py-3 pr-16 border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-xl font-semibold ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0"
                      min="500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      FCFA
                    </span>
                  </div>
                  {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                </div>

                {/* Commission Calculator */}
                {form.price && Number(form.price) > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <h4 className="font-medium text-gray-800 flex items-center gap-2">
                      <FiPercent className="w-4 h-4" />
                      Calcul des revenus
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Prix de vente</span>
                        <span className="font-medium">{Number(form.price).toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Commission AfriBook (5%)</span>
                        <span className="font-medium text-red-600">-{calculateCommission().toLocaleString()} FCFA</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-800">Vous recevrez</span>
                          <span className="font-bold text-green-600 text-lg">{calculateNetPrice().toLocaleString()} FCFA</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantité disponible *
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      className="w-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-center"
                      min="1"
                      max="100"
                    />
                    <span className="text-gray-500">exemplaire(s)</span>
                  </div>
                  {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock}</p>}
                </div>

                <div className="bg-amber-50 rounded-xl p-4">
                  <div className="flex gap-3">
                    <FiAlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-700">
                      <p className="font-medium mb-1">Commission de 5%</p>
                      <p>Une commission de 5% est prélevée sur chaque vente pour soutenir le fonctionnement de la plateforme et garantir un service de qualité.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="px-8 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Retour
                </button>
                <button
                  onClick={nextStep}
                  className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Continuer
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Photos */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FiImage className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Photos du livre</h2>
                  <p className="text-sm text-gray-500">Ajoutez des photos de qualité</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Upload Area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium mb-1">Cliquez pour télécharger</p>
                  <p className="text-sm text-gray-500">PNG, JPG jusqu'à 5MB (max 5 images)</p>
                </div>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                        <img 
                          src={image} 
                          alt={`Photo ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 px-2 py-1 bg-primary text-white text-xs rounded-full">
                            Photo principale
                          </span>
                        )}
                      </div>
                    ))}
                    {images.length < 5 && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-primary transition-colors"
                      >
                        <FiCamera className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Ajouter</span>
                      </button>
                    )}
                  </div>
                )}

                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex gap-3">
                    <FiInfo className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-800 mb-1">Conseils pour de bonnes photos</p>
                      <ul className="text-blue-700 space-y-1">
                        <li>• Prenez des photos en lumière naturelle</li>
                        <li>• Montrez la couverture avant et arrière</li>
                        <li>• Photographiez les éventuels défauts</li>
                        <li>• La première photo sera l'image principale</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Récapitulatif</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Titre</span>
                      <span className="font-medium text-gray-800">{form.title || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Auteur</span>
                      <span className="font-medium text-gray-800">{form.author || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">État</span>
                      <span className="font-medium text-gray-800">
                        {conditions.find(c => c.value === form.condition)?.label || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix</span>
                      <span className="font-bold text-primary">
                        {form.price ? `${Number(form.price).toLocaleString()} FCFA` : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vous recevrez</span>
                      <span className="font-bold text-green-600">
                        {form.price ? `${calculateNetPrice().toLocaleString()} FCFA` : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Photos</span>
                      <span className="font-medium text-gray-800">{images.length}/5</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="px-8 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Retour
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || images.length === 0}
                  className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Publication...
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-5 h-5" />
                      Mettre en vente
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Guide Modal */}
      <AnimatePresence>
        {showPriceGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPriceGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Guide des prix</h3>
                <button
                  onClick={() => setShowPriceGuide(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Prix recommandés par état</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-green-50 rounded-xl">
                      <span className="text-green-800">Neuf</span>
                      <span className="font-medium text-green-800">80-100% du prix neuf</span>
                    </div>
                    <div className="flex justify-between p-3 bg-blue-50 rounded-xl">
                      <span className="text-blue-800">Comme neuf</span>
                      <span className="font-medium text-blue-800">60-80% du prix neuf</span>
                    </div>
                    <div className="flex justify-between p-3 bg-yellow-50 rounded-xl">
                      <span className="text-yellow-800">Bon état</span>
                      <span className="font-medium text-yellow-800">40-60% du prix neuf</span>
                    </div>
                    <div className="flex justify-between p-3 bg-orange-50 rounded-xl">
                      <span className="text-orange-800">Acceptable</span>
                      <span className="font-medium text-orange-800">20-40% du prix neuf</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Conseils de tarification</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <FiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Recherchez des livres similaires sur la plateforme
                    </li>
                    <li className="flex items-start gap-2">
                      <FiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Les éditions rares peuvent valoir plus
                    </li>
                    <li className="flex items-start gap-2">
                      <FiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Les livres dédicacés ont une valeur ajoutée
                    </li>
                    <li className="flex items-start gap-2">
                      <FiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Un prix compétitif vend plus vite
                    </li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setShowPriceGuide(false)}
                className="w-full mt-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                Compris
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
