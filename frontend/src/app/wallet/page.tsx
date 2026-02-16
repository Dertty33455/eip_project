'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FiPlus, 
  FiMinus, 
  FiCreditCard, 
  FiArrowUpRight, 
  FiArrowDownLeft,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiRefreshCw
} from 'react-icons/fi'
import { useAuth } from '@/hooks/useAuth'
import { useWallet } from '@/hooks/useApi'
import toast from 'react-hot-toast'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

// Transaction Item Component
function TransactionItem({ transaction }: { transaction: any }) {
  const isCredit = ['DEPOSIT', 'SALE', 'REFUND'].includes(transaction.type)
  
  const typeLabels: Record<string, string> = {
    DEPOSIT: 'Dépôt',
    WITHDRAWAL: 'Retrait',
    PURCHASE: 'Achat',
    SALE: 'Vente',
    SUBSCRIPTION: 'Abonnement',
    REFUND: 'Remboursement',
    COMMISSION: 'Commission',
  }
  
  const statusIcons: Record<string, any> = {
    COMPLETED: { icon: FiCheckCircle, color: 'text-green-500' },
    PENDING: { icon: FiClock, color: 'text-yellow-500' },
    FAILED: { icon: FiXCircle, color: 'text-red-500' },
  }
  
  const StatusIcon = statusIcons[transaction.status]?.icon || FiAlertCircle
  const statusColor = statusIcons[transaction.status]?.color || 'text-gray-500'
  
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isCredit ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {isCredit ? (
            <FiArrowDownLeft className="w-6 h-6 text-green-600" />
          ) : (
            <FiArrowUpRight className="w-6 h-6 text-red-600" />
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900">
            {typeLabels[transaction.type] || transaction.type}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(transaction.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
      
      <div className="text-right">
        <p className={`font-semibold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
          {isCredit ? '+' : '-'}{transaction.amount?.toLocaleString()} XOF
        </p>
        <div className={`flex items-center gap-1 text-sm ${statusColor}`}>
          <StatusIcon className="w-4 h-4" />
          <span>{transaction.status === 'COMPLETED' ? 'Terminé' : transaction.status === 'PENDING' ? 'En cours' : 'Échoué'}</span>
        </div>
      </div>
    </div>
  )
}

// Deposit Modal
function DepositModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { deposit, isLoading } = useWallet()
  const { refreshWallet } = useAuth()
  
  const [amount, setAmount] = useState('')
  const [provider, setProvider] = useState<'MTN_MOMO' | 'MOOV_MONEY'>('MTN_MOMO')
  const [phoneNumber, setPhoneNumber] = useState('')
  
  const quickAmounts = [1000, 2500, 5000, 10000, 25000, 50000]
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount || !phoneNumber) {
      toast.error('Veuillez remplir tous les champs')
      return
    }
    
    const { error } = await deposit({
      amount: Number(amount),
      provider,
      phoneNumber,
    })
    
    if (!error) {
      refreshWallet()
      onClose()
      setAmount('')
      setPhoneNumber('')
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-display font-bold text-gray-900 mb-6">
          Déposer de l'argent
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant (XOF)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ex: 5000"
              min="100"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
            />
            
            {/* Quick Amounts */}
            <div className="flex flex-wrap gap-2 mt-3">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(String(amt))}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    amount === String(amt)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
          
          {/* Provider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Méthode de paiement
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setProvider('MTN_MOMO')}
                className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-colors ${
                  provider === 'MTN_MOMO'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-black">
                  MTN
                </div>
                <span className="font-medium">MTN MoMo</span>
              </button>
              
              <button
                type="button"
                onClick={() => setProvider('MOOV_MONEY')}
                className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-colors ${
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
            </div>
          </div>
          
          {/* Phone Number */}
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
              disabled={isLoading || !amount || !phoneNumber}
              className="flex-1 btn-primary py-3 disabled:opacity-50"
            >
              {isLoading ? 'Traitement...' : 'Déposer'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// Withdraw Modal
function WithdrawModal({ isOpen, onClose, balance }: { isOpen: boolean; onClose: () => void; balance: number }) {
  const { withdraw, isLoading } = useWallet()
  const { refreshWallet } = useAuth()
  
  const [amount, setAmount] = useState('')
  const [provider, setProvider] = useState<'MTN_MOMO' | 'MOOV_MONEY'>('MTN_MOMO')
  const [phoneNumber, setPhoneNumber] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount || !phoneNumber) {
      toast.error('Veuillez remplir tous les champs')
      return
    }
    
    if (Number(amount) > balance) {
      toast.error('Solde insuffisant')
      return
    }
    
    const { error } = await withdraw({
      amount: Number(amount),
      provider,
      phoneNumber,
    })
    
    if (!error) {
      refreshWallet()
      onClose()
      setAmount('')
      setPhoneNumber('')
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-display font-bold text-gray-900 mb-6">
          Retirer de l'argent
        </h2>
        
        <div className="bg-gray-100 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-500">Solde disponible</p>
          <p className="text-2xl font-bold text-gray-900">{balance?.toLocaleString()} XOF</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant à retirer (XOF)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ex: 5000"
              min="100"
              max={balance}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setAmount(String(balance))}
              className="text-sm text-primary mt-2 hover:underline"
            >
              Retirer tout
            </button>
          </div>
          
          {/* Provider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recevoir sur
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setProvider('MTN_MOMO')}
                className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-colors ${
                  provider === 'MTN_MOMO'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-black">
                  MTN
                </div>
                <span className="font-medium">MTN MoMo</span>
              </button>
              
              <button
                type="button"
                onClick={() => setProvider('MOOV_MONEY')}
                className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-colors ${
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
            </div>
          </div>
          
          {/* Phone Number */}
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
              disabled={isLoading || !amount || !phoneNumber || Number(amount) > balance}
              className="flex-1 btn-primary py-3 disabled:opacity-50"
            >
              {isLoading ? 'Traitement...' : 'Retirer'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function WalletPage() {
  const { user, wallet, refreshWallet, isLoading: authLoading } = useAuth()
  const { getWallet, isLoading } = useWallet()
  const [transactions, setTransactions] = useState<any[]>([])
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  
  useEffect(() => {
    fetchWalletData()
  }, [])
  
  const fetchWalletData = async () => {
    const { data } = await getWallet()
    if (data?.transactions) {
      setTransactions(data.transactions)
    }
  }
  
  const handleRefresh = () => {
    refreshWallet()
    fetchWalletData()
  }
  
  // Demo transactions
  const demoTransactions = [
    { id: '1', type: 'DEPOSIT', amount: 10000, status: 'COMPLETED', createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: '2', type: 'PURCHASE', amount: 8500, status: 'COMPLETED', createdAt: new Date(Date.now() - 24 * 3600000).toISOString() },
    { id: '3', type: 'SALE', amount: 6500, status: 'COMPLETED', createdAt: new Date(Date.now() - 48 * 3600000).toISOString() },
    { id: '4', type: 'WITHDRAWAL', amount: 5000, status: 'PENDING', createdAt: new Date(Date.now() - 72 * 3600000).toISOString() },
    { id: '5', type: 'SUBSCRIPTION', amount: 2500, status: 'COMPLETED', createdAt: new Date(Date.now() - 96 * 3600000).toISOString() },
  ]
  
  const displayTransactions = transactions.length > 0 ? transactions : demoTransactions
  
  if (authLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </main>
    )
  }
  
  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connectez-vous</h2>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à votre portefeuille</p>
          <Link href="/login" className="btn-primary">Se connecter</Link>
        </div>
      </main>
    )
  }
  
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-orange-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-display font-bold">Mon portefeuille</h1>
            <button 
              onClick={handleRefresh}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <FiRefreshCw className="w-5 h-5" />
            </button>
          </div>
          
          {/* Balance Card */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
          >
            <p className="text-white/80 mb-1">Solde disponible</p>
            <p className="text-4xl font-bold mb-6">
              {(wallet?.balance || 0).toLocaleString()} <span className="text-xl">XOF</span>
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowDepositModal(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                <FiPlus className="w-5 h-5" />
                <span>Déposer</span>
              </button>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors"
              >
                <FiMinus className="w-5 h-5" />
                <span>Retirer</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Transactions */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Transactions récentes</h2>
                <Link href="/wallet/history" className="text-primary text-sm hover:underline">
                  Voir tout
                </Link>
              </div>
              
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                      <div className="w-12 h-12 rounded-full bg-gray-200" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-20" />
                    </div>
                  ))}
                </div>
              ) : displayTransactions.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {displayTransactions.map((transaction) => (
                    <TransactionItem key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiCreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune transaction pour le moment</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <Link 
                  href="/subscriptions"
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <FiCreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Abonnement</p>
                    <p className="text-sm text-gray-500">Gérer mon abonnement</p>
                  </div>
                </Link>
                
                <Link 
                  href="/sell"
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FiDollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Vendre un livre</p>
                    <p className="text-sm text-gray-500">Commission de 5%</p>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Info Card */}
            <div className="card bg-primary/5 border-primary/10">
              <h3 className="font-semibold text-gray-900 mb-2">Paiements sécurisés</h3>
              <p className="text-sm text-gray-600 mb-4">
                Vos transactions sont sécurisées avec MTN Mobile Money et Moov Money.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-black text-xs">
                  MTN
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white text-xs">
                  M
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <DepositModal 
        isOpen={showDepositModal} 
        onClose={() => setShowDepositModal(false)} 
      />
      <WithdrawModal 
        isOpen={showWithdrawModal} 
        onClose={() => setShowWithdrawModal(false)}
        balance={wallet?.balance || 0}
      />
    </main>
  )
}
