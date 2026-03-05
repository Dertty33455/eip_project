'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    FiArrowLeft,
    FiChevronRight,
    FiShield,
    FiInfo
} from 'react-icons/fi'
import { useAuth } from '@/hooks/useAuth'
import { useWallet } from '@/hooks/useApi'
import toast from 'react-hot-toast'
import Link from 'next/link'

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

export default function DepositPage() {
    const router = useRouter()
    const { user, refreshWallet } = useAuth()
    const { deposit, isLoading } = useWallet()

    const [amount, setAmount] = useState('')
    const [provider, setProvider] = useState<'MTN_MOMO' | 'MOOV_MONEY'>('MTN_MOMO')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [step, setStep] = useState(1) // 1: Amount, 2: Provider & Phone

    const quickAmounts = [1000, 2500, 5000, 10000, 25000, 50000]

    const handleNextStep = () => {
        if (!amount || Number(amount) < 100) {
            toast.error('Veuillez entrer un montant valide (min 100 XOF)')
            return
        }
        setStep(2)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!phoneNumber) {
            toast.error('Veuillez entrer votre numéro de téléphone')
            return
        }

        const { error } = await deposit({
            amount: Number(amount),
            provider,
            phoneNumber,
        })

        if (!error) {
            refreshWallet()
            toast.success('Dépôt initié! Vérifiez votre téléphone.')
            router.push('/wallet')
        }
    }

    if (!user) return null

    return (
        <main className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => step === 2 ? setStep(1) : router.back()}
                        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FiArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900">Déposer des fonds</h1>
                    <div className="w-10" /> {/* Spacer */}
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Progress bar */}
                <div className="flex gap-2 mb-8">
                    <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-gray-200'}`} />
                    <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
                </div>

                <motion.div
                    key={step}
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    {step === 1 ? (
                        <div className="space-y-6">
                            <div className="card">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Quel montant souhaitez-vous déposer ?</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Montant personnalisé (XOF)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="0"
                                                className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-2xl font-bold focus:bg-white focus:border-primary focus:ring-0 transition-all"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">XOF</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        {quickAmounts.map((amt) => (
                                            <button
                                                key={amt}
                                                type="button"
                                                onClick={() => setAmount(String(amt))}
                                                className={`py-3 rounded-xl font-semibold transition-all ${amount === String(amt)
                                                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[0.98]'
                                                        : 'bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
                                                    }`}
                                            >
                                                {amt.toLocaleString()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                                <FiInfo className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-700">
                                    Le montant minimum de dépôt est de 100 XOF. Aucun frais supplémentaire n'est appliqué sur les dépôts.
                                </p>
                            </div>

                            <button
                                onClick={handleNextStep}
                                disabled={!amount || Number(amount) < 100}
                                className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg shadow-xl shadow-primary/20 disabled:opacity-50"
                            >
                                Continuer
                                <FiChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="card">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Choisissez votre méthode de paiement</h2>

                                <div className="grid grid-cols-1 gap-4 mb-8">
                                    <button
                                        type="button"
                                        onClick={() => setProvider('MTN_MOMO')}
                                        className={`p-4 border-2 rounded-2xl flex items-center gap-4 transition-all ${provider === 'MTN_MOMO'
                                                ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                                                : 'border-gray-100 hover:border-gray-200'
                                            }`}
                                    >
                                        <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center font-bold text-black text-lg shadow-sm">
                                            MTN
                                        </div>
                                        <div className="text-left flex-1">
                                            <span className="font-bold block text-gray-900">MTN Mobile Money</span>
                                            <span className="text-sm text-gray-500">Paiement sécurisé et instantané</span>
                                        </div>
                                        {provider === 'MTN_MOMO' && <div className="w-3 h-3 bg-primary rounded-full" />}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setProvider('MOOV_MONEY')}
                                        className={`p-4 border-2 rounded-2xl flex items-center gap-4 transition-all ${provider === 'MOOV_MONEY'
                                                ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                                                : 'border-gray-100 hover:border-gray-200'
                                            }`}
                                    >
                                        <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center font-bold text-white text-lg shadow-sm">
                                            M
                                        </div>
                                        <div className="text-left flex-1">
                                            <span className="font-bold block text-gray-900">Moov Money</span>
                                            <span className="text-sm text-gray-500">Paiement sécurisé et instantané</span>
                                        </div>
                                        {provider === 'MOOV_MONEY' && <div className="w-3 h-3 bg-primary rounded-full" />}
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Votre numéro de téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="+225 07 XX XX XX XX"
                                        className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-xl font-semibold focus:bg-white focus:border-primary focus:ring-0 transition-all"
                                    />
                                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                        <FiShield className="w-3 h-3" />
                                        Vos informations sont sécurisées et cryptées
                                    </p>
                                </div>
                            </div>

                            <div className="card bg-gray-900 text-white border-0 overflow-hidden relative">
                                <div className="relative z-10">
                                    <p className="text-white/60 text-sm mb-1">Récapitulatif</p>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-3xl font-bold">{Number(amount).toLocaleString()} XOF</p>
                                            <p className="text-sm text-white/60">Dépôt via {provider === 'MTN_MOMO' ? 'MTN MoMo' : 'Moov Money'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !phoneNumber}
                                className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg shadow-xl shadow-primary/20 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Traitement...
                                    </>
                                ) : (
                                    <>
                                        Confirmer le dépôt
                                        <FiArrowLeft className="w-5 h-5 rotate-180" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </main>
    )
}
