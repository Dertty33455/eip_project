'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiArrowLeft, 
  FiPackage, 
  FiTruck,
  FiCheck,
  FiClock,
  FiX,
  FiBook,
  FiMapPin,
  FiPhone,
  FiChevronRight,
  FiDownload,
  FiRefreshCw,
  FiMessageCircle,
  FiStar,
  FiAlertCircle,
  FiFilter
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

interface OrderItem {
  id: string
  book: {
    id: string
    title: string
    author: string
    coverImage?: string
  }
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: string
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  totalAmount: number
  commission: number
  items: OrderItem[]
  shippingAddress?: {
    fullName: string
    address: string
    city: string
    country: string
    phone: string
  }
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
  trackingNumber?: string
}

const statusConfig = {
  PENDING: { 
    label: 'En attente', 
    color: 'bg-yellow-100 text-yellow-800',
    icon: FiClock,
    description: 'Votre commande est en cours de traitement'
  },
  CONFIRMED: { 
    label: 'Confirmée', 
    color: 'bg-blue-100 text-blue-800',
    icon: FiCheck,
    description: 'Votre commande a été confirmée par le vendeur'
  },
  SHIPPED: { 
    label: 'Expédiée', 
    color: 'bg-purple-100 text-purple-800',
    icon: FiTruck,
    description: 'Votre commande est en cours de livraison'
  },
  DELIVERED: { 
    label: 'Livrée', 
    color: 'bg-green-100 text-green-800',
    icon: FiCheck,
    description: 'Votre commande a été livrée'
  },
  CANCELLED: { 
    label: 'Annulée', 
    color: 'bg-red-100 text-red-800',
    icon: FiX,
    description: 'Cette commande a été annulée'
  }
}

type FilterStatus = 'ALL' | 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export default function OrdersPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL')
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/orders')
      return
    }
    fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/orders`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      } else {
        // Demo data
        setOrders([
          {
            id: 'o1',
            orderNumber: 'AFR-2024-001234',
            status: 'DELIVERED',
            totalAmount: 17000,
            commission: 850,
            items: [
              { id: 'i1', book: { id: 'b1', title: 'L\'Enfant Noir', author: 'Camara Laye' }, quantity: 1, price: 8500 },
              { id: 'i2', book: { id: 'b2', title: 'Une si longue lettre', author: 'Mariama Bâ' }, quantity: 1, price: 7500 }
            ],
            shippingAddress: {
              fullName: 'Aminata Diallo',
              address: '123 Rue de la Liberté',
              city: 'Dakar',
              country: 'Sénégal',
              phone: '+221 77 123 4567'
            },
            createdAt: '2024-01-20T10:30:00',
            updatedAt: '2024-01-25T14:00:00',
            estimatedDelivery: '2024-01-25'
          },
          {
            id: 'o2',
            orderNumber: 'AFR-2024-001235',
            status: 'SHIPPED',
            totalAmount: 9000,
            commission: 450,
            items: [
              { id: 'i3', book: { id: 'b3', title: 'Les Soleils des Indépendances', author: 'Ahmadou Kourouma' }, quantity: 1, price: 9000 }
            ],
            shippingAddress: {
              fullName: 'Aminata Diallo',
              address: '123 Rue de la Liberté',
              city: 'Dakar',
              country: 'Sénégal',
              phone: '+221 77 123 4567'
            },
            createdAt: '2024-01-25T09:15:00',
            updatedAt: '2024-01-27T11:00:00',
            estimatedDelivery: '2024-01-30',
            trackingNumber: 'TRK-SN-123456'
          },
          {
            id: 'o3',
            orderNumber: 'AFR-2024-001236',
            status: 'CONFIRMED',
            totalAmount: 8000,
            commission: 400,
            items: [
              { id: 'i4', book: { id: 'b4', title: 'Le Monde s\'effondre', author: 'Chinua Achebe' }, quantity: 1, price: 8000 }
            ],
            shippingAddress: {
              fullName: 'Aminata Diallo',
              address: '123 Rue de la Liberté',
              city: 'Dakar',
              country: 'Sénégal',
              phone: '+221 77 123 4567'
            },
            createdAt: '2024-01-28T16:45:00',
            updatedAt: '2024-01-28T18:00:00',
            estimatedDelivery: '2024-02-02'
          },
          {
            id: 'o4',
            orderNumber: 'AFR-2024-001237',
            status: 'PENDING',
            totalAmount: 6500,
            commission: 325,
            items: [
              { id: 'i5', book: { id: 'b5', title: 'Ville cruelle', author: 'Eza Boto' }, quantity: 1, price: 6500 }
            ],
            shippingAddress: {
              fullName: 'Aminata Diallo',
              address: '123 Rue de la Liberté',
              city: 'Dakar',
              country: 'Sénégal',
              phone: '+221 77 123 4567'
            },
            createdAt: '2024-01-29T10:00:00',
            updatedAt: '2024-01-29T10:00:00'
          },
          {
            id: 'o5',
            orderNumber: 'AFR-2024-001200',
            status: 'CANCELLED',
            totalAmount: 7000,
            commission: 350,
            items: [
              { id: 'i6', book: { id: 'b6', title: 'L\'Aventure Ambiguë', author: 'Cheikh Hamidou Kane' }, quantity: 1, price: 7000 }
            ],
            createdAt: '2024-01-10T14:30:00',
            updatedAt: '2024-01-11T09:00:00'
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const cancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/orders/${orderId}/cancel`, {
        method: 'POST'
      })

      if (res.ok || true) { // Demo
        setOrders(prev => prev.map(o => 
          o.id === orderId ? { ...o, status: 'CANCELLED' as const } : o
        ))
        toast.success('Commande annulée')
        setSelectedOrder(null)
      }
    } catch (error) {
      toast.error('Erreur lors de l\'annulation')
    }
  }

  const submitReview = async () => {
    if (!reviewOrder) return
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/orders/${reviewOrder.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
      })

      if (res.ok || true) { // Demo
        toast.success('Merci pour votre avis !')
        setShowReviewModal(false)
        setReviewOrder(null)
        setReviewRating(5)
        setReviewComment('')
      }
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de l\'avis')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filter orders
  const filteredOrders = filterStatus === 'ALL' 
    ? orders 
    : orders.filter(o => o.status === filterStatus)

  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Mes commandes</h1>
              <p className="text-sm text-gray-500">{orders.length} commande(s) au total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {[
            { value: 'ALL', label: 'Toutes', count: orders.length },
            { value: 'PENDING', label: 'En attente', count: orders.filter(o => o.status === 'PENDING').length },
            { value: 'CONFIRMED', label: 'Confirmées', count: orders.filter(o => o.status === 'CONFIRMED').length },
            { value: 'SHIPPED', label: 'Expédiées', count: orders.filter(o => o.status === 'SHIPPED').length },
            { value: 'DELIVERED', label: 'Livrées', count: orders.filter(o => o.status === 'DELIVERED').length },
            { value: 'CANCELLED', label: 'Annulées', count: orders.filter(o => o.status === 'CANCELLED').length }
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value as FilterStatus)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-colors ${
                filterStatus === filter.value
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {filter.label}
              {filter.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  filterStatus === filter.value ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Aucune commande
            </h2>
            <p className="text-gray-500 mb-6">
              {filterStatus === 'ALL' 
                ? 'Vous n\'avez pas encore passé de commande'
                : 'Aucune commande dans cette catégorie'
              }
            </p>
            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              <FiBook className="w-5 h-5" />
              Découvrir les livres
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status]
              const StatusIcon = status.icon
              
              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-800">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">Commandé le {formatDate(order.createdAt)}</p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="font-medium text-sm">{status.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-16 h-20 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FiBook className="w-6 h-6 text-primary/20" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link 
                              href={`/books/${item.book.id}`}
                              className="font-medium text-gray-800 hover:text-primary transition-colors"
                            >
                              {item.book.title}
                            </Link>
                            <p className="text-sm text-gray-500">{item.book.author}</p>
                            <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">{formatPrice(item.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Total */}
                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <span className="text-gray-600">Total</span>
                      <span className="text-xl font-bold text-primary">{formatPrice(order.totalAmount)}</span>
                    </div>

                    {/* Shipping Info - for shipped orders */}
                    {order.status === 'SHIPPED' && order.trackingNumber && (
                      <div className="mt-4 p-3 bg-purple-50 rounded-xl">
                        <div className="flex items-center gap-2 text-purple-700">
                          <FiTruck className="w-5 h-5" />
                          <span className="font-medium">En cours de livraison</span>
                        </div>
                        <p className="text-sm text-purple-600 mt-1">
                          N° de suivi: {order.trackingNumber}
                        </p>
                        {order.estimatedDelivery && (
                          <p className="text-sm text-purple-600">
                            Livraison estimée: {formatDate(order.estimatedDelivery)}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Delivery Info - for delivered orders */}
                    {order.status === 'DELIVERED' && (
                      <div className="mt-4 p-3 bg-green-50 rounded-xl">
                        <div className="flex items-center gap-2 text-green-700">
                          <FiCheck className="w-5 h-5" />
                          <span className="font-medium">Livrée le {formatDate(order.updatedAt)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Actions */}
                  <div className="px-4 pb-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Voir les détails
                      <FiChevronRight className="w-4 h-4" />
                    </button>

                    {order.status === 'DELIVERED' && (
                      <button
                        onClick={() => {
                          setReviewOrder(order)
                          setShowReviewModal(true)
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                      >
                        <FiStar className="w-4 h-4" />
                        Donner un avis
                      </button>
                    )}

                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <FiX className="w-4 h-4" />
                        Annuler
                      </button>
                    )}

                    {order.status === 'SHIPPED' && order.trackingNumber && (
                      <button
                        className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors"
                      >
                        <FiTruck className="w-4 h-4" />
                        Suivre le colis
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800">{selectedOrder.orderNumber}</h3>
                  <p className="text-sm text-gray-500">{formatDateTime(selectedOrder.createdAt)}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-4 space-y-6">
                {/* Status */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Statut</h4>
                  <div className={`flex items-center gap-3 p-3 rounded-xl ${statusConfig[selectedOrder.status].color}`}>
                    {(() => {
                      const StatusIcon = statusConfig[selectedOrder.status].icon
                      return <StatusIcon className="w-5 h-5" />
                    })()}
                    <div>
                      <p className="font-medium">{statusConfig[selectedOrder.status].label}</p>
                      <p className="text-sm opacity-80">{statusConfig[selectedOrder.status].description}</p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Articles ({selectedOrder.items.length})</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-12 h-16 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FiBook className="w-4 h-4 text-primary/20" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">{item.book.title}</p>
                          <p className="text-xs text-gray-500">{item.book.author}</p>
                          <p className="text-xs text-gray-500">Qté: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-800">{formatPrice(item.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Adresse de livraison</h4>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="font-medium text-gray-800">{selectedOrder.shippingAddress.fullName}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.address}</p>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.country}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-2">
                        <FiPhone className="w-4 h-4" />
                        {selectedOrder.shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Récapitulatif</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="text-gray-800">{formatPrice(selectedOrder.totalAmount - selectedOrder.commission)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Livraison</span>
                      <span className="text-gray-800">Gratuite</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span className="text-gray-800">Total</span>
                      <span className="text-primary">{formatPrice(selectedOrder.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {selectedOrder.status === 'PENDING' && (
                    <button
                      onClick={() => {
                        cancelOrder(selectedOrder.id)
                      }}
                      className="flex-1 py-3 border border-red-300 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors"
                    >
                      Annuler la commande
                    </button>
                  )}
                  <button
                    className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiMessageCircle className="w-5 h-5" />
                    Contacter le vendeur
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && reviewOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">Donner un avis</h3>
              <p className="text-sm text-gray-500 mb-6">
                Commande {reviewOrder.orderNumber}
              </p>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Votre note</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none"
                    >
                      <FiStar
                        className={`w-8 h-8 ${
                          star <= reviewRating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 hover:text-yellow-400'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Votre commentaire</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                  placeholder="Partagez votre expérience..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={submitReview}
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  Publier
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
