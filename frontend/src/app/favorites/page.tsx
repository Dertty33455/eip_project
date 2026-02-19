'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiArrowLeft, 
  FiHeart, 
  FiBook, 
  FiHeadphones,
  FiTrash2,
  FiShoppingCart,
  FiStar,
  FiGrid,
  FiList,
  FiSearch,
  FiFilter
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

interface FavoriteBook {
  id: string
  book: {
    id: string
    title: string
    author: string
    price: number
    coverImage?: string
    condition: string
    rating: number
    seller: {
      username: string
    }
  }
  addedAt: string
}

interface FavoriteAudiobook {
  id: string
  audiobook: {
    id: string
    title: string
    author: string
    narrator: string
    coverImage?: string
    totalDuration: number
    rating: number
  }
  addedAt: string
}

const conditionLabels: Record<string, string> = {
  NEW: 'Neuf',
  LIKE_NEW: 'Comme neuf',
  GOOD: 'Bon état',
  ACCEPTABLE: 'Acceptable'
}

export default function FavoritesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'books' | 'audiobooks'>('books')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [favoriteBooks, setFavoriteBooks] = useState<FavoriteBook[]>([])
  const [favoriteAudiobooks, setFavoriteAudiobooks] = useState<FavoriteAudiobook[]>([])

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/favorites')
      return
    }
    fetchFavorites()
  }, [user])

  const fetchFavorites = async () => {
    try {
      const [booksRes, audiobooksRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/favorites?type=books`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/favorites?type=audiobooks`)
      ])

      if (booksRes.ok) {
        const data = await booksRes.json()
        setFavoriteBooks(data)
      } else {
        // Demo data
        setFavoriteBooks([
          {
            id: 'f1',
            book: {
              id: 'b1',
              title: 'L\'Enfant Noir',
              author: 'Camara Laye',
              price: 8500,
              condition: 'LIKE_NEW',
              rating: 4.8,
              seller: { username: 'librairie_dakar' }
            },
            addedAt: '2024-01-25'
          },
          {
            id: 'f2',
            book: {
              id: 'b2',
              title: 'Une si longue lettre',
              author: 'Mariama Bâ',
              price: 7500,
              condition: 'GOOD',
              rating: 4.7,
              seller: { username: 'book_store_ci' }
            },
            addedAt: '2024-01-20'
          },
          {
            id: 'f3',
            book: {
              id: 'b3',
              title: 'Les Soleils des Indépendances',
              author: 'Ahmadou Kourouma',
              price: 9000,
              condition: 'NEW',
              rating: 4.9,
              seller: { username: 'african_books' }
            },
            addedAt: '2024-01-15'
          },
          {
            id: 'f4',
            book: {
              id: 'b4',
              title: 'Le Monde s\'effondre',
              author: 'Chinua Achebe',
              price: 8000,
              condition: 'LIKE_NEW',
              rating: 4.8,
              seller: { username: 'librairie_dakar' }
            },
            addedAt: '2024-01-10'
          }
        ])
      }

      if (audiobooksRes.ok) {
        const data = await audiobooksRes.json()
        setFavoriteAudiobooks(data)
      } else {
        // Demo data
        setFavoriteAudiobooks([
          {
            id: 'fa1',
            audiobook: {
              id: 'a1',
              title: 'L\'Aventure Ambiguë',
              author: 'Cheikh Hamidou Kane',
              narrator: 'Mamadou Diouf',
              totalDuration: 21600,
              rating: 4.9
            },
            addedAt: '2024-01-22'
          },
          {
            id: 'fa2',
            audiobook: {
              id: 'a2',
              title: 'L\'Enfant Noir',
              author: 'Camara Laye',
              narrator: 'Abdoulaye Diallo',
              totalDuration: 18000,
              rating: 4.8
            },
            addedAt: '2024-01-18'
          },
          {
            id: 'fa3',
            audiobook: {
              id: 'a3',
              title: 'Une si longue lettre',
              author: 'Mariama Bâ',
              narrator: 'Aïssatou Ndiaye',
              totalDuration: 14400,
              rating: 4.7
            },
            addedAt: '2024-01-12'
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavoriteBook = async (favoriteId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/favorites`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favoriteId, type: 'book' })
      })

      if (res.ok || true) { // Demo: always succeed
        setFavoriteBooks(prev => prev.filter(f => f.id !== favoriteId))
        toast.success('Livre retiré des favoris')
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const removeFavoriteAudiobook = async (favoriteId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/favorites`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favoriteId, type: 'audiobook' })
      })

      if (res.ok || true) { // Demo: always succeed
        setFavoriteAudiobooks(prev => prev.filter(f => f.id !== favoriteId))
        toast.success('Audiobook retiré des favoris')
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const addToCart = async (bookId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, quantity: 1 })
      })

      if (res.ok || true) { // Demo: always succeed
        toast.success('Livre ajouté au panier')
      }
    } catch (error) {
      toast.error('Erreur lors de l\'ajout au panier')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
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
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Filter items based on search
  const filteredBooks = favoriteBooks.filter(f => 
    f.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.book.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredAudiobooks = favoriteAudiobooks.filter(f => 
    f.audiobook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.audiobook.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mes favoris</h1>
                <p className="text-sm text-gray-500">
                  {favoriteBooks.length + favoriteAudiobooks.length} éléments sauvegardés
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('books')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'books'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiBook className="w-5 h-5" />
            Livres ({favoriteBooks.length})
          </button>
          <button
            onClick={() => setActiveTab('audiobooks')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'audiobooks'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiHeadphones className="w-5 h-5" />
            Audiobooks ({favoriteAudiobooks.length})
          </button>
        </div>

        {/* Search & View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher dans vos favoris..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-colors ${
                viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'bg-white text-gray-400 hover:bg-gray-50'
              }`}
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-colors ${
                viewMode === 'list' ? 'bg-primary/10 text-primary' : 'bg-white text-gray-400 hover:bg-gray-50'
              }`}
            >
              <FiList className="w-5 h-5" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Books Tab */}
          {activeTab === 'books' && (
            <motion.div
              key="books"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {filteredBooks.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <FiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {searchQuery ? 'Aucun résultat' : 'Pas encore de favoris'}
                  </h2>
                  <p className="text-gray-500 mb-6">
                    {searchQuery 
                      ? 'Essayez avec d\'autres mots-clés'
                      : 'Explorez notre catalogue et ajoutez vos livres préférés'
                    }
                  </p>
                  <Link
                    href="/books"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                  >
                    <FiBook className="w-5 h-5" />
                    Découvrir les livres
                  </Link>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                  {filteredBooks.map((favorite) => (
                    <motion.div
                      key={favorite.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden group"
                    >
                      <Link href={`/books/${favorite.book.id}`}>
                        <div className="aspect-[3/4] bg-gradient-to-br from-primary/5 to-accent/5 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FiBook className="w-12 h-12 text-primary/20" />
                          </div>
                          {/* Condition Badge */}
                          <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-medium text-gray-700">
                            {conditionLabels[favorite.book.condition]}
                          </div>
                          {/* Remove Button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              removeFavoriteBook(favorite.id)
                            }}
                            className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </Link>
                      <div className="p-4">
                        <Link href={`/books/${favorite.book.id}`}>
                          <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-1">
                            {favorite.book.title}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-1">{favorite.book.author}</p>
                        </Link>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-primary">{formatPrice(favorite.book.price)}</span>
                          <div className="flex items-center gap-1 text-sm">
                            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-gray-600">{favorite.book.rating}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => addToCart(favorite.book.id)}
                          className="w-full mt-3 py-2 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                        >
                          <FiShoppingCart className="w-4 h-4" />
                          Ajouter au panier
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBooks.map((favorite) => (
                    <motion.div
                      key={favorite.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-white rounded-2xl shadow-lg p-4 flex gap-4"
                    >
                      <Link href={`/books/${favorite.book.id}`} className="flex-shrink-0">
                        <div className="w-24 h-32 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl flex items-center justify-center">
                          <FiBook className="w-8 h-8 text-primary/20" />
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/books/${favorite.book.id}`}>
                          <h3 className="font-semibold text-gray-800 hover:text-primary transition-colors">
                            {favorite.book.title}
                          </h3>
                          <p className="text-sm text-gray-500">{favorite.book.author}</p>
                        </Link>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">
                            {conditionLabels[favorite.book.condition]}
                          </span>
                          <div className="flex items-center gap-1">
                            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-gray-600">{favorite.book.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Ajouté le {formatDate(favorite.addedAt)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <span className="text-lg font-bold text-primary">{formatPrice(favorite.book.price)}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => addToCart(favorite.book.id)}
                            className="p-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                          >
                            <FiShoppingCart className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => removeFavoriteBook(favorite.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Audiobooks Tab */}
          {activeTab === 'audiobooks' && (
            <motion.div
              key="audiobooks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {filteredAudiobooks.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <FiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {searchQuery ? 'Aucun résultat' : 'Pas encore de favoris'}
                  </h2>
                  <p className="text-gray-500 mb-6">
                    {searchQuery 
                      ? 'Essayez avec d\'autres mots-clés'
                      : 'Explorez notre catalogue et ajoutez vos audiobooks préférés'
                    }
                  </p>
                  <Link
                    href="/audiobooks"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                  >
                    <FiHeadphones className="w-5 h-5" />
                    Découvrir les audiobooks
                  </Link>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                  {filteredAudiobooks.map((favorite) => (
                    <motion.div
                      key={favorite.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden group"
                    >
                      <Link href={`/audiobooks/${favorite.audiobook.id}`}>
                        <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FiHeadphones className="w-12 h-12 text-primary/30" />
                          </div>
                          {/* Duration Badge */}
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur rounded-full text-xs font-medium text-white">
                            {formatDuration(favorite.audiobook.totalDuration)}
                          </div>
                          {/* Remove Button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              removeFavoriteAudiobook(favorite.id)
                            }}
                            className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </Link>
                      <div className="p-4">
                        <Link href={`/audiobooks/${favorite.audiobook.id}`}>
                          <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-1">
                            {favorite.audiobook.title}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-1">{favorite.audiobook.author}</p>
                          <p className="text-xs text-gray-400 mt-1">Lu par {favorite.audiobook.narrator}</p>
                        </Link>
                        <div className="flex items-center gap-1 mt-2 text-sm">
                          <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-gray-600">{favorite.audiobook.rating}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAudiobooks.map((favorite) => (
                    <motion.div
                      key={favorite.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-white rounded-2xl shadow-lg p-4 flex gap-4"
                    >
                      <Link href={`/audiobooks/${favorite.audiobook.id}`} className="flex-shrink-0">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center">
                          <FiHeadphones className="w-8 h-8 text-primary/30" />
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/audiobooks/${favorite.audiobook.id}`}>
                          <h3 className="font-semibold text-gray-800 hover:text-primary transition-colors">
                            {favorite.audiobook.title}
                          </h3>
                          <p className="text-sm text-gray-500">{favorite.audiobook.author}</p>
                        </Link>
                        <p className="text-xs text-gray-400 mt-1">Lu par {favorite.audiobook.narrator}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-gray-500">{formatDuration(favorite.audiobook.totalDuration)}</span>
                          <div className="flex items-center gap-1">
                            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-gray-600">{favorite.audiobook.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <p className="text-xs text-gray-400">Ajouté le {formatDate(favorite.addedAt)}</p>
                        <button
                          onClick={() => removeFavoriteAudiobook(favorite.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
