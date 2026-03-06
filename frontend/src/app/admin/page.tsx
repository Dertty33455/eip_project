'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FiUsers,
  FiBook,
  FiHeadphones,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiShoppingCart,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiMoreVertical,
  FiBarChart2
} from 'react-icons/fi'
import { useAuth } from '@/hooks/useAuth'
import { useApi } from '@/hooks/useApi'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

// Stat Card Component
function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color
}: {
  title: string
  value: string | number
  change?: number
  icon: any
  color: string
}) {
  const isPositive = (change || 0) >= 0

  return (
    <motion.div variants={fadeInUp} className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-4 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
          <span>{isPositive ? '+' : ''}{change}% ce mois</span>
        </div>
      )}
    </motion.div>
  )
}

// Recent Orders Component
function RecentOrders({ orders }: { orders: any[] }) {
  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    SHIPPED: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">Commandes récentes</h3>
        <Link href="/admin/orders" className="text-primary text-sm hover:underline">
          Voir tout
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="pb-3 font-medium">Commande</th>
              <th className="pb-3 font-medium">Client</th>
              <th className="pb-3 font-medium">Montant</th>
              <th className="pb-3 font-medium">Statut</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="text-sm">
                <td className="py-4">
                  <span className="font-medium text-gray-900">#{order.orderNumber || order.id.slice(0, 8)}</span>
                </td>
                <td className="py-4">
                  <span className="text-gray-600">
                    {order.buyer?.firstName} {order.buyer?.lastName}
                  </span>
                </td>
                <td className="py-4">
                  <span className="font-medium text-gray-900">{order.total?.toLocaleString()} XOF</span>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-4">
                  <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline">
                    Détails
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Reports Component
function PendingReports({ reports }: { reports: any[] }) {
  const typeLabels: Record<string, string> = {
    INAPPROPRIATE: 'Contenu inapproprié',
    SPAM: 'Spam',
    HARASSMENT: 'Harcèlement',
    COPYRIGHT: 'Droit d\'auteur',
    OTHER: 'Autre',
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <FiAlertCircle className="text-red-500" />
          Signalements en attente
        </h3>
        <Link href="/admin/reports" className="text-primary text-sm hover:underline">
          Voir tout
        </Link>
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aucun signalement en attente</p>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {typeLabels[report.type] || report.type}
                </p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                  {report.reason}
                </p>
              </div>
              <Link
                href={`/admin/reports/${report.id}`}
                className="text-sm text-primary hover:underline"
              >
                Examiner
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// New Users Component
function NewUsers({ users }: { users: any[] }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">Nouveaux utilisateurs</h3>
        <Link href="/admin/users" className="text-primary text-sm hover:underline">
          Voir tout
        </Link>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">@{user.username}</p>
              </div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'SELLER' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
              {user.role === 'SELLER' ? 'Vendeur' : 'Utilisateur'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Top Books Component
function TopBooks({ books }: { books: any[] }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">Livres populaires</h3>
        <Link href="/admin/books" className="text-primary text-sm hover:underline">
          Voir tout
        </Link>
      </div>

      <div className="space-y-4">
        {books.map((book, index) => (
          <div key={book.id} className="flex items-center gap-4">
            <span className="text-2xl font-bold text-gray-300 w-8">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">
                {book.title}
              </p>
              <p className="text-xs text-gray-500">{book.author}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900 text-sm">
                {book.sales || 0} ventes
              </p>
              <p className="text-xs text-gray-500">
                {book.revenue?.toLocaleString() || 0} XOF
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Recent Activities Component
function RecentActivities({ activities }: { activities: any[] }) {
  const getActivityDescription = (activity: any) => {
    const user = activity.user ? `${activity.user.firstName} ${activity.user.lastName}` : 'Utilisateur inconnu'

    switch (activity.action) {
      case 'post.created':
        return `${user} a publié un nouveau post`
      case 'post.liked':
        return `${user} a aimé une publication`
      case 'post.commented':
        return `${user} a commenté une publication`
      case 'post.shared':
        return `${user} a partagé une publication`
      case 'book.favorited':
        return `${user} a ajouté un livre à ses favoris`
      case 'audiobook.favorited':
        return `${user} a ajouté un audiobook à ses favoris`
      case 'book.reviewed':
        return `${user} a laissé un avis sur un livre`
      case 'audiobook.reviewed':
        return `${user} a laissé un avis sur un audiobook`
      case 'audio.played':
        return `${user} a commencé l'écoute d'un audiobook`
      case 'user.followed':
        return `${user} a suivi un autre utilisateur`
      case 'order.placed':
        return `${user} a passé une commande`
      case 'wallet.deposit':
        return `${user} a effectué un dépôt sur son portefeuille`
      case 'wallet.withdrawal':
        return `${user} a effectué un retrait de son portefeuille`
      case 'subscription.purchased':
        return `${user} s'est abonné`
      default:
        return `${user}: ${activity.action}`
    }
  }

  const formatTime = (date: string) => {
    const d = new Date(date)
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">Activités récentes</h3>
        <span className="text-xs text-gray-500">Temps réel</span>
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aucune activité récente</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 pb-4 border-b last:border-0 last:pb-0">
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 line-clamp-1">
                  {getActivityDescription(activity)}
                </p>
                <p className="text-xs text-gray-500">{formatTime(activity.created_at)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const { get } = useApi()
  const [stats, setStats] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [topBooks, setTopBooks] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    const [statsRes, usersRes, reportsRes, ordersRes, topBooksRes, activitiesRes] = await Promise.all([
      get('/api/admin/stats'),
      get('/api/admin/users?limit=5'),
      get('/api/admin/reports?status=PENDING&limit=5'),
      get('/api/admin/orders/recent?limit=5'),
      get('/api/admin/top-books'),
      get('/api/admin/activities?limit=8'),
    ])

    if (statsRes.data) setStats(statsRes.data)
    if (usersRes.data?.data) setUsers(usersRes.data.data)
    if (reportsRes.data?.data) setReports(reportsRes.data.data)
    if (ordersRes.data?.data) setOrders(ordersRes.data.data)
    if (topBooksRes.data) setTopBooks(topBooksRes.data)
    if (activitiesRes.data) setActivities(activitiesRes.data)
  }

  const displayStats = stats || {
    totalUsers: 0,
    totalBooks: 0,
    totalAudiobooks: 0,
    totalRevenue: 0,
    userGrowth: 0,
    bookGrowth: 0,
    revenueGrowth: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalReports: 0,
  }
  const displayOrders = orders
  const displayUsers = users
  const displayReports = reports
  const displayTopBooks = topBooks
  const displayActivities = activities

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Bonjour, {user?.firstName}! Voici un aperçu de l'activité.
        </p>
      </div>

      {/* Stats Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <StatCard
          title="Utilisateurs"
          value={displayStats.totalUsers?.toLocaleString()}
          change={displayStats.userGrowth}
          icon={FiUsers}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Livres"
          value={displayStats.totalBooks?.toLocaleString()}
          change={displayStats.bookGrowth}
          icon={FiBook}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Audiobooks"
          value={displayStats.totalAudiobooks?.toLocaleString()}
          icon={FiHeadphones}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Revenus"
          value={`${((displayStats.totalRevenue || 0) / 1000000).toFixed(1)}M XOF`}
          change={displayStats.revenueGrowth}
          icon={FiDollarSign}
          color="bg-primary/10 text-primary"
        />
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
            <FiClock className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{displayStats.pendingOrders}</p>
            <p className="text-sm text-gray-500">Commandes en attente</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <FiCheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{displayStats.totalOrders}</p>
            <p className="text-sm text-gray-500">Total commandes</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <FiAlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{displayStats.totalReports}</p>
            <p className="text-sm text-gray-500">Signalements</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <RecentOrders orders={displayOrders} />
          <RecentActivities activities={displayActivities} />
          <TopBooks books={displayTopBooks} />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <PendingReports reports={displayReports} />
          <NewUsers users={displayUsers} />
        </div>
      </div>
    </div>
  )
}
