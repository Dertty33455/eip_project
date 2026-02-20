'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FiCheck, 
  FiStar, 
  FiHeadphones, 
  FiDownload, 
  FiSmartphone,
  FiArrowRight
} from 'react-icons/fi'
import { useAuth } from '@/hooks/useAuth'
import { useSubscriptions } from '@/hooks/useApi'
import toast from 'react-hot-toast'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const plans = [
  {
    id: 'MONTHLY',
    name: 'Mensuel',
    price: 2500,
    period: '/mois',
    description: 'Idéal pour essayer',
    features: [
      'Accès illimité aux audiobooks',
      'Téléchargement hors-ligne',
      'Qualité audio HD',
      'Support client prioritaire',
    ],
    popular: false,
  },
  {
    id: 'QUARTERLY',
    name: 'Trimestriel',
    price: 6000,
    period: '/3 mois',
    description: 'Économisez 20%',
    originalPrice: 7500,
    features: [
      'Accès illimité aux audiobooks',
      'Téléchargement hors-ligne',
      'Qualité audio HD',
      'Support client prioritaire',
      '2 mois offerts par an',
    ],
    popular: true,
  },
  {
    id: 'YEARLY',
    name: 'Annuel',
    price: 20000,
    period: '/an',
    description: 'Meilleure offre',
    originalPrice: 30000,
    features: [
      'Accès illimité aux audiobooks',
      'Téléchargement hors-ligne',
      'Qualité audio HD',
      'Support client VIP',
      '4 mois offerts',
      'Contenu exclusif',
    ],
    popular: false,
  },
]

// Plan Card Component
function PlanCard({ 
  plan, 
  isSelected, 
  onSelect,
  currentPlan 
}: { 
  plan: typeof plans[0]
  isSelected: boolean
  onSelect: () => void
  currentPlan?: string
}) {
  const isCurrentPlan = currentPlan === plan.id
  
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -5 }}
      onClick={onSelect}
      className={`relative card cursor-pointer transition-all ${
        isSelected 
          ? 'ring-2 ring-primary shadow-lg' 
          : 'hover:shadow-lg'
      } ${plan.popular ? 'border-primary' : ''}`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
            <FiStar className="w-3 h-3" />
            Plus populaire
          </span>
        </div>
      )}
      
      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <span className="bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full">
            Votre abonnement
          </span>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{plan.name}</h3>
        <p className="text-sm text-gray-500">{plan.description}</p>
      </div>
      
      <div className="text-center mb-6">
        {plan.originalPrice && (
          <p className="text-sm text-gray-400 line-through">
            {plan.originalPrice.toLocaleString()} XOF
          </p>
        )}
        <div className="flex items-end justify-center gap-1">
          <span className="text-4xl font-bold text-gray-900">
            {plan.price.toLocaleString()}
          </span>
          <span className="text-gray-500 mb-1"> XOF{plan.period}</span>
        </div>
      </div>
      
      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600 text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      {/* Selection Indicator */}
      <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
        isSelected 
          ? 'bg-primary border-primary' 
          : 'border-gray-300'
      }`}>
        {isSelected && <FiCheck className="w-4 h-4 text-white" />}
      </div>
    </motion.div>
  )
}

// Payment Modal
function PaymentModal({ 
  isOpen, 
  onClose, 
  plan,
  onSubmit,
  isLoading
}: { 
  isOpen: boolean
  onClose: () => void
  plan: typeof plans[0] | null
  onSubmit: (data: { provider: string; phoneNumber: string }) => void
  isLoading: boolean
}) {
  const [provider, setProvider] = useState<'MTN_MOMO' | 'MOOV_MONEY' | 'WALLET'>('MTN_MOMO')
  const [phoneNumber, setPhoneNumber] = useState('')
  const { wallet } = useAuth()
  
  if (!isOpen || !plan) return null
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (provider !== 'WALLET' && !phoneNumber) {
      toast.error('Veuillez entrer votre numéro de téléphone')
      return
    }
    
    onSubmit({ provider, phoneNumber })
  }
  
  const canUseWallet = (wallet?.balance || 0) >= plan.price
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-display font-bold text-gray-900 mb-2">
          Confirmer l'abonnement
        </h2>
        <p className="text-gray-600 mb-6">
          {plan.name} - {plan.price.toLocaleString()} XOF{plan.period}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Méthode de paiement
            </label>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setProvider('MTN_MOMO')}
                className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 transition-colors ${
                  provider === 'MTN_MOMO'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-black">
                  MTN
                </div>
                <span className="font-medium">MTN Mobile Money</span>
              </button>
              
              <button
                type="button"
                onClick={() => setProvider('MOOV_MONEY')}
                className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 transition-colors ${
                  provider === 'MOOV_MONEY'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white">
                  M
                </div>
                <span className="font-medium">Moov Money</span>
              </button>
              
              <button
                type="button"
                onClick={() => canUseWallet && setProvider('WALLET')}
                disabled={!canUseWallet}
                className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 transition-colors ${
                  provider === 'WALLET'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                } ${!canUseWallet ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">W</span>
                </div>
                <div className="text-left">
                  <span className="font-medium block">Portefeuille BookShell</span>
                  <span className="text-sm text-gray-500">
                    Solde: {(wallet?.balance || 0).toLocaleString()} XOF
                    {!canUseWallet && ' (insuffisant)'}
                  </span>
                </div>
              </button>
            </div>
          </div>
          
          {/* Phone Number */}
          {provider !== 'WALLET' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+225 07 XX XX XX XX"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          )}
          
          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary py-3 disabled:opacity-50"
            >
              {isLoading ? 'Traitement...' : 'Confirmer'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function SubscriptionsPage() {
  const { isAuthenticated, subscription } = useAuth()
  const { subscribe, isLoading } = useSubscriptions()
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(plans[1])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  
  const handleSubscribe = async (data: { provider: string; phoneNumber: string }) => {
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour vous abonner')
      return
    }
    
    if (!selectedPlan) return
    
    const { error } = await subscribe({
      plan: selectedPlan.id as any,
      provider: data.provider as any,
      phoneNumber: data.phoneNumber,
    })
    
    if (!error) {
      setShowPaymentModal(false)
      toast.success('Abonnement initié! Vérifiez votre téléphone.')
    }
  }
  
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-orange-600 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-display font-bold mb-4"
          >
            Accès illimité aux audiobooks
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/90 text-lg max-w-2xl mx-auto"
          >
            Écoutez tous nos audiobooks en illimité. Téléchargez-les pour les écouter hors-ligne. 
            Annulez à tout moment.
          </motion.p>
        </div>
      </div>
      
      {/* Features */}
      <div className="container mx-auto px-4 -mt-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { icon: FiHeadphones, text: 'Audiobooks illimités' },
            { icon: FiDownload, text: 'Téléchargement hors-ligne' },
            { icon: FiSmartphone, text: 'Tous vos appareils' },
            { icon: FiStar, text: 'Contenu exclusif' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white rounded-xl p-4 shadow-sm text-center"
            >
              <feature.icon className="w-8 h-8 text-primary mx-auto mb-2" />
              <span className="text-sm text-gray-600">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Current Subscription Status */}
      {subscription?.status === 'ACTIVE' && (
        <div className="container mx-auto px-4 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FiCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Abonnement actif</h3>
                <p className="text-green-600">
                  Votre abonnement {subscription.plan} est actif jusqu'au{' '}
                  {new Date(subscription.endDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Plans */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan?.id === plan.id}
              onSelect={() => setSelectedPlan(plan)}
              currentPlan={subscription?.plan}
            />
          ))}
        </motion.div>
        
        {/* Subscribe Button */}
        <div className="text-center mt-12">
          {isAuthenticated ? (
            <button
              onClick={() => setShowPaymentModal(true)}
              disabled={!selectedPlan || subscription?.status === 'ACTIVE'}
              className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4 disabled:opacity-50"
            >
              {subscription?.status === 'ACTIVE' 
                ? 'Abonnement actif' 
                : `S'abonner - ${selectedPlan?.price.toLocaleString()} XOF${selectedPlan?.period}`
              }
              <FiArrowRight />
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">Connectez-vous pour vous abonner</p>
              <div className="flex gap-4 justify-center">
                <Link href="/register" className="btn-primary">Créer un compte</Link>
                <Link href="/login" className="btn-secondary">Se connecter</Link>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* FAQ */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-display font-bold text-center text-gray-900 mb-8">
          Questions fréquentes
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              q: 'Puis-je annuler à tout moment?',
              a: 'Oui, vous pouvez annuler votre abonnement à tout moment. Vous continuerez à avoir accès jusqu\'à la fin de votre période de facturation.'
            },
            {
              q: 'Puis-je télécharger les audiobooks?',
              a: 'Oui, avec un abonnement actif, vous pouvez télécharger n\'importe quel audiobook pour l\'écouter hors-ligne.'
            },
            {
              q: 'Comment fonctionne le chapitre gratuit?',
              a: 'Le premier chapitre de chaque audiobook est toujours gratuit, même sans abonnement. C\'est une façon de découvrir le contenu avant de s\'abonner.'
            },
            {
              q: 'Quels moyens de paiement acceptez-vous?',
              a: 'Nous acceptons MTN Mobile Money, Moov Money, et le paiement via votre portefeuille BookShell.'
            },
          ].map((faq, index) => (
            <details key={index} className="card group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                {faq.q}
                <span className="text-primary group-open:rotate-180 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        plan={selectedPlan}
        onSubmit={handleSubscribe}
        isLoading={isLoading}
      />
    </main>
  )
}
