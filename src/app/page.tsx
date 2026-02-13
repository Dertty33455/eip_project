'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  FiBook, 
  FiHeadphones, 
  FiUsers, 
  FiDollarSign,
  FiArrowRight,
  FiStar,
  FiTrendingUp,
  FiHeart,
  FiShoppingCart,
  FiPlay
} from 'react-icons/fi'
import { useAuth } from '@/hooks/useAuth'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Hero Section
function HeroSection() {
  const { isAuthenticated } = useAuth()
  
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* African Pattern Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e88c2a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center lg:text-left"
          >
            <motion.div variants={fadeInUp} className="mb-4">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                📚 La première plateforme africaine
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6"
            >
              Découvrez les{' '}
              <span className="text-primary">trésors littéraires</span>{' '}
              de l'Afrique
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Achetez, vendez et écoutez des livres et audiobooks. 
              Rejoignez une communauté passionnée de lecteurs africains.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link 
                href="/books"
                className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4 relative z-20 cursor-pointer"
              >
                Explorer les livres
                <FiArrowRight />
              </Link>
              {!isAuthenticated && (
                <Link 
                  href="/register"
                  className="btn-secondary inline-flex items-center justify-center gap-2 text-lg px-8 py-4 relative z-20 cursor-pointer"
                >
                  Créer un compte gratuit
                </Link>
              )}
            </motion.div>
            
            {/* Stats */}
            <motion.div 
              variants={fadeInUp}
              className="flex gap-8 mt-12 justify-center lg:justify-start"
            >
              {[
                { value: '10K+', label: 'Livres' },
                { value: '500+', label: 'Audiobooks' },
                { value: '50K+', label: 'Utilisateurs' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[600px]">
              {/* Decorative circles */}
              <div className="absolute top-10 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-10 left-10 w-48 h-48 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
              
              {/* Book stack mockup */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative">
                  {/* Main book */}
                  <div className="w-64 h-80 bg-gradient-to-br from-primary to-orange-600 rounded-lg shadow-2xl transform rotate-6">
                    <div className="absolute inset-2 bg-white rounded-lg p-4">
                      <div className="h-full flex flex-col">
                        <div className="flex-1 bg-gradient-to-br from-amber-100 to-orange-100 rounded-md mb-2" />
                        <div className="h-2 bg-gray-200 rounded w-3/4 mb-1" />
                        <div className="h-2 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                  {/* Second book */}
                  <div className="absolute -left-16 top-10 w-56 h-72 bg-gradient-to-br from-secondary to-green-700 rounded-lg shadow-xl transform -rotate-12">
                    <div className="absolute inset-2 bg-white rounded-lg p-4">
                      <div className="h-full flex flex-col">
                        <div className="flex-1 bg-gradient-to-br from-green-100 to-emerald-100 rounded-md mb-2" />
                        <div className="h-2 bg-gray-200 rounded w-3/4 mb-1" />
                        <div className="h-2 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                  {/* Headphones for audiobooks */}
                  <div className="absolute -right-8 bottom-0 w-24 h-24 bg-accent rounded-full shadow-lg flex items-center justify-center">
                    <FiHeadphones className="w-12 h-12 text-gray-800" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: FiBook,
      title: 'Marketplace de livres',
      description: 'Achetez et vendez des livres neufs ou d\'occasion avec d\'autres passionnés de lecture.',
      color: 'bg-primary/10 text-primary'
    },
    {
      icon: FiHeadphones,
      title: 'Audiobooks en streaming',
      description: 'Écoutez des milliers d\'audiobooks. Le premier chapitre est toujours gratuit!',
      color: 'bg-secondary/10 text-secondary'
    },
    {
      icon: FiUsers,
      title: 'Communauté sociale',
      description: 'Partagez vos lectures, suivez des auteurs et discutez avec d\'autres lecteurs.',
      color: 'bg-accent/10 text-amber-700'
    },
    {
      icon: FiDollarSign,
      title: 'Mobile Money intégré',
      description: 'Payez facilement avec MTN Mobile Money ou Moov Money.',
      color: 'bg-purple-100 text-purple-600'
    }
  ]
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4"
          >
            Tout ce dont vous avez besoin
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Une plateforme complète pour les amoureux de la littérature africaine
          </motion.p>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="card hover:shadow-xl transition-shadow text-center"
            >
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Book Card Component
function BookCard({ book }: { book: any }) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -5 }}
      className="card group"
    >
      <div className="relative aspect-[3/4] mb-4 rounded-lg overflow-hidden bg-gray-100">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            <FiBook className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <FiHeart className="w-5 h-5 text-gray-600 hover:text-red-500" />
        </button>
        {book.condition === 'NEW' && (
          <span className="absolute top-3 left-3 badge badge-success">Neuf</span>
        )}
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
      <p className="text-sm text-gray-500 mb-2">{book.author}</p>
      
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <FiStar 
            key={i} 
            className={`w-4 h-4 ${i < (book.rating || 4) ? 'text-accent fill-accent' : 'text-gray-300'}`} 
          />
        ))}
        <span className="text-sm text-gray-500 ml-1">({book.reviewCount || 0})</span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-primary">{book.price?.toLocaleString()} XOF</span>
        <button className="w-10 h-10 bg-primary/10 hover:bg-primary hover:text-white rounded-full flex items-center justify-center transition-colors">
          <FiShoppingCart className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  )
}

// Featured Books Section
function FeaturedBooksSection() {
  const [books, setBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/books?limit=8')
        const data = await res.json()
        setBooks(data.books || [])
      } catch (error) {
        console.error('Error fetching books:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])
  
  // Demo books for display
  const demoBooks = [
    { id: '1', title: 'Les Soleils des Indépendances', author: 'Ahmadou Kourouma', price: 8500, rating: 5, reviewCount: 128, condition: 'NEW' },
    { id: '2', title: 'Une Si Longue Lettre', author: 'Mariama Bâ', price: 6500, rating: 5, reviewCount: 256, condition: 'NEW' },
    { id: '3', title: 'L\'Enfant Noir', author: 'Camara Laye', price: 7000, rating: 4, reviewCount: 89, condition: 'LIKE_NEW' },
    { id: '4', title: 'Tout s\'effondre', author: 'Chinua Achebe', price: 9000, rating: 5, reviewCount: 312, condition: 'NEW' },
    { id: '5', title: 'Le Monde s\'effondre', author: 'Chinua Achebe', price: 8000, rating: 4, reviewCount: 156, condition: 'GOOD' },
    { id: '6', title: 'Sous l\'orage', author: 'Seydou Badian', price: 5500, rating: 4, reviewCount: 67, condition: 'NEW' },
    { id: '7', title: 'Le Vieux Nègre et la Médaille', author: 'Ferdinand Oyono', price: 6000, rating: 4, reviewCount: 94, condition: 'LIKE_NEW' },
    { id: '8', title: 'Ville Cruelle', author: 'Eza Boto', price: 7500, rating: 4, reviewCount: 45, condition: 'NEW' },
  ]
  
  const displayBooks = books.length > 0 ? books : demoBooks
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
              Livres populaires
            </h2>
            <p className="text-gray-600">Découvrez les livres les plus appréciés par notre communauté</p>
          </div>
          <Link 
            href="/books"
            className="hidden md:inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Voir tout
            <FiArrowRight />
          </Link>
        </div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            ))
          ) : (
            displayBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))
          )}
        </motion.div>
        
        <div className="text-center mt-8 md:hidden">
          <Link 
            href="/books"
            className="btn-primary inline-flex items-center gap-2"
          >
            Voir tous les livres
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  )
}

// Audiobook Card Component
function AudiobookCard({ audiobook }: { audiobook: any }) {
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
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white">
            <FiPlay className="w-8 h-8 ml-1" />
          </button>
        </div>
        {/* Duration badge */}
        <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs rounded">
          {audiobook.duration || '4h 32min'}
        </span>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{audiobook.title}</h3>
      <p className="text-sm text-gray-500 mb-2">{audiobook.author}</p>
      <p className="text-xs text-gray-400 mb-2">Lu par {audiobook.narrator || 'Narrateur'}</p>
      
      <div className="flex items-center gap-2">
        <span className="badge badge-primary">Chapitre 1 gratuit</span>
      </div>
    </motion.div>
  )
}

// Featured Audiobooks Section
function FeaturedAudiobooksSection() {
  const [audiobooks, setAudiobooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchAudiobooks = async () => {
      try {
        const res = await fetch('/api/audiobooks?limit=4')
        const data = await res.json()
        setAudiobooks(data.audiobooks || [])
      } catch (error) {
        console.error('Error fetching audiobooks:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAudiobooks()
  }, [])
  
  // Demo audiobooks
  const demoAudiobooks = [
    { id: '1', title: 'Les Soleils des Indépendances', author: 'Ahmadou Kourouma', narrator: 'Souleymane Sy Savane', duration: '6h 45min' },
    { id: '2', title: 'Une Si Longue Lettre', author: 'Mariama Bâ', narrator: 'Aïssa Maïga', duration: '3h 20min' },
    { id: '3', title: 'L\'Enfant Noir', author: 'Camara Laye', narrator: 'Eriq Ebouaney', duration: '5h 10min' },
    { id: '4', title: 'Tout s\'effondre', author: 'Chinua Achebe', narrator: 'Peter Mensah', duration: '7h 30min' },
  ]
  
  const displayAudiobooks = audiobooks.length > 0 ? audiobooks : demoAudiobooks
  
  return (
    <section className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
              Audiobooks à écouter
            </h2>
            <p className="text-gray-600">Le premier chapitre est toujours gratuit. Abonnez-vous pour écouter la suite!</p>
          </div>
          <Link 
            href="/audiobooks"
            className="hidden md:inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Voir tout
            <FiArrowRight />
          </Link>
        </div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))
          ) : (
            displayAudiobooks.map((audiobook) => (
              <AudiobookCard key={audiobook.id} audiobook={audiobook} />
            ))
          )}
        </motion.div>
        
        {/* Subscription CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">
              Accès illimité à tous les audiobooks
            </h3>
            <p className="text-gray-600 mb-6">
              À partir de <span className="text-primary font-bold">2 500 XOF/mois</span>
            </p>
            <Link href="/subscriptions" className="btn-primary inline-flex items-center gap-2">
              Découvrir les abonnements
              <FiArrowRight />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Categories Section
function CategoriesSection() {
  const categories = [
    { name: 'Littérature Africaine', icon: '📖', count: 1250, color: 'from-orange-400 to-red-500' },
    { name: 'Roman', icon: '📚', count: 2340, color: 'from-blue-400 to-indigo-500' },
    { name: 'Business & Entrepreneuriat', icon: '💼', count: 890, color: 'from-green-400 to-emerald-500' },
    { name: 'Développement Personnel', icon: '🎯', count: 1100, color: 'from-purple-400 to-pink-500' },
    { name: 'Poésie', icon: '✨', count: 560, color: 'from-yellow-400 to-orange-500' },
    { name: 'Contes & Légendes', icon: '🌍', count: 780, color: 'from-teal-400 to-cyan-500' },
  ]
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4"
          >
            Explorez par catégorie
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-gray-600"
          >
            Trouvez exactement ce que vous cherchez
          </motion.p>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <Link 
                href={`/books?category=${encodeURIComponent(category.name)}`}
                className="block p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-all text-center group"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{category.name}</h3>
                <p className="text-xs text-gray-500">{category.count} titres</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Community Section
function CommunitySection() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Rejoignez la communauté
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Partagez vos lectures favorites, discutez avec d'autres passionnés, 
              suivez vos auteurs préférés et découvrez de nouvelles pépites littéraires.
            </p>
            <div className="space-y-4">
              {[
                'Partagez vos critiques et recommandations',
                'Suivez vos auteurs et lecteurs favoris',
                'Participez aux discussions littéraires',
                'Découvrez des livres grâce aux suggestions personnalisées'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/community" className="btn-primary inline-flex items-center gap-2">
                Explorer la communauté
                <FiArrowRight />
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Social feed mockup */}
            <div className="bg-white rounded-2xl p-6 text-gray-900 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <div>
                  <h4 className="font-semibold">Aminata Diallo</h4>
                  <p className="text-sm text-gray-500">Il y a 2 heures</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Je viens de terminer "Les Soleils des Indépendances" d'Ahmadou Kourouma. 
                Un chef-d'œuvre absolu! La façon dont il mélange le français et le malinké 
                est fascinante. 📚✨
              </p>
              <div className="flex items-center gap-6 text-gray-500">
                <button className="flex items-center gap-1 hover:text-red-500">
                  <FiHeart className="w-5 h-5" />
                  <span>124</span>
                </button>
                <button className="flex items-center gap-1 hover:text-primary">
                  <span>💬</span>
                  <span>23</span>
                </button>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/30 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/30 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Sell Section
function SellSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-orange-600">
      <div className="container mx-auto px-4 text-center text-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-display font-bold mb-4"
          >
            Vendez vos livres
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-white/90 text-lg mb-8 max-w-2xl mx-auto"
          >
            Vous avez des livres à vendre? Rejoignez notre marketplace et touchez des milliers 
            de lecteurs passionnés. Commission de seulement 5% sur les ventes!
          </motion.p>
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              href="/sell"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Commencer à vendre
              <FiArrowRight />
            </Link>
            <Link 
              href="/seller-guide"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              Guide du vendeur
            </Link>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            variants={fadeInUp}
            className="flex gap-12 justify-center mt-12"
          >
            {[
              { value: '5%', label: 'Commission' },
              { value: '24h', label: 'Délai de paiement' },
              { value: '10K+', label: 'Vendeurs actifs' },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Fatou Ndoye',
      role: 'Lectrice passionnée',
      location: 'Dakar, Sénégal',
      text: 'Grâce à AfriBook, j\'ai découvert des auteurs africains que je ne connaissais pas. La communauté est incroyable!',
      rating: 5
    },
    {
      name: 'Kofi Mensah',
      role: 'Vendeur vérifié',
      location: 'Accra, Ghana',
      text: 'En tant que vendeur, j\'apprécie la facilité d\'utilisation et les paiements rapides via Mobile Money.',
      rating: 5
    },
    {
      name: 'Amina Touré',
      role: 'Auteure',
      location: 'Abidjan, Côte d\'Ivoire',
      text: 'Les audiobooks m\'ont permis d\'écouter mes livres préférés pendant mes trajets. Le chapitre gratuit est génial!',
      rating: 5
    }
  ]
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4"
          >
            Ce que disent nos utilisateurs
          </motion.h2>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="card"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="w-5 h-5 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg">{testimonial.name[0]}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                  <p className="text-xs text-gray-400">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// CTA Section
function CTASection() {
  const { isAuthenticated } = useAuth()
  
  if (isAuthenticated) return null
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Prêt à commencer?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
            Créez votre compte gratuitement et rejoignez des milliers de lecteurs africains.
          </p>
          <Link 
            href="/register"
            className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
          >
            Créer mon compte gratuit
            <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// Main Page Component
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <FeaturedBooksSection />
      <CategoriesSection />
      <FeaturedAudiobooksSection />
      <CommunitySection />
      <SellSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  )
}
