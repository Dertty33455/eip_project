'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineMusicNote,
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineBell,
  HiOutlineSearch,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineLogout,
  HiOutlineCog,
  HiOutlineHeart,
  HiOutlineCash,
  HiOutlineViewGrid,
} from 'react-icons/hi'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { useNotifications } from '@/hooks/useApi'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

const navigation = [
  { name: 'Accueil', href: '/', icon: HiOutlineHome },
  { name: 'Livres', href: '/books', icon: HiOutlineBookOpen },
  { name: 'Audio', href: '/audiobooks', icon: HiOutlineMusicNote },
  { name: 'Communauté', href: '/community', icon: HiOutlineViewGrid },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  const { user, logout, isLoading } = useAuth()
  const { itemCount } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" prefetch={true} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className={cn(
              'font-display font-bold text-xl transition-colors',
              isScrolled ? 'text-earth-800' : 'text-earth-800'
            )}>
              Book<span className="text-primary-500">Shell</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch={true}
                  className={cn(
                    'flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-earth-600 hover:bg-cream-100'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 rounded-lg text-earth-600 hover:bg-cream-100 transition-colors"
            >
              <HiOutlineSearch className="w-5 h-5" />
            </button>

            {user ? (
              <>
                {/* Notifications */}
                <NotificationDropdown />

                {/* Cart */}
                <Link
                  href="/cart"
                  prefetch={true}
                  className="hidden sm:flex relative p-2 rounded-lg text-earth-600 hover:bg-cream-100 transition-colors"
                >
                  <HiOutlineShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-cream-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.firstName}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-primary-600 font-medium text-sm">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      )}
                    </div>
                    <span className="hidden lg:block text-sm font-medium text-earth-700">
                      {user.firstName}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-cream-200 overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-cream-100">
                          <p className="font-medium text-earth-800">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-earth-500">@{user.username}</p>
                        </div>
                        <div className="py-2">
                          <Link
                            href={user ? `/profile/${user.username}` : '/login'}
                            className="flex items-center space-x-3 px-4 py-2 text-earth-600 hover:bg-cream-50"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <HiOutlineUser className="w-5 h-5" />
                            <span>Mon Profil</span>
                          </Link>
                          <Link
                            href="/wallet"
                            className="flex items-center space-x-3 px-4 py-2 text-earth-600 hover:bg-cream-50"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <HiOutlineCash className="w-5 h-5" />
                            <span>Mon Portefeuille</span>
                          </Link>
                          <Link
                            href="/favorites"
                            className="flex items-center space-x-3 px-4 py-2 text-earth-600 hover:bg-cream-50"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <HiOutlineHeart className="w-5 h-5" />
                            <span>Mes Favoris</span>
                          </Link>
                          <Link
                            href="/settings"
                            className="flex items-center space-x-3 px-4 py-2 text-earth-600 hover:bg-cream-50"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <HiOutlineCog className="w-5 h-5" />
                            <span>Paramètres</span>
                          </Link>
                          {user.role === 'ADMIN' && (
                            <Link
                              href="/admin"
                              className="flex items-center space-x-3 px-4 py-2 text-primary-600 hover:bg-cream-50"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <HiOutlineViewGrid className="w-5 h-5" />
                              <span>Administration</span>
                            </Link>
                          )}
                        </div>
                        <div className="border-t border-cream-100 py-2">
                          <button
                            onClick={() => {
                              logout()
                              setShowUserMenu(false)
                            }}
                            className="flex items-center space-x-3 px-4 py-2 w-full text-red-600 hover:bg-red-50"
                          >
                            <HiOutlineLogout className="w-5 h-5" />
                            <span>Déconnexion</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="hidden sm:block px-4 py-2 text-sm font-medium text-earth-700 hover:text-primary-600 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors shadow-african"
                >
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-earth-600 hover:bg-cream-100 transition-colors"
            >
              {isOpen ? (
                <HiOutlineX className="w-6 h-6" />
              ) : (
                <HiOutlineMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-cream-200"
          >
            <nav className="px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all',
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-earth-600 hover:bg-cream-100'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              {user && (
                <>
                  <Link
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium text-earth-600 hover:bg-cream-100"
                  >
                    <div className="flex items-center space-x-3">
                      <HiOutlineShoppingCart className="w-5 h-5" />
                      <span>Panier</span>
                    </div>
                    {itemCount > 0 && (
                      <span className="bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/sell"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-primary-600 hover:bg-primary-50"
                  >
                    <HiOutlineBookOpen className="w-5 h-5" />
                    <span>Vendre un livre</span>
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Rechercher des livres, auteurs, utilisateurs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full px-6 py-4 text-lg rounded-2xl bg-white shadow-xl border-0 focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-primary-500 text-white rounded-xl"
                >
                  <HiOutlineSearch className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { data, isLoading, getNotifications, markAsRead } = useNotifications()
  const [notifications, setNotifications] = useState<any[]>([])
  const unreadCount = notifications.filter(n => !n.is_read).length

  useEffect(() => {
    loadNotifications()
    // Poll every 60 seconds
    const interval = setInterval(loadNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (data?.data) {
      setNotifications(data.data)
    }
  }, [data])

  const loadNotifications = async () => {
    await getNotifications()
  }

  const handleMarkAsRead = async (id: string) => {
    await markAsRead([id])
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-earth-600 hover:bg-cream-100 transition-colors"
      >
        <HiOutlineBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-cream-200 overflow-hidden z-50"
            >
              <div className="p-4 border-b border-cream-100 flex items-center justify-between">
                <h3 className="font-bold text-earth-900">Notifications</h3>
                <Link href="/notifications" className="text-xs text-primary-600 hover:underline" onClick={() => setIsOpen(false)}>
                  Voir tout
                </Link>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {isLoading && notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs text-earth-500">Chargement...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <HiOutlineBell className="w-8 h-8 text-earth-200 mx-auto mb-2" />
                    <p className="text-sm text-earth-500">Aucune notification</p>
                  </div>
                ) : (
                  <div className="divide-y divide-cream-50">
                    {notifications.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "p-4 hover:bg-cream-50 transition-colors cursor-pointer relative",
                          !n.is_read && "bg-primary-50/20"
                        )}
                        onClick={() => {
                          if (!n.is_read) handleMarkAsRead(n.id)
                          if (n.link) window.location.href = n.link
                        }}
                      >
                        {!n.is_read && <div className="absolute top-4 right-4 w-2 h-2 bg-primary-500 rounded-full" />}
                        <h4 className="text-sm font-bold text-earth-900 pr-4">{n.title}</h4>
                        <p className="text-xs text-earth-600 mt-1 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-earth-400 mt-2">
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: fr })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {notifications.length > 5 && (
                <Link
                  href="/notifications"
                  className="block p-3 text-center text-sm font-medium text-earth-600 hover:bg-cream-50 border-t border-cream-100"
                  onClick={() => setIsOpen(false)}
                >
                  Voir les {notifications.length - 5} autres
                </Link>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
