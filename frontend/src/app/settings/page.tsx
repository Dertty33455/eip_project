'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiArrowLeft, 
  FiUser, 
  FiLock, 
  FiBell, 
  FiCreditCard,
  FiShield,
  FiGlobe,
  FiMoon,
  FiSun,
  FiCamera,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit3,
  FiSave,
  FiX,
  FiCheck,
  FiAlertTriangle,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiSmartphone,
  FiLogOut,
  FiHelpCircle,
  FiChevronRight
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

type SettingsSection = 'profile' | 'security' | 'notifications' | 'payment' | 'privacy' | 'preferences'

export default function SettingsPage() {
  const router = useRouter()
  const { user, logout, updateProfile } = useAuth()
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')
  const [loading, setLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  // Profile form
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    bio: '',
    city: '',
    country: ''
  })

  // Security form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  // Notification preferences
  const [notifications, setNotifications] = useState({
    email: {
      orders: true,
      promotions: true,
      newFollowers: true,
      newMessages: true,
      weeklyDigest: false
    },
    push: {
      orders: true,
      promotions: false,
      newFollowers: true,
      newMessages: true
    },
    sms: {
      orders: true,
      promotions: false
    }
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showEmail: false,
    showPhone: false,
    showLocation: true,
    showListeningHistory: true,
    allowTagging: true
  })

  // Preferences
  const [preferences, setPreferences] = useState({
    language: 'fr',
    theme: 'light',
    currency: 'XOF',
    autoplay: true,
    downloadQuality: 'high'
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    // Populate form with user data
    setProfileForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || '',
      city: user.city || '',
      country: user.country || ''
    })
  }, [user])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      })

      if (res.ok) {
        const data = await res.json()
        updateProfile(data.user)
        toast.success('Profil mis à jour avec succès')
      } else {
        const error = await res.json()
        toast.error(error.message || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères')
      return
    }

    setLoading(true)
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/me/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      })

      if (res.ok) {
        toast.success('Mot de passe modifié avec succès')
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        const error = await res.json()
        toast.error(error.message || 'Erreur lors de la modification')
      }
    } catch (error) {
      toast.error('Erreur lors de la modification')
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationSave = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/me/notifications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifications)
      })

      if (res.ok) {
        toast.success('Préférences de notification mises à jour')
      } else {
        toast.error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  const handlePrivacySave = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/me/privacy`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(privacy)
      })

      if (res.ok) {
        toast.success('Paramètres de confidentialité mis à jour')
      } else {
        toast.error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/me`, { method: 'DELETE' })
      
      if (res.ok) {
        toast.success('Compte supprimé')
        logout()
        router.push('/')
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    } finally {
      setLoading(false)
      setShowDeleteModal(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
    toast.success('Déconnexion réussie')
  }

  const sections = [
    { id: 'profile', label: 'Profil', icon: FiUser },
    { id: 'security', label: 'Sécurité', icon: FiLock },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'payment', label: 'Paiement', icon: FiCreditCard },
    { id: 'privacy', label: 'Confidentialité', icon: FiShield },
    { id: 'preferences', label: 'Préférences', icon: FiGlobe }
  ]

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Paramètres</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as SettingsSection)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary/10 text-primary border-r-4 border-primary'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  {section.label}
                </button>
              ))}
              <div className="border-t">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut className="w-5 h-5" />
                  Déconnexion
                </button>
              </div>
            </nav>

            {/* Help Card */}
            <div className="mt-6 bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white">
              <FiHelpCircle className="w-8 h-8 mb-3" />
              <h3 className="font-semibold mb-2">Besoin d'aide ?</h3>
              <p className="text-white/80 text-sm mb-4">
                Notre équipe est disponible pour vous aider.
              </p>
              <Link
                href="/help"
                className="inline-block px-4 py-2 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors"
              >
                Centre d'aide
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {/* Profile Section */}
              {activeSection === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Informations du profil</h2>
                    <p className="text-sm text-gray-500">Mettez à jour vos informations personnelles</p>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
                          {profileForm.firstName[0]}{profileForm.lastName[0]}
                        </div>
                        <button 
                          type="button"
                          className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <FiCamera className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{profileForm.firstName} {profileForm.lastName}</h3>
                        <p className="text-sm text-gray-500">@{profileForm.username}</p>
                        <button 
                          type="button"
                          className="mt-2 text-sm text-primary hover:underline"
                        >
                          Changer la photo
                        </button>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                        <input
                          type="text"
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                        <input
                          type="text"
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                        <input
                          type="text"
                          value={profileForm.username}
                          onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <div className="relative">
                          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                        <div className="relative">
                          <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                        placeholder="Parlez-nous de vous..."
                      />
                    </div>

                    {/* Location */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                        <input
                          type="text"
                          value={profileForm.city}
                          onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                        <select
                          value={profileForm.country}
                          onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        >
                          <option value="">Sélectionner un pays</option>
                          <option value="Sénégal">Sénégal</option>
                          <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                          <option value="Mali">Mali</option>
                          <option value="Burkina Faso">Burkina Faso</option>
                          <option value="Niger">Niger</option>
                          <option value="Guinée">Guinée</option>
                          <option value="Bénin">Bénin</option>
                          <option value="Togo">Togo</option>
                          <option value="Cameroun">Cameroun</option>
                          <option value="Gabon">Gabon</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FiSave className="w-5 h-5" />
                        )}
                        Enregistrer
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Password Change */}
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b">
                      <h2 className="text-lg font-semibold text-gray-800">Changer le mot de passe</h2>
                      <p className="text-sm text-gray-500">Assurez-vous d'utiliser un mot de passe fort</p>
                    </div>

                    <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                        <div className="relative">
                          <input
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.current ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.new ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.confirm ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                          Modifier le mot de passe
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Two-Factor */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <FiSmartphone className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Authentification à deux facteurs</h3>
                          <p className="text-sm text-gray-500">Ajoutez une couche de sécurité supplémentaire</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                        Activer
                      </button>
                    </div>
                  </div>

                  {/* Sessions */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Sessions actives</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <FiSmartphone className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">Chrome sur Windows</p>
                            <p className="text-sm text-gray-500">Dakar, Sénégal • Actuellement actif</p>
                          </div>
                        </div>
                        <span className="text-xs text-green-600 font-medium">Cet appareil</span>
                      </div>
                    </div>
                    <button className="mt-4 text-red-600 hover:underline text-sm">
                      Déconnecter toutes les autres sessions
                    </button>
                  </div>

                  {/* Delete Account */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-100">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FiAlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-red-800">Supprimer le compte</h3>
                        <p className="text-sm text-gray-500 mt-1 mb-4">
                          Cette action est irréversible. Toutes vos données seront supprimées définitivement.
                        </p>
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          Supprimer mon compte
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Préférences de notification</h2>
                    <p className="text-sm text-gray-500">Choisissez comment vous voulez être notifié</p>
                  </div>

                  <div className="p-6 space-y-8">
                    {/* Email Notifications */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiMail className="w-5 h-5 text-primary" />
                        Notifications par email
                      </h3>
                      <div className="space-y-3">
                        {[
                          { key: 'orders', label: 'Mises à jour des commandes' },
                          { key: 'promotions', label: 'Promotions et offres' },
                          { key: 'newFollowers', label: 'Nouveaux abonnés' },
                          { key: 'newMessages', label: 'Nouveaux messages' },
                          { key: 'weeklyDigest', label: 'Résumé hebdomadaire' }
                        ].map((item) => (
                          <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                            <span className="text-gray-700">{item.label}</span>
                            <input
                              type="checkbox"
                              checked={notifications.email[item.key as keyof typeof notifications.email]}
                              onChange={(e) => setNotifications({
                                ...notifications,
                                email: { ...notifications.email, [item.key]: e.target.checked }
                              })}
                              className="w-5 h-5 text-primary rounded focus:ring-primary"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Push Notifications */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiBell className="w-5 h-5 text-primary" />
                        Notifications push
                      </h3>
                      <div className="space-y-3">
                        {[
                          { key: 'orders', label: 'Mises à jour des commandes' },
                          { key: 'promotions', label: 'Promotions et offres' },
                          { key: 'newFollowers', label: 'Nouveaux abonnés' },
                          { key: 'newMessages', label: 'Nouveaux messages' }
                        ].map((item) => (
                          <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                            <span className="text-gray-700">{item.label}</span>
                            <input
                              type="checkbox"
                              checked={notifications.push[item.key as keyof typeof notifications.push]}
                              onChange={(e) => setNotifications({
                                ...notifications,
                                push: { ...notifications.push, [item.key]: e.target.checked }
                              })}
                              className="w-5 h-5 text-primary rounded focus:ring-primary"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* SMS Notifications */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiPhone className="w-5 h-5 text-primary" />
                        Notifications SMS
                      </h3>
                      <div className="space-y-3">
                        {[
                          { key: 'orders', label: 'Mises à jour des commandes' },
                          { key: 'promotions', label: 'Promotions et offres' }
                        ].map((item) => (
                          <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                            <span className="text-gray-700">{item.label}</span>
                            <input
                              type="checkbox"
                              checked={notifications.sms[item.key as keyof typeof notifications.sms]}
                              onChange={(e) => setNotifications({
                                ...notifications,
                                sms: { ...notifications.sms, [item.key]: e.target.checked }
                              })}
                              className="w-5 h-5 text-primary rounded focus:ring-primary"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={handleNotificationSave}
                        disabled={loading}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Payment Section */}
              {activeSection === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b">
                      <h2 className="text-lg font-semibold text-gray-800">Moyens de paiement</h2>
                      <p className="text-sm text-gray-500">Gérez vos méthodes de paiement</p>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* MTN Mobile Money */}
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center font-bold text-black">
                            MTN
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">MTN Mobile Money</p>
                            <p className="text-sm text-gray-500">+221 77 *** ** 67</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                          Par défaut
                        </span>
                      </div>

                      {/* Add new method */}
                      <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                        <FiCreditCard className="w-5 h-5" />
                        Ajouter un moyen de paiement
                      </button>
                    </div>
                  </div>

                  {/* Wallet Link */}
                  <Link
                    href="/wallet"
                    className="block bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <FiCreditCard className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Mon portefeuille</h3>
                          <p className="text-sm text-gray-500">Gérer votre solde et vos transactions</p>
                        </div>
                      </div>
                      <FiChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Privacy Section */}
              {activeSection === 'privacy' && (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Confidentialité</h2>
                    <p className="text-sm text-gray-500">Contrôlez qui peut voir vos informations</p>
                  </div>

                  <div className="p-6 space-y-4">
                    {[
                      { key: 'profilePublic', label: 'Profil public', description: 'Tout le monde peut voir votre profil' },
                      { key: 'showEmail', label: 'Afficher l\'email', description: 'Montrer votre email sur votre profil' },
                      { key: 'showPhone', label: 'Afficher le téléphone', description: 'Montrer votre numéro sur votre profil' },
                      { key: 'showLocation', label: 'Afficher la localisation', description: 'Montrer votre ville sur votre profil' },
                      { key: 'showListeningHistory', label: 'Historique d\'écoute', description: 'Partager vos audiobooks écoutés' },
                      { key: 'allowTagging', label: 'Autoriser les mentions', description: 'Permettre aux autres de vous mentionner' }
                    ].map((item) => (
                      <label 
                        key={item.key} 
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacy[item.key as keyof typeof privacy]}
                          onChange={(e) => setPrivacy({ ...privacy, [item.key]: e.target.checked })}
                          className="w-5 h-5 text-primary rounded focus:ring-primary"
                        />
                      </label>
                    ))}

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={handlePrivacySave}
                        disabled={loading}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Preferences Section */}
              {activeSection === 'preferences' && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Préférences</h2>
                    <p className="text-sm text-gray-500">Personnalisez votre expérience</p>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Language */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
                      <select
                        value={preferences.language}
                        onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    {/* Theme */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Thème</label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: 'light', label: 'Clair', icon: FiSun },
                          { value: 'dark', label: 'Sombre', icon: FiMoon },
                          { value: 'system', label: 'Système', icon: FiSmartphone }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setPreferences({ ...preferences, theme: option.value })}
                            className={`p-4 border-2 rounded-xl text-center transition-colors ${
                              preferences.theme === option.value
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <option.icon className="w-6 h-6 mx-auto mb-2" />
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Currency */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Devise</label>
                      <select
                        value={preferences.currency}
                        onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      >
                        <option value="XOF">FCFA (XOF)</option>
                        <option value="EUR">Euro (EUR)</option>
                        <option value="USD">Dollar (USD)</option>
                      </select>
                    </div>

                    {/* Audio Preferences */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4">Audio</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer">
                          <div>
                            <p className="font-medium text-gray-800">Lecture automatique</p>
                            <p className="text-sm text-gray-500">Passer automatiquement au chapitre suivant</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.autoplay}
                            onChange={(e) => setPreferences({ ...preferences, autoplay: e.target.checked })}
                            className="w-5 h-5 text-primary rounded focus:ring-primary"
                          />
                        </label>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Qualité de téléchargement
                          </label>
                          <select
                            value={preferences.downloadQuality}
                            onChange={(e) => setPreferences({ ...preferences, downloadQuality: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                          >
                            <option value="low">Basse (économise les données)</option>
                            <option value="medium">Moyenne</option>
                            <option value="high">Haute (meilleure qualité)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        disabled={loading}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiAlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Supprimer le compte ?</h3>
                <p className="text-gray-500 mb-6">
                  Cette action est irréversible. Toutes vos données, livres, achats et abonnements seront définitivement supprimés.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
