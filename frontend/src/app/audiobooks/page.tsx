'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  FiSearch, 
  FiHeadphones, 
  FiPlay, 
  FiClock, 
  FiStar,
  FiFilter,
  FiChevronDown,
  FiLock
} from 'react-icons/fi'
import { useAudiobooks, useCategories } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

// Audiobook Card Component
function AudiobookCard({ audiobook }: { audiobook: any }) {
  // const { subscription } = useAuth()
  const hasAccess = false // Always allow viewing, restrict only playback if needed
  
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -5 }}
      className="card group"
    >
      <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-gray-100">
        {audiobook.coverImage ? (
          <Image
            src={audiobook.coverImage}
            alt={audiobook.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary/20 to-primary/20">
            <FiHeadphones className="w-12 h-12 text-gray-400" />
          </div>
        )}
        {/* Play button overlay */}
        <Link 
          href={`/audiobooks/${audiobook.id}`}
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white">
            <FiPlay className="w-8 h-8 ml-1" />
          </div>
        </Link>
        {/* Duration badge */}
        <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs rounded flex items-center gap-1">
          <FiClock className="w-3 h-3" />
          {audiobook.duration || '4h 32min'}
        </span>
        {/* Chapters badge */}
        <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 text-gray-700 text-xs rounded font-medium">
          {audiobook._count?.chapters || audiobook.chaptersCount || 10} chapitres
        </span>
      </div>
      
      <Link href={`/audiobooks/${audiobook.id}`}>
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 hover:text-primary transition-colors">
          {audiobook.title}
        </h3>
      </Link>
      <p className="text-sm text-gray-500 mb-1">{audiobook.author}</p>
      <p className="text-xs text-gray-400 mb-3">Lu par {audiobook.narrator || 'Narrateur'}</p>
      
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <FiStar 
            key={i} 
            className={`w-4 h-4 ${i < (audiobook.rating || 4) ? 'text-accent fill-accent' : 'text-gray-300'}`} 
          />
        ))}
        <span className="text-sm text-gray-500 ml-1">({audiobook._count?.reviews || 0})</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="badge badge-primary flex items-center gap-1">
          <FiPlay className="w-3 h-3" />
          Chapitre 1 gratuit
        </span>
        {!hasAccess && (
          <span className="badge badge-secondary flex items-center gap-1">
            <FiLock className="w-3 h-3" />
            Abonnement
          </span>
        )}
      </div>
    </motion.div>
  )
}

export default function AudiobooksPage() {
  const [filters, setFilters] = useState({
    category: '',
    search: '',
  })
  
  const { getAudiobooks, isLoading } = useAudiobooks()
  const { getCategories } = useCategories()
  const [audiobooks, setAudiobooks] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const { subscription } = useAuth()
  
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await getCategories()
      if (data?.categories) {
        setCategories(data.categories)
      }
    }
    fetchCategories()
  }, [])
  
  useEffect(() => {
    const fetchAudiobooks = async () => {
      const { data } = await getAudiobooks(filters)
      if (data) {
        setAudiobooks(data.audiobooks || [])
      }
    }
    fetchAudiobooks()
  }, [filters])
  
  // Demo audiobooks
  const demoAudiobooks = [
    { id: '1', title: 'Les Soleils des Indépendances', author: 'Ahmadou Kourouma', narrator: 'Souleymane Sy Savane', duration: '6h 45min', rating: 5, chaptersCount: 12, _count: { reviews: 128 } },
    { id: '2', title: 'Une Si Longue Lettre', author: 'Mariama Bâ', narrator: 'Aïssa Maïga', duration: '3h 20min', rating: 5, chaptersCount: 8, _count: { reviews: 256 } },
    { id: '3', title: 'L\'Enfant Noir', author: 'Camara Laye', narrator: 'Eriq Ebouaney', duration: '5h 10min', rating: 4, chaptersCount: 10, _count: { reviews: 89 } },
    { id: '4', title: 'Tout s\'effondre', author: 'Chinua Achebe', narrator: 'Peter Mensah', duration: '7h 30min', rating: 5, chaptersCount: 15, _count: { reviews: 312 } },
    { id: '5', title: 'L\'Aventure Ambiguë', author: 'Cheikh Hamidou Kane', narrator: 'Omar Sy', duration: '4h 55min', rating: 5, chaptersCount: 9, _count: { reviews: 187 } },
    { id: '6', title: 'Soundjata ou l\'Épopée Mandingue', author: 'Djibril Tamsir Niane', narrator: 'Djimon Hounsou', duration: '5h 40min', rating: 4, chaptersCount: 11, _count: { reviews: 134 } },
    { id: '7', title: 'Le Vieux Nègre et la Médaille', author: 'Ferdinand Oyono', narrator: 'Isaach de Bankolé', duration: '3h 15min', rating: 4, chaptersCount: 7, _count: { reviews: 94 } },
    { id: '8', title: 'Le Pauvre Christ de Bomba', author: 'Mongo Beti', narrator: 'Babetida Sadjo', duration: '6h 20min', rating: 5, chaptersCount: 13, _count: { reviews: 98 } },
  ]
  
  const displayAudiobooks = audiobooks.length > 0 ? audiobooks : demoAudiobooks
  
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary/10 to-primary/10 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2 flex items-center gap-3">
                <FiHeadphones className="text-primary" />
                Audiobooks
              </h1>
              <p className="text-gray-600">
                Écoutez les plus grands classiques de la littérature africaine
              </p>
            </div>
            
            {/* Subscription CTA */}
            {subscription?.status !== 'ACTIVE' && (
              <Link 
                href="/subscriptions"
                className="btn-primary inline-flex items-center gap-2"
              >
                <span>S'abonner</span>
                <span className="text-xs opacity-75">à partir de 2 500 XOF/mois</span>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Info Banner */}
      <div className="bg-primary/5 border-b border-primary/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <FiPlay className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Premier chapitre gratuit</h3>
                <p className="text-sm text-gray-600">
                  Écoutez le premier chapitre de n'importe quel audiobook gratuitement. 
                  Abonnez-vous pour accéder à tous les chapitres!
                </p>
              </div>
            </div>
            
            {subscription?.status === 'ACTIVE' && (
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Abonnement actif</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un audiobook..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          
          {/* Category Filter */}
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="appearance-none pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {displayAudiobooks.length} audiobooks disponibles
          </p>
        </div>
        
        {/* Audiobooks Grid */}
        {isLoading ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {displayAudiobooks.map((audiobook) => (
              <AudiobookCard key={audiobook.id} audiobook={audiobook} />
            ))}
          </motion.div>
        )}
        
        {/* Subscription CTA */}
        {subscription?.status !== 'ACTIVE' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-block bg-gradient-to-r from-primary to-orange-600 rounded-2xl p-8 text-white max-w-2xl">
              <h3 className="text-2xl font-display font-bold mb-2">
                Accès illimité à tous les audiobooks
              </h3>
              <p className="text-white/90 mb-6">
                Abonnez-vous pour écouter tous les chapitres de tous nos audiobooks. 
                Téléchargez-les pour les écouter hors ligne!
              </p>
              <div className="flex flex-wrap gap-4 justify-center mb-6">
                <div className="bg-white/10 px-4 py-2 rounded-lg">
                  <span className="text-2xl font-bold">2 500</span>
                  <span className="text-sm"> XOF/mois</span>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg">
                  <span className="text-2xl font-bold">6 000</span>
                  <span className="text-sm"> XOF/trimestre</span>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-lg border-2 border-white">
                  <span className="text-2xl font-bold">20 000</span>
                  <span className="text-sm"> XOF/an</span>
                  <span className="ml-2 text-xs bg-accent text-gray-900 px-2 py-0.5 rounded">-33%</span>
                </div>
              </div>
              <Link 
                href="/subscriptions"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Choisir mon abonnement
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
