'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiArrowLeft, 
  FiHeart, 
  FiShare2, 
  FiStar, 
  FiUser, 
  FiClock,
  FiHeadphones,
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiVolume2,
  FiVolumeX,
  FiList,
  FiLock,
  FiUnlock,
  FiCheck,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiDownload,
  FiRepeat
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

interface Chapter {
  id: string
  title: string
  duration: number
  audioUrl: string
  order: number
  isFree: boolean
}

interface Audiobook {
  id: string
  title: string
  author: string
  narrator: string
  description: string
  coverImage: string
  totalDuration: number
  rating: number
  reviewCount: number
  releaseYear: number
  language: string
  category: {
    id: string
    name: string
    slug: string
  }
  chapters: Chapter[]
  reviews: Review[]
  relatedAudiobooks: RelatedAudiobook[]
}

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: {
    id: string
    username: string
    firstName: string
    avatar?: string
  }
}

interface RelatedAudiobook {
  id: string
  title: string
  author: string
  coverImage: string
  totalDuration: number
  rating: number
}

export default function AudiobookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, subscription } = useAuth()
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const [audiobook, setAudiobook] = useState<Audiobook | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'description' | 'chapters' | 'reviews'>('chapters')
  
  // Player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)

  const hasActiveSubscription = subscription?.status === 'ACTIVE'

  useEffect(() => {
    fetchAudiobook()
    checkFavorite()
  }, [params.id])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed
    }
  }, [playbackSpeed])

  const fetchAudiobook = async () => {
    try {
      const res = await fetch(`/api/audiobooks/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setAudiobook(data)
      } else {
        // Demo data
        setAudiobook({
          id: params.id as string,
          title: 'L\'Aventure Ambiguë',
          author: 'Cheikh Hamidou Kane',
          narrator: 'Mamadou Diouf',
          description: `L'Aventure ambiguë est un roman philosophique de Cheikh Hamidou Kane, publié en 1961. Ce chef-d'œuvre de la littérature africaine raconte l'histoire de Samba Diallo, jeune aristocrate peul du Sénégal, tiraillé entre deux mondes : l'éducation coranique traditionnelle et l'école occidentale.

Le roman explore avec une profondeur rare les thèmes de l'identité culturelle, de la foi, de la raison et du déracinement. Samba Diallo, brillant élève de l'école coranique sous la guidance du Maître des Diallobé, est envoyé à l'école française par décision de la Grande Royale.

Ce voyage initiatique le mènera jusqu'à Paris, où il poursuivra des études de philosophie, mais où il se trouvera confronté à une crise existentielle profonde, ne sachant plus à quel monde il appartient.

L'Aventure ambiguë est considéré comme l'un des textes fondateurs de la réflexion sur le choc des civilisations et la condition de l'intellectuel africain formé à l'école occidentale.`,
          coverImage: '/images/audiobooks/aventure-ambigue.jpg',
          totalDuration: 21600, // 6 hours
          rating: 4.9,
          reviewCount: 89,
          releaseYear: 2023,
          language: 'Français',
          category: {
            id: '1',
            name: 'Classiques Africains',
            slug: 'classiques-africains'
          },
          chapters: [
            { id: 'c1', title: 'Chapitre 1 - Le Maître', duration: 1800, audioUrl: '/audio/chapter1.mp3', order: 1, isFree: true },
            { id: 'c2', title: 'Chapitre 2 - La Grande Royale', duration: 2100, audioUrl: '/audio/chapter2.mp3', order: 2, isFree: false },
            { id: 'c3', title: 'Chapitre 3 - L\'École Nouvelle', duration: 1950, audioUrl: '/audio/chapter3.mp3', order: 3, isFree: false },
            { id: 'c4', title: 'Chapitre 4 - Le Départ', duration: 2400, audioUrl: '/audio/chapter4.mp3', order: 4, isFree: false },
            { id: 'c5', title: 'Chapitre 5 - Paris', duration: 2700, audioUrl: '/audio/chapter5.mp3', order: 5, isFree: false },
            { id: 'c6', title: 'Chapitre 6 - Lucienne', duration: 1800, audioUrl: '/audio/chapter6.mp3', order: 6, isFree: false },
            { id: 'c7', title: 'Chapitre 7 - La Crise', duration: 2250, audioUrl: '/audio/chapter7.mp3', order: 7, isFree: false },
            { id: 'c8', title: 'Chapitre 8 - Le Retour', duration: 2100, audioUrl: '/audio/chapter8.mp3', order: 8, isFree: false },
            { id: 'c9', title: 'Chapitre 9 - Le Fou', duration: 1950, audioUrl: '/audio/chapter9.mp3', order: 9, isFree: false },
            { id: 'c10', title: 'Chapitre 10 - La Fin', duration: 2550, audioUrl: '/audio/chapter10.mp3', order: 10, isFree: false }
          ],
          reviews: [
            {
              id: 'r1',
              rating: 5,
              comment: 'La narration de Mamadou Diouf est exceptionnelle. Il capture parfaitement l\'essence du texte.',
              createdAt: '2024-01-20',
              user: { id: 'u1', username: 'aminata_sn', firstName: 'Aminata' }
            },
            {
              id: 'r2',
              rating: 5,
              comment: 'Un chef-d\'œuvre magnifiquement interprété. La qualité audio est parfaite.',
              createdAt: '2024-01-15',
              user: { id: 'u2', username: 'oumar_bf', firstName: 'Oumar' }
            },
            {
              id: 'r3',
              rating: 4,
              comment: 'Excellent audiobook, j\'aurais aimé une version un peu plus longue avec des annotations.',
              createdAt: '2024-01-10',
              user: { id: 'u3', username: 'awa_ci', firstName: 'Awa' }
            }
          ],
          relatedAudiobooks: [
            { id: 'ra1', title: 'L\'Enfant Noir', author: 'Camara Laye', coverImage: '/images/audiobooks/enfant-noir.jpg', totalDuration: 18000, rating: 4.8 },
            { id: 'ra2', title: 'Une si longue lettre', author: 'Mariama Bâ', coverImage: '/images/audiobooks/longue-lettre.jpg', totalDuration: 14400, rating: 4.7 },
            { id: 'ra3', title: 'Les Soleils des Indépendances', author: 'Ahmadou Kourouma', coverImage: '/images/audiobooks/soleils.jpg', totalDuration: 25200, rating: 4.6 },
            { id: 'ra4', title: 'Le Monde s\'effondre', author: 'Chinua Achebe', coverImage: '/images/audiobooks/monde-effondre.jpg', totalDuration: 21600, rating: 4.9 }
          ]
        })
      }
    } catch (error) {
      console.error('Error fetching audiobook:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkFavorite = async () => {
    if (!user) return
    try {
      const res = await fetch(`/api/favorites/check?audiobookId=${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setIsFavorite(data.isFavorite)
      }
    } catch (error) {
      console.error('Error checking favorite:', error)
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Connectez-vous pour ajouter aux favoris')
      router.push('/login')
      return
    }

    try {
      const method = isFavorite ? 'DELETE' : 'POST'
      const res = await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audiobookId: params.id })
      })

      if (res.ok) {
        setIsFavorite(!isFavorite)
        toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris')
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des favoris')
    }
  }

  const shareAudiobook = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: audiobook?.title,
          text: `Écoutez "${audiobook?.title}" par ${audiobook?.author} sur AfriBook`,
          url: window.location.href
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Lien copié !')
    }
  }

  const canPlayChapter = (chapter: Chapter) => {
    return chapter.isFree || hasActiveSubscription
  }

  const playChapter = (index: number) => {
    if (!audiobook) return
    
    const chapter = audiobook.chapters[index]
    if (!canPlayChapter(chapter)) {
      toast.error('Abonnez-vous pour accéder à ce chapitre')
      router.push('/subscriptions')
      return
    }

    setCurrentChapterIndex(index)
    setShowPlayer(true)
    setIsPlaying(true)
    
    // In real implementation, this would load the actual audio file
    // For demo, we simulate playback
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(console.error)
    }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(console.error)
      }
    }
    setIsPlaying(!isPlaying)
  }

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 30, duration)
    }
  }

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0)
    }
  }

  const nextChapter = () => {
    if (!audiobook) return
    if (currentChapterIndex < audiobook.chapters.length - 1) {
      const nextIndex = currentChapterIndex + 1
      if (canPlayChapter(audiobook.chapters[nextIndex])) {
        playChapter(nextIndex)
      } else {
        toast.error('Abonnez-vous pour accéder au chapitre suivant')
      }
    }
  }

  const prevChapter = () => {
    if (currentChapterIndex > 0) {
      playChapter(currentChapterIndex - 1)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    } else {
      nextChapter()
    }
  }

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      audioRef.current.currentTime = percent * duration
    }
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    if (h > 0) {
      return `${h}h ${m}min`
    }
    return `${m} min`
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!audiobook) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <FiAlertCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Audiobook non trouvé</h1>
        <p className="text-gray-600 mb-4">Cet audiobook n'existe pas ou a été supprimé.</p>
        <Link href="/audiobooks" className="btn-primary">
          Retour aux audiobooks
        </Link>
      </div>
    )
  }

  const currentChapter = audiobook.chapters[currentChapterIndex]

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentChapter?.audioUrl || ''}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary">Accueil</Link>
            <span className="text-gray-300">/</span>
            <Link href="/audiobooks" className="text-gray-500 hover:text-primary">Audiobooks</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-800 font-medium truncate max-w-[200px]">{audiobook.title}</span>
          </nav>
        </div>
      </div>

      {/* Back button mobile */}
      <div className="lg:hidden bg-white border-b px-4 py-3">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600">
          <FiArrowLeft />
          <span>Retour</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cover & Info */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Cover Image */}
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FiHeadphones className="w-24 h-24 text-primary/20" />
                </div>
                {/* Play Button Overlay */}
                <button
                  onClick={() => playChapter(0)}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <FiPlay className="w-10 h-10 text-primary ml-1" />
                  </div>
                </button>
                {/* Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                  Chapitre 1 gratuit
                </div>
                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={shareAudiobook}
                    className="p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors"
                  >
                    <FiShare2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={toggleFavorite}
                    className={`p-3 rounded-full shadow-lg transition-colors ${
                      isFavorite 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/90 backdrop-blur hover:bg-white text-gray-600'
                    }`}
                  >
                    <FiHeart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <Link 
                  href={`/audiobooks?category=${audiobook.category.slug}`}
                  className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3 hover:bg-primary/20 transition-colors"
                >
                  {audiobook.category.name}
                </Link>
                <h1 className="text-2xl font-bold font-display text-gray-900 mb-2">
                  {audiobook.title}
                </h1>
                <p className="text-gray-600 mb-1">par {audiobook.author}</p>
                <p className="text-sm text-gray-500 mb-4">Lu par {audiobook.narrator}</p>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(audiobook.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-800">{audiobook.rating}</span>
                  <span className="text-gray-500">({audiobook.reviewCount} avis)</span>
                </div>

                {/* Duration & Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                  <span className="flex items-center gap-1">
                    <FiClock className="w-4 h-4" />
                    {formatDuration(audiobook.totalDuration)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiList className="w-4 h-4" />
                    {audiobook.chapters.length} chapitres
                  </span>
                </div>

                {/* CTA */}
                {hasActiveSubscription ? (
                  <button
                    onClick={() => playChapter(0)}
                    className="w-full py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiPlay className="w-5 h-5" />
                    Commencer l'écoute
                  </button>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => playChapter(0)}
                      className="w-full py-4 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiPlay className="w-5 h-5" />
                      Écouter le chapitre 1 gratuit
                    </button>
                    <Link
                      href="/subscriptions"
                      className="block w-full py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors text-center"
                    >
                      S'abonner pour tout écouter
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Subscription Banner */}
            {!hasActiveSubscription && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl shadow-lg p-6 text-white"
              >
                <h3 className="text-lg font-bold mb-2">Accès illimité</h3>
                <p className="text-white/80 text-sm mb-4">
                  Abonnez-vous pour accéder à tous les chapitres de cet audiobook et à tout notre catalogue.
                </p>
                <div className="text-2xl font-bold mb-4">
                  2 500 FCFA<span className="text-sm font-normal text-white/80">/mois</span>
                </div>
                <Link
                  href="/subscriptions"
                  className="block w-full py-3 bg-white text-secondary rounded-xl font-semibold text-center hover:bg-white/90 transition-colors"
                >
                  Voir les offres
                </Link>
              </motion.div>
            )}
          </div>

          {/* Tabs Content */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Tab Headers */}
              <div className="flex border-b">
                {[
                  { id: 'chapters', label: `Chapitres (${audiobook.chapters.length})` },
                  { id: 'description', label: 'Description' },
                  { id: 'reviews', label: `Avis (${audiobook.reviewCount})` }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`flex-1 py-4 text-center font-medium transition-colors relative ${
                      selectedTab === tab.id
                        ? 'text-primary'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                    {selectedTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {selectedTab === 'chapters' && (
                    <motion.div
                      key="chapters"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-2"
                    >
                      {audiobook.chapters.map((chapter, index) => {
                        const isLocked = !canPlayChapter(chapter)
                        const isCurrent = currentChapterIndex === index && showPlayer
                        
                        return (
                          <button
                            key={chapter.id}
                            onClick={() => playChapter(index)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors text-left ${
                              isCurrent
                                ? 'bg-primary/10 border-2 border-primary'
                                : isLocked
                                ? 'bg-gray-50 hover:bg-gray-100'
                                : 'bg-gray-50 hover:bg-primary/5'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isCurrent
                                ? 'bg-primary text-white'
                                : isLocked
                                ? 'bg-gray-200 text-gray-500'
                                : 'bg-primary/10 text-primary'
                            }`}>
                              {isCurrent && isPlaying ? (
                                <div className="flex gap-0.5">
                                  <span className="w-1 h-4 bg-white rounded-full animate-pulse"></span>
                                  <span className="w-1 h-3 bg-white rounded-full animate-pulse delay-75"></span>
                                  <span className="w-1 h-5 bg-white rounded-full animate-pulse delay-150"></span>
                                </div>
                              ) : isLocked ? (
                                <FiLock className="w-4 h-4" />
                              ) : (
                                <FiPlay className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`font-medium ${
                                  isCurrent ? 'text-primary' : 'text-gray-800'
                                }`}>
                                  {chapter.title}
                                </span>
                                {chapter.isFree && (
                                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                    Gratuit
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">{formatDuration(chapter.duration)}</span>
                            </div>
                            {isLocked && (
                              <span className="text-sm text-gray-500">
                                Abonnés uniquement
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </motion.div>
                  )}

                  {selectedTab === 'description' && (
                    <motion.div
                      key="description"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className={`prose max-w-none ${!showFullDescription && 'line-clamp-8'}`}>
                        {audiobook.description.split('\n\n').map((paragraph, idx) => (
                          <p key={idx} className="text-gray-600 mb-4">{paragraph}</p>
                        ))}
                      </div>
                      {audiobook.description.length > 500 && (
                        <button
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="mt-4 flex items-center gap-2 text-primary font-medium hover:underline"
                        >
                          {showFullDescription ? (
                            <>
                              Voir moins <FiChevronUp className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              Voir plus <FiChevronDown className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      )}

                      {/* Details Grid */}
                      <div className="mt-8 grid md:grid-cols-2 gap-4">
                        <div className="flex justify-between py-3 border-b">
                          <span className="text-gray-500">Narrateur</span>
                          <span className="font-medium text-gray-800">{audiobook.narrator}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b">
                          <span className="text-gray-500">Durée totale</span>
                          <span className="font-medium text-gray-800">{formatDuration(audiobook.totalDuration)}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b">
                          <span className="text-gray-500">Langue</span>
                          <span className="font-medium text-gray-800">{audiobook.language}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b">
                          <span className="text-gray-500">Année de sortie</span>
                          <span className="font-medium text-gray-800">{audiobook.releaseYear}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {selectedTab === 'reviews' && (
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="space-y-6">
                        {audiobook.reviews.map((review) => (
                          <div key={review.id} className="border-b pb-6 last:border-0">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-medium">
                                {review.user.firstName[0]}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-800">{review.user.firstName}</span>
                                  <span className="text-sm text-gray-500">@{review.user.username}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <FiStar
                                        key={star}
                                        className={`w-4 h-4 ${
                                          star <= review.rating
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                                </div>
                                <p className="text-gray-600">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Related Audiobooks */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <h2 className="text-xl font-bold font-display text-gray-900 mb-4">
                Audiobooks similaires
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {audiobook.relatedAudiobooks.map((related) => (
                  <Link
                    key={related.id}
                    href={`/audiobooks/${related.id}`}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                  >
                    <div className="aspect-square bg-gradient-to-br from-primary/5 to-accent/5 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FiHeadphones className="w-12 h-12 text-primary/20" />
                      </div>
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                          <FiPlay className="w-6 h-6 text-primary ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-1">
                        {related.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">{related.author}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{formatDuration(related.totalDuration)}</span>
                        <div className="flex items-center gap-1 text-sm">
                          <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-gray-600">{related.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Fixed Player */}
      <AnimatePresence>
        {showPlayer && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl z-50"
          >
            {/* Progress Bar */}
            <div 
              className="h-1 bg-gray-200 cursor-pointer"
              onClick={seekTo}
            >
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>

            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center gap-4">
                {/* Cover & Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
                    <FiHeadphones className="w-6 h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-800 truncate">{currentChapter?.title}</h4>
                    <p className="text-sm text-gray-500 truncate">{audiobook.title} • {audiobook.author}</p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2 md:gap-4">
                  {/* Time - Hidden on mobile */}
                  <span className="hidden md:block text-sm text-gray-500 w-16 text-right">
                    {formatTime(currentTime)}
                  </span>

                  {/* Skip Back */}
                  <button
                    onClick={skipBackward}
                    className="p-2 text-gray-600 hover:text-primary transition-colors"
                    title="10 secondes en arrière"
                  >
                    <FiSkipBack className="w-5 h-5" />
                  </button>

                  {/* Previous Chapter */}
                  <button
                    onClick={prevChapter}
                    disabled={currentChapterIndex === 0}
                    className="hidden md:block p-2 text-gray-600 hover:text-primary transition-colors disabled:opacity-50"
                  >
                    <FiSkipBack className="w-5 h-5" />
                  </button>

                  {/* Play/Pause */}
                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors"
                  >
                    {isPlaying ? (
                      <FiPause className="w-6 h-6" />
                    ) : (
                      <FiPlay className="w-6 h-6 ml-0.5" />
                    )}
                  </button>

                  {/* Next Chapter */}
                  <button
                    onClick={nextChapter}
                    disabled={currentChapterIndex === audiobook.chapters.length - 1}
                    className="hidden md:block p-2 text-gray-600 hover:text-primary transition-colors disabled:opacity-50"
                  >
                    <FiSkipForward className="w-5 h-5" />
                  </button>

                  {/* Skip Forward */}
                  <button
                    onClick={skipForward}
                    className="p-2 text-gray-600 hover:text-primary transition-colors"
                    title="30 secondes en avant"
                  >
                    <FiSkipForward className="w-5 h-5" />
                  </button>

                  {/* Time - Hidden on mobile */}
                  <span className="hidden md:block text-sm text-gray-500 w-16">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Extra Controls */}
                <div className="hidden lg:flex items-center gap-4">
                  {/* Volume */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 text-gray-600 hover:text-primary transition-colors"
                    >
                      {isMuted || volume === 0 ? (
                        <FiVolumeX className="w-5 h-5" />
                      ) : (
                        <FiVolume2 className="w-5 h-5" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(parseFloat(e.target.value))
                        setIsMuted(false)
                      }}
                      className="w-20 accent-primary"
                    />
                  </div>

                  {/* Speed */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {playbackSpeed}x
                    </button>
                    <AnimatePresence>
                      {showSpeedMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-full mb-2 right-0 bg-white rounded-xl shadow-lg py-2 min-w-[100px]"
                        >
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                            <button
                              key={speed}
                              onClick={() => {
                                setPlaybackSpeed(speed)
                                setShowSpeedMenu(false)
                              }}
                              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                                playbackSpeed === speed ? 'text-primary font-medium' : 'text-gray-700'
                              }`}
                            >
                              {speed}x
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Repeat */}
                  <button
                    onClick={() => setIsRepeat(!isRepeat)}
                    className={`p-2 rounded-full transition-colors ${
                      isRepeat ? 'text-primary bg-primary/10' : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    <FiRepeat className="w-5 h-5" />
                  </button>

                  {/* Close */}
                  <button
                    onClick={() => {
                      setShowPlayer(false)
                      setIsPlaying(false)
                      if (audioRef.current) {
                        audioRef.current.pause()
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
