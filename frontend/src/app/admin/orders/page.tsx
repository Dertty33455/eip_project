'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiSearch, FiFilter, FiMoreVertical, FiEye } from 'react-icons/fi'
import { useApi } from '@/hooks/useApi'
import Link from 'next/link'

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

export default function OrdersAdmin() {
    const { get } = useApi()
    const [orders, setOrders] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        setIsLoading(true)
        try {
            const res = await get('/api/admin/orders/recent?limit=100')
            if (res.data?.data) {
                setOrders(res.data.data)
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredOrders = orders.filter(order =>
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.buyer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.buyer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const statusColors: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-700',
        CONFIRMED: 'bg-blue-100 text-blue-700',
        SHIPPED: 'bg-purple-100 text-purple-700',
        DELIVERED: 'bg-emerald-100 text-emerald-700',
        CANCELLED: 'bg-red-100 text-red-700',
    }

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-gray-900">Commandes</h1>
                    <p className="text-gray-600 text-sm">Suivez et gérez les ventes de la plateforme.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par # ou client..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <th className="px-6 py-4">Commande</th>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Montant</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4" colSpan={6}>
                                            <div className="h-12 bg-gray-50 rounded-lg w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td className="px-6 py-12 text-center text-gray-500" colSpan={6}>
                                        Aucune commande trouvée
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <motion.tr
                                        key={order.id}
                                        initial="hidden"
                                        animate="visible"
                                        variants={fadeInUp}
                                        className="hover:bg-gray-50/50 transition-colors text-sm"
                                    >
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            #{order.orderNumber || order.id.slice(0, 8)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{order.buyer?.firstName} {order.buyer?.lastName}</p>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            {order.total?.toLocaleString()} XOF
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/orders/${order.id}`} className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors text-gray-400">
                                                    <FiEye />
                                                </Link>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                                                    <FiMoreVertical />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
