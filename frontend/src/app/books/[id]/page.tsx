'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiArrowLeft, 
  FiHeart, 
  FiShoppingCart, 
  FiShare2, 
  FiStar, 
  FiUser, 
  FiMapPin, 
  FiCalendar,
  FiBook,
  FiTruck,
  FiShield,
  FiMessageCircle,
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiAlertCircle
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

interface Book {
  id: string
  title: string
  author: string
  description: string
  price: number
  coverImage: string
  condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'ACCEPTABLE'
  isbn?: string
  publisher?: string
  publicationYear?: number
  pageCount?: number
  language: string
  stock: number
  rating: number
  reviewCount: number
  category: {
    id: string
    name: string
    slug: string
  }
  seller: {
    id: string
    username: string
    firstName: string
    lastName: string
    avatar?: string
    isVerified: boolean
    totalSales: number
    rating: number
    createdAt: string
    city?: string
    country?: string
  }
  reviews: Review[]
  relatedBooks: RelatedBook[]
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

interface RelatedBook {
  id: string
  title: string
  author: string
  price: number
  coverImage: string
  rating: number
}

const conditionLabels = {
  NEW: 'Neuf',
  LIKE_NEW: 'Comme neuf',
  GOOD: 'Bon état',
  ACCEPTABLE: 'Acceptable'
}

const conditionColors = {
  NEW: 'bg-green-100 text-green-800',
  LIKE_NEW: 'bg-blue-100 text-blue-800',
  GOOD: 'bg-yellow-100 text-yellow-800',
  ACCEPTABLE: 'bg-orange-100 text-orange-800'
}

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'description' | 'details' | 'reviews'>('description')
  const [addingToCart, setAddingToCart] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    fetchBook()
    checkFavorite()
  }, [params.id])

  const fetchBook = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/books/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setBook(data)
      } else {
        // Demo data
        setBook({
          id: params.id as string,
          title: 'L\'Enfant Noir',  
          author: 'Camara Laye',
          description: `L'Enfant noir est un roman autobiographique de l'écrivain guinéen Camara Laye, publié en 1953. Ce chef-d'œuvre de la littérature africaine raconte l'enfance de l'auteur en Haute-Guinée, dans un village traditionnel où les croyances animistes côtoient l'islam.

Le narrateur nous fait découvrir son univers familial : son père, forgeron respecté doté de pouvoirs mystiques, sa mère protectrice qui possède elle aussi des dons surnaturels, et les traditions ancestrales qui rythment la vie quotidienne.

De son village natal à Conakry puis à Paris, l'auteur retrace son parcours initiatique, de la circoncision aux études supérieures, illustrant le déchirement entre tradition et modernité, entre l'Afrique et l'Occident.

Ce récit poétique et nostalgique est devenu un classique incontournable de la littérature francophone, lu et étudié dans le monde entier.`,
          price: 8500,
          coverImage: '/images/books/enfant-noir.jpg',
          condition: 'LIKE_NEW',
          isbn: '978-2-266-02340-3',
          publisher: 'Pocket',
          publicationYear: 1953,
          pageCount: 224,
          language: 'Français',
          stock: 15,
          rating: 4.8,
          reviewCount: 127,
          category: {
            id: '1',
            name: 'Romans Africains',
            slug: 'romans-africains'
          },
          seller: {
            id: 's1',
            username: 'librairie_dakar',
            firstName: 'Amadou',
            lastName: 'Diallo',
            avatar: '/images/avatars/seller1.jpg',
            isVerified: true,
            totalSales: 342,
            rating: 4.9,
            createdAt: '2022-03-15',
            city: 'Dakar',
            country: 'Sénégal'
          },
          reviews: [
            {
              id: 'r1',
              rating: 5,
              comment: 'Un chef-d\'œuvre de la littérature africaine. Livraison rapide et livre en excellent état.',
              createdAt: '2024-01-15',
              user: {
                id: 'u1',
                username: 'fatou_reader',
                firstName: 'Fatou',
                avatar: '/images/avatars/user1.jpg'
              }
            },
            {
              id: 'r2',
              rating: 5,
              comment: 'Vendeur très sérieux. Le livre correspond parfaitement à la description.',
              createdAt: '2024-01-10',
              user: {
                id: 'u2',
                username: 'book_lover_ci',
                firstName: 'Kouamé'
              }
            },
            {
              id: 'r3',
              rating: 4,
              comment: 'Bon livre, quelques traces d\'usure mais rien de grave. Je recommande !',
              createdAt: '2024-01-05',
              user: {
                id: 'u3',
                username: 'mamadou_225',
                firstName: 'Mamadou'
              }
            }
          ],
          relatedBooks: [
            {
              id: 'rb1',
              title: 'Une si longue lettre',
              author: 'Mariama Bâ',
              price: 7500,
              coverImage: '/images/books/longue-lettre.jpg',
              rating: 4.7
            },
            {
              id: 'rb2',
              title: 'Les Soleils des Indépendances',
              author: 'Ahmadou Kourouma',
              price: 9000,
              coverImage: '/images/books/soleils.jpg',
              rating: 4.6
            },
            {
              id: 'rb3',
              title: 'Ville cruelle',
              author: 'Eza Boto',
              price: 6500,
              coverImage: '/images/books/ville-cruelle.jpg',
              rating: 4.4
            },
            {
              id: 'rb4',
              title: 'Le Monde s\'effondre',
              author: 'Chinua Achebe',
              price: 8000,
              coverImage: '/images/books/monde-effondre.jpg',
              rating: 4.9
            }
          ]
        })
      }
    } catch (error) {
      console.error('Error fetching book:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkFavorite = async () => {
    if (!user) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/favorites/check?bookId=${params.id}`)
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/favorites`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: params.id })
      })

      if (res.ok) {
        setIsFavorite(!isFavorite)
        toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris')
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des favoris')
    }
  }

  const addToCart = async () => {
    if (!user) {
      toast.error('Connectez-vous pour ajouter au panier')
      router.push('/login')
      return
    }

    setAddingToCart(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: params.id, quantity })
      })

      if (res.ok) {
        toast.success(`${quantity} livre(s) ajouté(s) au panier`)
      } else {
        const error = await res.json()
        toast.error(error.message || 'Erreur lors de l\'ajout au panier')
      }
    } catch (error) {
      toast.error('Erreur lors de l\'ajout au panier')
    } finally {
      setAddingToCart(false)
    }
  }

  const buyNow = async () => {
    if (!user) {
      toast.error('Connectez-vous pour acheter')
      router.push('/login')
      return
    }
    
    await addToCart()
    router.push('/checkout')
  }

  const shareBook = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: book?.title,
          text: `Découvrez "${book?.title}" par ${book?.author} sur AfriBook`,
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

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('Connectez-vous pour laisser un avis')
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/books/${params.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      })

      if (res.ok) {
        toast.success('Avis ajouté avec succès')
        setShowReviewModal(false)
        setNewReview({ rating: 5, comment: '' })
        fetchBook()
      } else {
        toast.error('Erreur lors de l\'ajout de l\'avis')
      }
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de l\'avis')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
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

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <FiAlertCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Livre non trouvé</h1>
        <p className="text-gray-600 mb-4">Ce livre n'existe pas ou a été supprimé.</p>
        <Link href="/books" className="btn-primary">
          Retour aux livres
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary">Accueil</Link>
            <span className="text-gray-300">/</span>
            <Link href="/books" className="text-gray-500 hover:text-primary">Livres</Link>
            <span className="text-gray-300">/</span>
            <Link href={`/books?category=${book.category.slug}`} className="text-gray-500 hover:text-primary">
              {book.category.name}
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-800 font-medium truncate max-w-[200px]">{book.title}</span>
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
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden aspect-[3/4] relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <FiBook className="w-24 h-24 text-primary/20 mx-auto mb-4" />
                  <p className="text-gray-400">Image du livre</p>
                </div>
              </div>
              {/* Condition Badge */}
              <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${conditionColors[book.condition]}`}>
                {conditionLabels[book.condition]}
              </div>
              {/* Share & Favorite */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={shareBook}
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
            </motion.div>

            {/* Seller Info Card - Desktop */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hidden lg:block bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="font-semibold text-gray-800 mb-4">Vendu par</h3>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold">
                  {book.seller.firstName[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">{book.seller.firstName} {book.seller.lastName}</span>
                    {book.seller.isVerified && (
                      <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        <FiCheck className="w-3 h-3" />
                        Vérifié
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">@{book.seller.username}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    {book.seller.city && (
                      <span className="flex items-center gap-1">
                        <FiMapPin className="w-4 h-4" />
                        {book.seller.city}, {book.seller.country}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <FiStar className="w-4 h-4 text-yellow-500" />
                      {book.seller.rating}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {book.seller.totalSales} ventes • Membre depuis {new Date(book.seller.createdAt).getFullYear()}
                  </p>
                </div>
              </div>
              <Link 
                href={`/profile/${book.seller.username}`}
                className="mt-4 block text-center w-full py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Voir le profil
              </Link>
            </motion.div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 lg:p-8"
            >
              {/* Category */}
              <Link 
                href={`/books?category=${book.category.slug}`}
                className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 hover:bg-primary/20 transition-colors"
              >
                {book.category.name}
              </Link>

              {/* Title & Author */}
              <h1 className="text-2xl lg:text-3xl font-bold font-display text-gray-900 mb-2">
                {book.title}
              </h1>
              <p className="text-lg text-gray-600 mb-4">par {book.author}</p>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(book.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-gray-800">{book.rating}</span>
                <span className="text-gray-500">({book.reviewCount} avis)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-primary">{formatPrice(book.price)}</span>
                <p className="text-sm text-gray-500 mt-1">
                  + frais de livraison selon votre localisation
                </p>
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 mb-6">
                {book.stock > 0 ? (
                  <>
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-green-700 font-medium">En stock</span>
                    <span className="text-gray-500">({book.stock} disponibles)</span>
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="text-red-700 font-medium">Rupture de stock</span>
                  </>
                )}
              </div>

              {/* Quantity Selector */}
              {book.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-gray-700">Quantité:</span>
                  <div className="flex items-center border border-gray-300 rounded-xl">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                      disabled={quantity >= book.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={addToCart}
                  disabled={book.stock === 0 || addingToCart}
                  className="flex-1 py-4 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {addingToCart ? (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiShoppingCart className="w-5 h-5" />
                      Ajouter au panier
                    </>
                  )}
                </button>
                <button
                  onClick={buyNow}
                  disabled={book.stock === 0}
                  className="flex-1 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Acheter maintenant
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                <div className="text-center">
                  <FiTruck className="w-6 h-6 mx-auto text-primary mb-2" />
                  <p className="text-xs text-gray-600">Livraison rapide</p>
                </div>
                <div className="text-center">
                  <FiShield className="w-6 h-6 mx-auto text-primary mb-2" />
                  <p className="text-xs text-gray-600">Paiement sécurisé</p>
                </div>
                <div className="text-center">
                  <FiMessageCircle className="w-6 h-6 mx-auto text-primary mb-2" />
                  <p className="text-xs text-gray-600">Support réactif</p>
                </div>
              </div>
            </motion.div>

            {/* Seller Info Card - Mobile */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:hidden bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="font-semibold text-gray-800 mb-4">Vendu par</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                  {book.seller.firstName[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{book.seller.firstName}</span>
                    {book.seller.isVerified && (
                      <FiCheck className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiStar className="w-4 h-4 text-yellow-500" />
                    <span>{book.seller.rating}</span>
                    <span>•</span>
                    <span>{book.seller.totalSales} ventes</span>
                  </div>
                </div>
                <Link 
                  href={`/profile/${book.seller.username}`}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50"
                >
                  Voir
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tabs Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Tab Headers */}
          <div className="flex border-b">
            {[
              { id: 'description', label: 'Description' },
              { id: 'details', label: 'Détails' },
              { id: 'reviews', label: `Avis (${book.reviewCount})` }
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
          <div className="p-6 lg:p-8">
            <AnimatePresence mode="wait">
              {selectedTab === 'description' && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className={`prose max-w-none ${!showFullDescription && 'line-clamp-6'}`}>
                    {book.description.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-gray-600 mb-4">{paragraph}</p>
                    ))}
                  </div>
                  {book.description.length > 500 && (
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
                </motion.div>
              )}

              {selectedTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  <div className="space-y-4">
                    {book.isbn && (
                      <div className="flex justify-between py-3 border-b">
                        <span className="text-gray-500">ISBN</span>
                        <span className="font-medium text-gray-800">{book.isbn}</span>
                      </div>
                    )}
                    {book.publisher && (
                      <div className="flex justify-between py-3 border-b">
                        <span className="text-gray-500">Éditeur</span>
                        <span className="font-medium text-gray-800">{book.publisher}</span>
                      </div>
                    )}
                    {book.publicationYear && (
                      <div className="flex justify-between py-3 border-b">
                        <span className="text-gray-500">Année de publication</span>
                        <span className="font-medium text-gray-800">{book.publicationYear}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {book.pageCount && (
                      <div className="flex justify-between py-3 border-b">
                        <span className="text-gray-500">Nombre de pages</span>
                        <span className="font-medium text-gray-800">{book.pageCount}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-500">Langue</span>
                      <span className="font-medium text-gray-800">{book.language}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-500">État</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${conditionColors[book.condition]}`}>
                        {conditionLabels[book.condition]}
                      </span>
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
                  {/* Add Review Button */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-semibold text-gray-800">Avis des acheteurs</h3>
                      <p className="text-sm text-gray-500">{book.reviewCount} avis au total</p>
                    </div>
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                    >
                      Donner un avis
                    </button>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-6">
                    {book.reviews.map((review) => (
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

        {/* Related Books */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold font-display text-gray-900 mb-6">
            Livres similaires
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {book.relatedBooks && book.relatedBooks.length > 0 ? (
              book.relatedBooks.map((relatedBook) => (
              <Link
                key={relatedBook.id}
                href={`/books/${relatedBook.id}`}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/5 to-accent/5 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FiBook className="w-12 h-12 text-primary/20" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-1">
                    {relatedBook.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{relatedBook.author}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{formatPrice(relatedBook.price)}</span>
                    <div className="flex items-center gap-1 text-sm">
                      <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-gray-600">{relatedBook.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                Aucun livre similaire trouvé
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Donner un avis</h3>
              <form onSubmit={submitReview}>
                {/* Rating Stars */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre note
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="focus:outline-none"
                      >
                        <FiStar
                          className={`w-8 h-8 ${
                            star <= newReview.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 hover:text-yellow-400'
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre commentaire
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                    placeholder="Partagez votre expérience avec ce livre..."
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                  >
                    Publier
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
