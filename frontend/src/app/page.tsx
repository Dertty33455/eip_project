'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useInView } from 'framer-motion'
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
  FiPlay,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi'
import { useAuth } from '@/hooks/useAuth'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
}

// Animated Counter Component
function AnimatedCounter({ value, suffix = '', duration = 2000 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const end = value
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isInView, value, duration])

  return (
    <div ref={ref} className="text-2xl md:text-3xl font-bold text-primary-500 tabular-nums">
      {count.toLocaleString()}{suffix}
    </div>
  )
}

// Hero Section
function HeroSection() {
  const { isAuthenticated } = useAuth()

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50/80 to-cream-100">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-96 h-96 bg-primary-200/30 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-20 right-[15%] w-80 h-80 bg-secondary-200/20 rounded-full blur-[80px] animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-200/15 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      {/* African Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
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
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm text-primary-600 rounded-full text-sm font-semibold shadow-sm border border-primary-100/50">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                La première plateforme africaine
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-earth-900 mb-6 leading-[1.1] tracking-tight"
            >
              Découvrez les{' '}
              <span className="gradient-text-animated">trésors littéraires</span>{' '}
              de l&apos;Afrique
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-earth-500 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
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
                prefetch={true}
                className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4 relative z-20 cursor-pointer group"
              >
                Explorer les livres
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              {!isAuthenticated && (
                <Link
                  href="/register"
                  prefetch={true}
                  className="btn-outline inline-flex items-center justify-center gap-2 text-lg px-8 py-4 relative z-20 cursor-pointer bg-white/60 backdrop-blur-sm"
                >
                  Créer un compte gratuit
                </Link>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="flex gap-10 mt-14 justify-center lg:justify-start"
            >
              {[
                { value: 10000, suffix: '+', label: 'Livres' },
                { value: 500, suffix: '+', label: 'Audiobooks' },
                { value: 50000, suffix: '+', label: 'Utilisateurs' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  <div className="text-sm text-earth-400 mt-1 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[600px]">
              {/* Decorative circles */}
              <div className="absolute top-10 right-10 w-72 h-72 bg-primary-300/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
              <div className="absolute bottom-10 left-10 w-48 h-48 bg-secondary-300/20 rounded-full blur-3xl pointer-events-none animate-float-delayed" />

              {/* Book stack mockup */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative">
                  {/* Main book */}
                  <div className="w-64 h-80 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl shadow-2xl transform rotate-6 animate-float">
                    <div className="absolute inset-[6px] bg-white rounded-xl p-4">
                      <div className="h-full flex flex-col">
                        <div className="flex-1 bg-gradient-to-br from-amber-50 to-orange-100 rounded-lg mb-3 flex items-center justify-center">
                          <FiBook className="w-16 h-16 text-primary-300/50" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-2.5 bg-earth-100 rounded-full w-3/4" />
                          <div className="h-2 bg-earth-100 rounded-full w-1/2" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Second book */}
                  <div className="absolute -left-20 top-10 w-56 h-72 bg-gradient-to-br from-secondary-500 to-secondary-700 rounded-2xl shadow-xl transform -rotate-12 animate-float-rotate animation-delay-500">
                    <div className="absolute inset-[6px] bg-white rounded-xl p-4">
                      <div className="h-full flex flex-col">
                        <div className="flex-1 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg mb-3 flex items-center justify-center">
                          <FiBook className="w-14 h-14 text-secondary-300/50" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-2.5 bg-earth-100 rounded-full w-3/4" />
                          <div className="h-2 bg-earth-100 rounded-full w-1/2" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Headphones for audiobooks */}
                  <div className="absolute -right-6 bottom-4 w-24 h-24 bg-gradient-to-br from-accent-300 to-accent-500 rounded-2xl shadow-lg flex items-center justify-center animate-float-delayed animation-delay-300">
                    <FiHeadphones className="w-10 h-10 text-earth-800" />
                  </div>
                  {/* Floating stars */}
                  <div className="absolute -top-6 -right-4 w-10 h-10 bg-accent-200 rounded-xl flex items-center justify-center shadow-md animate-float animation-delay-700">
                    <FiStar className="w-5 h-5 text-accent-600" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
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
      gradient: 'from-primary-500 to-orange-500',
      bgLight: 'bg-primary-50',
    },
    {
      icon: FiHeadphones,
      title: 'Audiobooks en streaming',
      description: 'Écoutez des milliers d\'audiobooks. Le premier chapitre est toujours gratuit!',
      gradient: 'from-secondary-500 to-emerald-500',
      bgLight: 'bg-secondary-50',
    },
    {
      icon: FiUsers,
      title: 'Communauté sociale',
      description: 'Partagez vos lectures, suivez des auteurs et discutez avec d\'autres lecteurs.',
      gradient: 'from-accent-500 to-yellow-500',
      bgLight: 'bg-accent-50',
    },
    {
      icon: FiDollarSign,
      title: 'Mobile Money intégré',
      description: 'Payez facilement avec MTN Mobile Money ou Moov Money.',
      gradient: 'from-violet-500 to-purple-600',
      bgLight: 'bg-violet-50',
    }
  ]

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-50/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp} className="mb-4">
            <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold">
              Fonctionnalités
            </span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-earth-900 mb-4"
          >
            Tout ce dont vous avez besoin
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-earth-500 max-w-2xl mx-auto"
          >
            Une plateforme complète pour les amoureux de la littérature africaine
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="group relative p-8 rounded-2xl bg-white border border-cream-200/80 hover:border-transparent transition-all duration-500 hover:shadow-card-hover"
            >
              {/* Gradient border on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, rgba(232,140,42,0.3), rgba(27,94,32,0.3), rgba(249,188,21,0.3)) border-box',
                  border: '1px solid transparent',
                  borderRadius: '1rem',
                }}
              />
              <div className={`w-14 h-14 ${feature.bgLight} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-earth-900 mb-2 text-center">{feature.title}</h3>
              <p className="text-earth-500 text-center text-sm leading-relaxed">{feature.description}</p>
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
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group"
    >
      <div className="card-premium p-4">
        <div className="relative aspect-[3/4] mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-cream-100 to-cream-200">
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
              <FiBook className="w-12 h-12 text-earth-300" />
            </div>
          )}
          <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm hover:bg-white hover:shadow-md">
            <FiHeart className="w-5 h-5 text-earth-500 hover:text-red-500 transition-colors" />
          </button>
          {book.condition === 'NEW' && (
            <span className="absolute top-3 left-3 badge-success shadow-sm">Neuf</span>
          )}
        </div>

        <h3 className="font-semibold text-earth-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">{book.title}</h3>
        <p className="text-sm text-earth-400 mb-2">{book.author}</p>

        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              className={`w-3.5 h-3.5 ${i < (book.rating || 4) ? 'text-accent-400 fill-accent-400' : 'text-earth-200'}`}
            />
          ))}
          <span className="text-xs text-earth-400 ml-1">({book.reviewCount || 0})</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-cream-200/60">
          <span className="text-lg font-bold text-primary-600">{book.price?.toLocaleString()} <span className="text-xs font-medium text-earth-400">XOF</span></span>
          <button className="w-10 h-10 bg-primary-50 hover:bg-primary-500 hover:text-white text-primary-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-african">
            <FiShoppingCart className="w-4.5 h-4.5" />
          </button>
        </div>
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
        const url = apiUrl ? `${apiUrl}/api/books?limit=8` : '/api/books?limit=8'
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setBooks(data.data || data.books || [])
      } catch (error) {
        console.error('Error fetching books:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

  const displayBooks = books

  return (
    <section className="py-24 bg-cream-50/50">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-4">
              📚 Populaires
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-earth-900 mb-3">
              Livres populaires
            </h2>
            <p className="text-earth-500 text-lg">Découvrez les livres les plus appréciés par notre communauté</p>
          </div>
          <Link
            href="/books"
            className="hidden md:inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all duration-300 group"
          >
            Voir tout
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white border border-cream-200/80">
                <div className="aspect-[3/4] skeleton rounded-xl mb-4" />
                <div className="h-4 skeleton rounded-full w-3/4 mb-3" />
                <div className="h-3 skeleton rounded-full w-1/2 mb-3" />
                <div className="h-4 skeleton rounded-full w-1/3" />
              </div>
            ))
          ) : (
            displayBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))
          )}
        </motion.div>

        <div className="text-center mt-10 md:hidden">
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
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group"
    >
      <div className="card-premium p-4">
        <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-cream-100 to-cream-200">
          {audiobook.coverImage ? (
            <Image
              src={audiobook.coverImage}
              alt={audiobook.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary-50 to-primary-50">
              <FiHeadphones className="w-12 h-12 text-earth-300" />
            </div>
          )}
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button className="w-16 h-16 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center text-primary-600 shadow-lg transform scale-75 group-hover:scale-100 transition-all duration-300">
              <FiPlay className="w-7 h-7 ml-1" />
            </button>
          </div>
          {/* Duration badge */}
          <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-lg font-medium">
            {audiobook.duration || '4h 32min'}
          </span>
        </div>

        <h3 className="font-semibold text-earth-900 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">{audiobook.title}</h3>
        <p className="text-sm text-earth-400 mb-1">{audiobook.author}</p>
        <p className="text-xs text-earth-300 mb-3">Lu par {audiobook.narrator || 'Narrateur'}</p>

        <div className="flex items-center gap-2">
          <span className="badge-primary">🎧 Chapitre 1 gratuit</span>
        </div>
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
        const url = apiUrl ? `${apiUrl}/api/audiobooks?limit=4` : '/api/audiobooks?limit=4'
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setAudiobooks(data.data || data.audiobooks || [])
      } catch (error) {
        console.error('Error fetching audiobooks:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAudiobooks()
  }, [])

  const displayAudiobooks = audiobooks

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary-50/60 via-white to-primary-50/40" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 bg-secondary-50 text-secondary-600 rounded-full text-sm font-semibold mb-4">
              🎧 À écouter
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-earth-900 mb-3">
              Audiobooks à écouter
            </h2>
            <p className="text-earth-500 text-lg">Le premier chapitre est toujours gratuit. Abonnez-vous pour écouter la suite!</p>
          </div>
          <Link
            href="/audiobooks"
            className="hidden md:inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all duration-300 group"
          >
            Voir tout
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white border border-cream-200/80">
                <div className="aspect-square skeleton rounded-xl mb-4" />
                <div className="h-4 skeleton rounded-full w-3/4 mb-3" />
                <div className="h-3 skeleton rounded-full w-1/2" />
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
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block rounded-3xl p-10 relative overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-secondary-600 to-accent-500 opacity-[0.07] rounded-3xl" />
            <div className="absolute inset-[1px] bg-white rounded-3xl" />

            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-earth-900 mb-3">
                Accès illimité à tous les audiobooks
              </h3>
              <p className="text-earth-500 mb-8 text-lg">
                À partir de <span className="text-primary-600 font-bold text-2xl">2 500 XOF</span><span className="text-earth-400">/mois</span>
              </p>
              <Link href="/subscriptions" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4 group">
                Découvrir les abonnements
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Categories Section
function CategoriesSection() {
  const categories = [
    { name: 'Littérature Africaine', icon: '📖', count: 1250, gradient: 'from-orange-400 to-red-500' },
    { name: 'Roman', icon: '📚', count: 2340, gradient: 'from-blue-400 to-indigo-500' },
    { name: 'Business & Entrepreneuriat', icon: '💼', count: 890, gradient: 'from-emerald-400 to-green-600' },
    { name: 'Développement Personnel', icon: '🎯', count: 1100, gradient: 'from-purple-400 to-pink-500' },
    { name: 'Poésie', icon: '✨', count: 560, gradient: 'from-amber-400 to-orange-500' },
    { name: 'Contes & Légendes', icon: '🌍', count: 780, gradient: 'from-teal-400 to-cyan-500' },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="text-center mb-14"
        >
          <motion.div variants={fadeInUp} className="mb-4">
            <span className="inline-block px-4 py-1.5 bg-accent-50 text-accent-700 rounded-full text-sm font-semibold">
              Catégories
            </span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-earth-900 mb-4"
          >
            Explorez par catégorie
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-earth-500 text-lg"
          >
            Trouvez exactement ce que vous cherchez
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link
                href={`/books?category=${encodeURIComponent(category.name)}`}
                className="block p-6 rounded-2xl bg-white border border-cream-200/80 hover:border-transparent hover:shadow-card-hover transition-all duration-300 text-center group relative overflow-hidden"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                  <h3 className="font-semibold text-earth-800 mb-1 text-sm">{category.name}</h3>
                  <p className="text-xs text-earth-400 font-medium">{category.count.toLocaleString()} titres</p>
                </div>
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
    <section className="py-24 bg-earth-900 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block px-4 py-1.5 bg-white/10 text-primary-300 rounded-full text-sm font-semibold mb-6">
              Communauté
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 leading-tight">
              Rejoignez la{' '}
              <span className="text-primary-400">communauté</span>
            </h2>
            <p className="text-earth-300 text-lg mb-10 leading-relaxed">
              Partagez vos lectures favorites, discutez avec d&apos;autres passionnés,
              suivez vos auteurs préférés et découvrez de nouvelles pépites littéraires.
            </p>
            <div className="space-y-5">
              {[
                'Partagez vos critiques et recommandations',
                'Suivez vos auteurs et lecteurs favoris',
                'Participez aux discussions littéraires',
                'Découvrez des livres grâce aux suggestions personnalisées'
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-earth-200">{item}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-10">
              <Link href="/community" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4 group">
                Explorer la communauté
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative"
          >
            {/* Social feed mockup */}
            <div className="bg-white rounded-3xl p-7 text-earth-900 shadow-2xl relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <div>
                  <h4 className="font-bold text-earth-900">Aminata Diallo</h4>
                  <p className="text-sm text-earth-400">Il y a 2 heures</p>
                </div>
              </div>
              <p className="text-earth-600 mb-5 leading-relaxed">
                Je viens de terminer &ldquo;Les Soleils des Indépendances&rdquo; d&apos;Ahmadou Kourouma.
                Un chef-d&apos;œuvre absolu! La façon dont il mélange le français et le malinké
                est fascinante. 📚✨
              </p>
              <div className="flex items-center gap-6 text-earth-400">
                <button className="flex items-center gap-2 hover:text-red-500 transition-colors group">
                  <FiHeart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">124</span>
                </button>
                <button className="flex items-center gap-2 hover:text-primary-500 transition-colors">
                  <span>💬</span>
                  <span className="font-medium">23</span>
                </button>
              </div>
            </div>

            {/* Second card peek */}
            <div className="bg-white/60 rounded-3xl p-5 text-earth-900 shadow-lg relative z-0 -mt-4 mx-6 blur-[1px]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-secondary-100 rounded-full" />
                <div className="h-3 bg-earth-100 rounded-full w-24" />
              </div>
              <div className="h-2.5 bg-earth-100 rounded-full w-full mb-2" />
              <div className="h-2.5 bg-earth-100 rounded-full w-3/4" />
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-accent-400/15 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Sell Section
function SellSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-primary-600 to-orange-600" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 text-center text-white relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-5"
          >
            Vendez vos livres
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-white/85 text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
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
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-cream-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
            >
              Commencer à vendre
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/seller-guide"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Guide du vendeur
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="flex gap-16 justify-center mt-14"
          >
            {[
              { value: '5%', label: 'Commission' },
              { value: '24h', label: 'Délai de paiement' },
              { value: '10K+', label: 'Vendeurs actifs' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                <div className="text-white/70 text-sm mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Testimonials Section with Auto-Rotation
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Fatou Ndoye',
      role: 'Lectrice passionnée',
      location: 'Dakar, Sénégal',
      text: 'Grâce à BookShell, j\'ai découvert des auteurs africains que je ne connaissais pas. La communauté est incroyable!',
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

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary-50/50 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-14"
        >
          <motion.div variants={fadeInUp} className="mb-4">
            <span className="inline-block px-4 py-1.5 bg-accent-50 text-accent-700 rounded-full text-sm font-semibold">
              ⭐ Témoignages
            </span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-earth-900 mb-4"
          >
            Ce que disent nos utilisateurs
          </motion.h2>
        </motion.div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="p-8 rounded-2xl bg-white border border-cream-200/80 hover:shadow-card-hover transition-all duration-500 relative group"
            >
              {/* Quote mark */}
              <div className="absolute top-6 right-6 text-5xl text-primary-100 font-display leading-none select-none">&ldquo;</div>

              <div className="flex items-center gap-1 mb-5">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="w-5 h-5 text-accent-400 fill-accent-400" />
                ))}
              </div>
              <p className="text-earth-600 mb-8 italic leading-relaxed relative z-10">&ldquo;{testimonial.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-600">{testimonial.name[0]}</span>
                </div>
                <div>
                  <h4 className="font-bold text-earth-900">{testimonial.name}</h4>
                  <p className="text-sm text-earth-500">{testimonial.role}</p>
                  <p className="text-xs text-earth-400">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 rounded-2xl bg-white border border-cream-200/80 shadow-card"
            >
              <div className="flex items-center gap-1 mb-5">
                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                  <FiStar key={i} className="w-5 h-5 text-accent-400 fill-accent-400" />
                ))}
              </div>
              <p className="text-earth-600 mb-6 italic leading-relaxed">&ldquo;{testimonials[activeIndex].text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-600">{testimonials[activeIndex].name[0]}</span>
                </div>
                <div>
                  <h4 className="font-bold text-earth-900">{testimonials[activeIndex].name}</h4>
                  <p className="text-sm text-earth-500">{testimonials[activeIndex].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress indicators */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-8 bg-primary-500' : 'w-2 bg-earth-200 hover:bg-earth-300'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// CTA Section
function CTASection() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) return null

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-primary-50/30 to-secondary-50/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-100/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-earth-900 mb-5">
            Prêt à commencer?
          </h2>
          <p className="text-earth-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Créez votre compte gratuitement et rejoignez des milliers de lecteurs africains.
          </p>
          <Link
            href="/register"
            className="btn-primary inline-flex items-center gap-2 text-lg px-10 py-5 animate-glow-pulse group"
          >
            Créer mon compte gratuit
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
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
