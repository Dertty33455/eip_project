'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiArrowLeft, 
  FiUser, 
  FiMapPin, 
  FiCalendar,
  FiSettings,
  FiMail,
  FiPhone,
  FiBook,
  FiHeadphones,
  FiUsers,
  FiHeart,
  FiStar,
  FiCheck,
  FiEdit3,
  FiGrid,
  FiList,
  FiMessageCircle,
  FiShare2,
  FiMoreHorizontal,
  FiUserPlus,
  FiUserMinus,
  FiShoppingBag,
  FiAward,
  FiTrendingUp
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

interface UserProfile {
  id: string
  username: string
  firstName: string
  lastName: string
  bio?: string
  avatar?: string
  coverImage?: string
  email: string
  phone?: string
  city?: string
  country?: string
  isVerified: boolean
  isSeller: boolean
  createdAt: string
  stats: {
    booksListed: number
    booksSold: number
    followers: number
    following: number
    rating: number
    reviewCount: number
  }
  badges: Badge[]
  recentPosts: Post[]
  listedBooks: ListedBook[]
  favoriteAudiobooks: FavoriteAudiobook[]
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  earnedAt: string
}

interface Post {
  id: string
  content: string
  imageUrl?: string
  likesCount: number
  commentsCount: number
  createdAt: string
}

interface ListedBook {
  id: string
  title: string
  author: string
  price: number
  coverImage?: string
  condition: string
}

interface FavoriteAudiobook {
  id: string
  title: string
  author: string
  coverImage?: string
  duration: number
}

const conditionLabels: Record<string, string> = {
  NEW: 'Neuf',
  LIKE_NEW: 'Comme neuf',
  GOOD: 'Bon état',
  ACCEPTABLE: 'Acceptable'
}

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'posts' | 'books' | 'audiobooks' | 'about'>('posts')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  const isOwnProfile = currentUser?.username === params.username

  useEffect(() => {
    fetchProfile()
    if (currentUser && !isOwnProfile) {
      checkFollowStatus()
    }
  }, [params.username])

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/${params.username}`)
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
      } else if (res.status === 404) {
        setProfile(null)
      } else {
        console.error('Unexpected response fetching profile:', res.status)
        setProfile(null)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const checkFollowStatus = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/${params.username}/follow/check`)
      if (res.ok) {
        const data = await res.json()
        setIsFollowing(data.isFollowing)
      }
    } catch (error) {
      console.error('Error checking follow status:', error)
    }
  }

  const toggleFollow = async () => {
    if (!currentUser) {
      toast.error('Connectez-vous pour suivre cet utilisateur')
      router.push('/login')
      return
    }

    try {
      const method = isFollowing ? 'DELETE' : 'POST'
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/${params.username}/follow`, { method })

      if (res.ok) {
        setIsFollowing(!isFollowing)
        setProfile(prev => prev ? {
          ...prev,
          stats: {
            ...prev.stats,
            followers: prev.stats.followers + (isFollowing ? -1 : 1)
          }
        } : null)
        toast.success(isFollowing ? 'Vous ne suivez plus cet utilisateur' : 'Vous suivez maintenant cet utilisateur')
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.firstName} ${profile?.lastName} sur BookShell`,
          text: `Découvrez le profil de ${profile?.firstName} sur BookShell`,
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
      year: 'numeric',
      month: 'long'
    })
  }

  const formatRelativeDate = (date: string) => {
    const now = new Date()
    const postDate = new Date(date)
    const diffInDays = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Aujourd\'hui'
    if (diffInDays === 1) return 'Hier'
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`
    if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`
    return new Date(date).toLocaleDateString('fr-FR')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <FiUser className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Utilisateur non trouvé</h1>
        <p className="text-gray-600 mb-4">Ce profil n'existe pas ou a été supprimé.</p>
        <Link href="/" className="btn-primary">
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-primary to-secondary">
        <div className="absolute inset-0 bg-[url('/images/african-pattern.svg')] bg-repeat opacity-10"></div>
        {profile.coverImage && (
          <img 
            src={profile.coverImage} 
            alt="Cover" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        {/* Back button */}
        <div className="absolute top-4 left-4">
          <button 
            onClick={() => router.back()}
            className="p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={shareProfile}
            className="p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <FiShare2 className="w-5 h-5" />
          </button>
          {isOwnProfile && (
            <Link 
              href="/settings"
              className="p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <FiSettings className="w-5 h-5" />
            </Link>
          )}
          <div className="relative">
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <FiMoreHorizontal className="w-5 h-5" />
            </button>
            <AnimatePresence>
              {showMoreMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-10"
                >
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <FiMessageCircle className="w-4 h-4" />
                    Envoyer un message
                  </button>
                  <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50 flex items-center gap-2">
                    Signaler
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="relative -mt-16 mb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {profile.firstName[0]}{profile.lastName[0]}
              </div>
              {profile.isVerified && (
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <FiCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Name & Actions */}
            <div className="flex-1 pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {profile.firstName} {profile.lastName}
                    {profile.isSeller && (
                      <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-xs font-medium rounded-full">
                        Vendeur
                      </span>
                    )}
                  </h1>
                  <p className="text-gray-500">@{profile.username}</p>
                </div>
                
                {!isOwnProfile ? (
                  <div className="flex gap-3">
                    <button
                      onClick={toggleFollow}
                      className={`px-6 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 ${
                        isFollowing
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <FiUserMinus className="w-4 h-4" />
                          Suivi
                        </>
                      ) : (
                        <>
                          <FiUserPlus className="w-4 h-4" />
                          Suivre
                        </>
                      )}
                    </button>
                    <button className="px-6 py-2 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <FiMessageCircle className="w-4 h-4" />
                      Message
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/settings"
                    className="px-6 py-2 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <FiEdit3 className="w-4 h-4" />
                    Modifier le profil
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio & Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          {profile.bio && (
            <p className="text-gray-700 whitespace-pre-line mb-4">{profile.bio}</p>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            {profile.city && (
              <span className="flex items-center gap-1">
                <FiMapPin className="w-4 h-4" />
                {profile.city}, {profile.country}
              </span>
            )}
            <span className="flex items-center gap-1">
              <FiCalendar className="w-4 h-4" />
              Membre depuis {formatDate(profile.createdAt)}
            </span>
            {profile.isSeller && (
              <span className="flex items-center gap-1">
                <FiStar className="w-4 h-4 text-yellow-500" />
                {profile.stats.rating} ({profile.stats.reviewCount} avis)
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{profile.stats.followers}</div>
              <div className="text-sm text-gray-500">Abonnés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{profile.stats.following}</div>
              <div className="text-sm text-gray-500">Abonnements</div>
            </div>
            {profile.isSeller && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{profile.stats.booksListed}</div>
                  <div className="text-sm text-gray-500">Livres en vente</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{profile.stats.booksSold}</div>
                  <div className="text-sm text-gray-500">Ventes réalisées</div>
                </div>
              </>
            )}
          </div>

          {/* Badges */}
          {profile.badges.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FiAward className="w-5 h-5 text-primary" />
                Badges
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}
                    title={badge.description}
                  >
                    <span className="mr-1">{badge.icon}</span>
                    {badge.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="flex border-b overflow-x-auto">
            {[
              { id: 'posts', label: 'Publications', icon: FiMessageCircle },
              { id: 'books', label: 'Livres', icon: FiBook, count: profile.listedBooks.length },
              { id: 'audiobooks', label: 'Audiobooks', icon: FiHeadphones, count: profile.favoriteAudiobooks.length },
              { id: 'about', label: 'À propos', icon: FiUser }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex-shrink-0 px-6 py-4 font-medium transition-colors relative flex items-center gap-2 ${
                  selectedTab === tab.id
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {tab.count}
                  </span>
                )}
                {selectedTab === tab.id && (
                  <motion.div
                    layoutId="profileTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Posts Tab */}
              {selectedTab === 'posts' && (
                <motion.div
                  key="posts"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {profile.recentPosts.map((post) => (
                    <div key={post.id} className="border-b pb-6 last:border-0">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-medium">
                          {profile.firstName[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-800">{profile.firstName}</span>
                            <span className="text-sm text-gray-500">@{profile.username}</span>
                            <span className="text-sm text-gray-400">• {formatRelativeDate(post.createdAt)}</span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-line mb-4">{post.content}</p>
                          {post.imageUrl && (
                            <div className="rounded-xl overflow-hidden mb-4 bg-gray-100 aspect-video">
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                Image
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                              <FiHeart className="w-4 h-4" />
                              {post.likesCount}
                            </button>
                            <button className="flex items-center gap-1 hover:text-primary transition-colors">
                              <FiMessageCircle className="w-4 h-4" />
                              {post.commentsCount}
                            </button>
                            <button className="flex items-center gap-1 hover:text-primary transition-colors">
                              <FiShare2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Books Tab */}
              {selectedTab === 'books' && (
                <motion.div
                  key="books"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {profile.isSeller && (
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-semibold text-gray-800">
                        {profile.listedBooks.length} livres en vente
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded-lg transition-colors ${
                            viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          <FiGrid className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded-lg transition-colors ${
                            viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          <FiList className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {profile.listedBooks.map((book) => (
                        <Link
                          key={book.id}
                          href={`/books/${book.id}`}
                          className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
                        >
                          <div className="aspect-[3/4] bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
                            <FiBook className="w-12 h-12 text-primary/20" />
                          </div>
                          <div className="p-4">
                            <h4 className="font-medium text-gray-800 group-hover:text-primary transition-colors line-clamp-1">
                              {book.title}
                            </h4>
                            <p className="text-sm text-gray-500 line-clamp-1">{book.author}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-bold text-primary text-sm">{formatPrice(book.price)}</span>
                              <span className="text-xs text-gray-500">{conditionLabels[book.condition]}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {profile.listedBooks.map((book) => (
                        <Link
                          key={book.id}
                          href={`/books/${book.id}`}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div className="w-16 h-20 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FiBook className="w-6 h-6 text-primary/20" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 truncate">{book.title}</h4>
                            <p className="text-sm text-gray-500">{book.author}</p>
                            <span className="text-xs text-gray-500">{conditionLabels[book.condition]}</span>
                          </div>
                          <span className="font-bold text-primary">{formatPrice(book.price)}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Audiobooks Tab */}
              {selectedTab === 'audiobooks' && (
                <motion.div
                  key="audiobooks"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Audiobooks favoris
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.favoriteAudiobooks.map((audiobook) => (
                      <Link
                        key={audiobook.id}
                        href={`/audiobooks/${audiobook.id}`}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FiHeadphones className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-800 group-hover:text-primary transition-colors truncate">
                            {audiobook.title}
                          </h4>
                          <p className="text-sm text-gray-500">{audiobook.author}</p>
                          <span className="text-xs text-gray-400">{formatDuration(audiobook.duration)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* About Tab */}
              {selectedTab === 'about' && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4">Informations</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <FiUser className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Nom complet</p>
                          <p className="font-medium text-gray-800">{profile.firstName} {profile.lastName}</p>
                        </div>
                      </div>
                      {profile.city && (
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                          <FiMapPin className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Localisation</p>
                            <p className="font-medium text-gray-800">{profile.city}, {profile.country}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <FiCalendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Membre depuis</p>
                          <p className="font-medium text-gray-800">{formatDate(profile.createdAt)}</p>
                        </div>
                      </div>
                      {profile.isSeller && (
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                          <FiTrendingUp className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Total des ventes</p>
                            <p className="font-medium text-gray-800">{profile.stats.booksSold} livres vendus</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {profile.isSeller && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4">Performance vendeur</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl">
                          <div className="text-3xl font-bold text-primary">{profile.stats.rating}</div>
                          <div className="text-sm text-gray-500">Note moyenne</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl">
                          <div className="text-3xl font-bold text-primary">{profile.stats.reviewCount}</div>
                          <div className="text-sm text-gray-500">Avis reçus</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl">
                          <div className="text-3xl font-bold text-primary">{profile.stats.booksSold}</div>
                          <div className="text-sm text-gray-500">Ventes</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl">
                          <div className="text-3xl font-bold text-primary">{profile.badges.length}</div>
                          <div className="text-sm text-gray-500">Badges</div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
