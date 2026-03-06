'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
    HiOutlineArrowLeft,
    HiOutlineCheckCircle,
    HiOutlineCreditCard,
    HiOutlineTruck,
    HiOutlineShieldCheck,
    HiOutlineCash
} from 'react-icons/hi'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useApi } from '@/hooks/useApi'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

type CheckoutStep = 'SHIPPING' | 'PAYMENT' | 'CONFIRMATION'

export default function CheckoutPage() {
    const router = useRouter()
    const { user, isLoading: authLoading } = useAuth()
    const { cart, total, subtotal, tax, refreshCart, isLoading: cartLoading } = useCart()
    const api = useApi()

    const [step, setStep] = useState<CheckoutStep>('SHIPPING')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        delivery_address: user?.location || '',
        delivery_city: '',
        delivery_phone: user?.phone || '',
        payment_method: 'WALLET' as 'MTN_MOMO' | 'MOOV_MONEY' | 'WALLET',
    })

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/checkout')
        }
    }, [user, authLoading, router])

    if (authLoading || cartLoading || !cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                {cart && cart.items.length === 0 && !cartLoading && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-8 text-center">
                        <p className="text-earth-500 font-medium">Votre panier est vide</p>
                        <Link href="/books" className="text-primary-600 font-bold mt-2 inline-block">Continuer mes achats</Link>
                    </div>
                )}
            </div>
        )
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleNextStep = () => {
        if (step === 'SHIPPING') {
            if (!formData.delivery_address || !formData.delivery_city || !formData.delivery_phone) {
                toast.error('Veuillez remplir tous les champs de livraison')
                return
            }
            setStep('PAYMENT')
        }
    }

    const handlePrevStep = () => {
        if (step === 'PAYMENT') setStep('SHIPPING')
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const { data, error } = await api.post('/api/orders/checkout', formData)
            if (!error && data) {
                toast.success('Commande passée avec succès !')
                setStep('CONFIRMATION')
                refreshCart()
            }
        } catch (err) {
            console.error('Checkout error:', err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-cream-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Progress Steps */}
                <div className="max-w-3xl mx-auto mb-12">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-cream-200 -z-10 rounded-full" />
                        <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-500 -z-10 rounded-full transition-all duration-500"
                            style={{ width: step === 'SHIPPING' ? '0%' : step === 'PAYMENT' ? '50%' : '100%' }}
                        />

                        {[
                            { id: 'SHIPPING', label: 'Livraison', icon: HiOutlineTruck },
                            { id: 'PAYMENT', label: 'Paiement', icon: HiOutlineCreditCard },
                            { id: 'CONFIRMATION', label: 'Terminé', icon: HiOutlineCheckCircle }
                        ].map((s, idx) => {
                            const isActive = step === s.id
                            const isPast = (step === 'PAYMENT' && idx === 0) || (step === 'CONFIRMATION' && (idx === 0 || idx === 1))

                            return (
                                <div key={s.id} className="flex flex-col items-center">
                                    <div
                                        className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300",
                                            isActive ? "bg-primary-500 border-primary-200 text-white scale-110 shadow-lg" :
                                                isPast ? "bg-green-500 border-green-200 text-white" : "bg-white border-cream-200 text-earth-300"
                                        )}
                                    >
                                        <s.icon className="w-6 h-6" />
                                    </div>
                                    <span className={cn(
                                        "text-xs font-bold mt-2",
                                        isActive ? "text-primary-600" : isPast ? "text-green-600" : "text-earth-400"
                                    )}>
                                        {s.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Main Form Area */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            {step === 'SHIPPING' && (
                                <motion.div
                                    key="shipping"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-white rounded-3xl p-8 shadow-african border border-cream-100"
                                >
                                    <h2 className="text-2xl font-display font-bold text-earth-900 mb-8 flex items-center space-x-2">
                                        <HiOutlineTruck className="w-8 h-8 text-primary-500" />
                                        <span>Informations de Livraison</span>
                                    </h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-earth-700 mb-2">Adresse complète</label>
                                            <input
                                                type="text"
                                                name="delivery_address"
                                                value={formData.delivery_address}
                                                onChange={handleInputChange}
                                                placeholder="Rue, Appt, Quartier..."
                                                className="w-full px-4 py-3 bg-cream-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-earth-700 mb-2">Ville</label>
                                                <input
                                                    type="text"
                                                    name="delivery_city"
                                                    value={formData.delivery_city}
                                                    onChange={handleInputChange}
                                                    placeholder="Ex: Dakar, Abidjan..."
                                                    className="w-full px-4 py-3 bg-cream-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-earth-700 mb-2">Téléphone</label>
                                                <input
                                                    type="tel"
                                                    name="delivery_phone"
                                                    value={formData.delivery_phone}
                                                    onChange={handleInputChange}
                                                    placeholder="+221 ..."
                                                    className="w-full px-4 py-3 bg-cream-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-8">
                                            <button
                                                onClick={handleNextStep}
                                                className="w-full py-4 bg-primary-500 text-white rounded-2xl font-bold text-lg hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/30 active:scale-[0.98]"
                                            >
                                                Continuer vers le paiement
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 'PAYMENT' && (
                                <motion.div
                                    key="payment"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-white rounded-3xl p-8 shadow-african border border-cream-100"
                                >
                                    <button
                                        onClick={handlePrevStep}
                                        className="flex items-center space-x-2 text-earth-500 hover:text-primary-500 mb-8 font-medium transition-colors"
                                    >
                                        <HiOutlineArrowLeft className="w-5 h-5" />
                                        <span>Retour à la livraison</span>
                                    </button>

                                    <h2 className="text-2xl font-display font-bold text-earth-900 mb-8 flex items-center space-x-2">
                                        <HiOutlineCreditCard className="w-8 h-8 text-primary-500" />
                                        <span>Méthode de Paiement</span>
                                    </h2>

                                    <div className="space-y-4">
                                        {[
                                            { id: 'WALLET', label: 'Portefeuille BookShell', icon: HiOutlineCash, description: 'Payez avec votre solde' },
                                            { id: 'MTN_MOMO', label: 'MTN Mobile Money', icon: '/images/payments/mtn.png', description: 'Paiement via mobile' },
                                            { id: 'MOOV_MONEY', label: 'Moov Money', icon: '/images/payments/moov.png', description: 'Paiement via mobile' }
                                        ].map((p) => (
                                            <label
                                                key={p.id}
                                                className={cn(
                                                    "flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all",
                                                    formData.payment_method === p.id
                                                        ? "border-primary-500 bg-primary-50"
                                                        : "border-cream-100 hover:border-cream-300"
                                                )}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value={p.id}
                                                    checked={formData.payment_method === p.id}
                                                    onChange={handleInputChange}
                                                    className="hidden"
                                                />
                                                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                                                    {typeof p.icon === 'string' ? (
                                                        <div className="w-10 h-10 relative">
                                                            {/* logo placeholder for now */}
                                                            <div className="w-full h-full bg-cream-200 rounded-lg" />
                                                        </div>
                                                    ) : (
                                                        <p.icon className="w-10 h-10 text-earth-700" />
                                                    )}
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <p className="font-bold text-earth-800">{p.label}</p>
                                                    <p className="text-sm text-earth-500">{p.description}</p>
                                                </div>
                                                <div className={cn(
                                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                                                    formData.payment_method === p.id ? "border-primary-500 bg-white" : "border-cream-300"
                                                )}>
                                                    {formData.payment_method === p.id && <div className="w-3 h-3 bg-primary-500 rounded-full" />}
                                                </div>
                                            </label>
                                        ))}
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-cream-100">
                                        <div className="bg-primary-50 p-6 rounded-2xl mb-8 flex items-start space-x-3 border border-primary-100">
                                            <HiOutlineShieldCheck className="w-6 h-6 text-primary-600 mt-1" />
                                            <div>
                                                <p className="text-sm font-bold text-primary-900">Paiement 100% sécurisé</p>
                                                <p className="text-xs text-primary-700 mt-1">Vos transactions sont protégées par un cryptage de bout en bout et des protocoles de sécurité avancés.</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className="w-full py-4 bg-primary-500 text-white rounded-2xl font-bold text-lg hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/30 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                `Confirmer et payer ${total.toLocaleString()} FCFA`
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 'CONFIRMATION' && (
                                <motion.div
                                    key="confirmation"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white rounded-3xl p-12 shadow-african border border-cream-100 text-center"
                                >
                                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <HiOutlineCheckCircle className="w-16 h-16" />
                                    </div>
                                    <h2 className="text-3xl font-display font-bold text-earth-900 mb-4">Commande Confirmée !</h2>
                                    <p className="text-earth-500 mb-12 max-w-md mx-auto">
                                        Merci pour votre achat. Votre commande a été reçue et est en cours de traitement.
                                        Vous recevrez un email de confirmation sous peu.
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                                        <Link
                                            href="/orders"
                                            className="py-4 bg-cream-100 text-earth-800 rounded-2xl font-bold hover:bg-cream-200 transition-all"
                                        >
                                            Voir mes commandes
                                        </Link>
                                        <Link
                                            href="/books"
                                            className="py-4 bg-primary-500 text-white rounded-2xl font-bold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20"
                                        >
                                            Continuer mes achats
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Column: Order Summary (only small steps) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24">
                        <div className="bg-white rounded-3xl p-6 shadow-african border border-cream-100">
                            <h3 className="text-lg font-display font-bold text-earth-900 mb-6">Résumé de la commande</h3>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6 scrollbar-thin scrollbar-thumb-cream-200">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="flex space-x-3">
                                        <div className="w-16 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.book.coverImage || '/images/books/placeholder.jpg'}
                                                alt={item.book.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-earth-800 line-clamp-1">{item.book.title}</p>
                                            <p className="text-xs text-earth-500">Qté: {item.quantity}</p>
                                            <p className="text-sm font-bold text-primary-600 mt-1">
                                                {(item.book.price * item.quantity).toLocaleString()} FCFA
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-cream-100">
                                <div className="flex justify-between text-sm text-earth-600">
                                    <span>Sous-total</span>
                                    <span className="font-medium">{subtotal.toLocaleString()} FCFA</span>
                                </div>
                                <div className="flex justify-between text-sm text-earth-600">
                                    <span>TVA (5%)</span>
                                    <span className="font-medium">{tax.toLocaleString()} FCFA</span>
                                </div>
                                <div className="flex justify-between text-sm text-earth-600">
                                    <span>Frais de livraison</span>
                                    <span className="text-green-600 font-bold uppercase text-[10px] bg-green-50 px-2 py-0.5 rounded">Gratuit</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-earth-900 pt-3 border-t border-cream-50">
                                    <span>Total</span>
                                    <span className="text-primary-600">{total.toLocaleString()} FCFA</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
