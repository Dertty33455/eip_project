'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
    HiOutlineTrash,
    HiOutlinePlus,
    HiOutlineMinus,
    HiOutlineArrowLeft,
    HiOutlineShoppingBag
} from 'react-icons/hi'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

export default function CartPage() {
    const { user } = useAuth()
    const {
        cart,
        isLoading,
        updateQuantity,
        removeItem,
        subtotal,
        tax,
        total
    } = useCart()

    if (!user) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-african max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <HiOutlineShoppingBag className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-display font-bold text-earth-800 mb-2">Votre panier attend</h1>
                    <p className="text-earth-500 mb-8">Connectez-vous pour voir vos articles et finaliser vos achats.</p>
                    <div className="space-y-4">
                        <Link
                            href="/login"
                            className="block w-full py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
                        >
                            Se connecter
                        </Link>
                        <Link
                            href="/register"
                            className="block w-full py-3 text-primary-600 border border-primary-200 rounded-xl font-medium hover:bg-primary-50 transition-colors"
                        >
                            Créer un compte
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    if (isLoading && !cart) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        )
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="w-24 h-24 bg-cream-100 text-earth-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <HiOutlineShoppingBag className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-earth-800 mb-4">Votre panier est vide</h1>
                    <p className="text-earth-500 mb-8 max-w-md mx-auto">
                        Il semble que vous n'ayez pas encore ajouté de livres à votre panier.
                        Explorez notre collection pour trouver votre prochaine lecture !
                    </p>
                    <Link
                        href="/books"
                        className="inline-flex items-center space-x-2 px-8 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
                    >
                        <HiOutlineArrowLeft className="w-5 h-5" />
                        <span>Découvrir des livres</span>
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-cream-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-4 mb-8">
                    <Link
                        href="/books"
                        className="p-2 bg-white rounded-full text-earth-500 hover:text-primary-500 shadow-sm transition-colors"
                    >
                        <HiOutlineArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl font-display font-bold text-earth-900">Mon Panier</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Items List */}
                    <div className="lg:col-span-8 space-y-4">
                        <AnimatePresence mode="popLayout">
                            {cart.items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-cream-100 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6"
                                >
                                    <div className="w-24 h-32 sm:w-28 sm:h-40 relative rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                                        <Image
                                            src={item.book.coverImage || '/images/books/placeholder.jpg'}
                                            alt={item.book.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0 text-center sm:text-left">
                                        <h3 className="text-lg font-bold text-earth-800 line-clamp-1">{item.book.title}</h3>
                                        <p className="text-earth-500 text-sm mb-4">par {item.book.author}</p>

                                        <div className="flex items-center justify-center sm:justify-start space-x-1 mb-2">
                                            <span className="text-xl font-bold text-primary-600">{item.book.price.toLocaleString()} FCFA</span>
                                        </div>

                                        <div className="flex items-center justify-center sm:justify-start space-x-4 mt-6">
                                            <div className="flex items-center bg-cream-50 border border-cream-200 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="p-2 text-earth-500 hover:bg-cream-100 disabled:opacity-30 transition-colors"
                                                >
                                                    <HiOutlineMinus className="w-4 h-4" />
                                                </button>
                                                <span className="w-10 text-center font-medium text-earth-800">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 text-earth-500 hover:bg-cream-100 transition-colors"
                                                >
                                                    <HiOutlinePlus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Supprimer"
                                            >
                                                <HiOutlineTrash className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="hidden sm:block text-right">
                                        <p className="text-lg font-bold text-earth-800">
                                            {(item.book.price * item.quantity).toLocaleString()} FCFA
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-2xl p-6 shadow-african border border-cream-100 sticky top-24">
                            <h2 className="text-xl font-display font-bold text-earth-800 mb-6">Récapitulatif</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-earth-600">
                                    <span>Sous-total</span>
                                    <span>{subtotal.toLocaleString()} FCFA</span>
                                </div>
                                <div className="flex justify-between text-earth-600">
                                    <span>TVA (5%)</span>
                                    <span>{tax.toLocaleString()} FCFA</span>
                                </div>
                                <div className="flex justify-between text-earth-600">
                                    <span>Frais de livraison</span>
                                    <span className="text-green-600 uppercase text-sm font-bold tracking-tight">Gratuit</span>
                                </div>
                                <div className="border-t border-cream-100 pt-4 mt-4 flex justify-between">
                                    <span className="text-lg font-bold text-earth-800">Total</span>
                                    <span className="text-2xl font-bold text-primary-600">{total.toLocaleString()} FCFA</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="block w-full py-4 bg-primary-500 text-white rounded-xl font-bold text-center hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/25 active:scale-[0.98]"
                            >
                                Passer la commande
                            </Link>

                            <div className="mt-6 flex flex-col space-y-3">
                                <div className="flex items-center space-x-2 text-xs text-earth-400">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    <span>Paiements sécurisés par Mobile Money & Portefeuille</span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-earth-400">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    <span>Livraison partout au Sénégal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
