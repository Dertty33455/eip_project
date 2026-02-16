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
            <span className={`text-xs px-2 py-1 rounded-full ${
              user.role === 'SELLER' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
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

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const { get, isLoading } = useApi()
  const [stats, setStats] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  
  useEffect(() => {
    fetchAdminData()
  }, [])
  
  const fetchAdminData = async () => {
    const [statsRes, usersRes, reportsRes] = await Promise.all([
      get('/api/admin/stats'),
      get('/api/admin/users?limit=5'),
      get('/api/admin/reports?status=PENDING&limit=5'),
    ])
    
    if (statsRes.data) setStats(statsRes.data)
    if (usersRes.data?.users) setUsers(usersRes.data.users)
    if (reportsRes.data?.reports) setReports(reportsRes.data.reports)
  }
  
  // Demo data
  const demoStats = {
    totalUsers: 52340,
    totalBooks: 12456,
    totalAudiobooks: 543,
    totalRevenue: 45678900,
    userGrowth: 12.5,
    bookGrowth: 8.3,
    revenueGrowth: 23.1,
    totalOrders: 8923,
    pendingOrders: 156,
    totalReports: 23,
  }
  
  const demoOrders = [
    { id: '1', orderNumber: 'ORD001', buyer: { firstName: 'Aminata', lastName: 'Diallo' }, total: 15000, status: 'PENDING' },
    { id: '2', orderNumber: 'ORD002', buyer: { firstName: 'Kofi', lastName: 'Mensah' }, total: 8500, status: 'CONFIRMED' },
    { id: '3', orderNumber: 'ORD003', buyer: { firstName: 'Fatou', lastName: 'Ndiaye' }, total: 22000, status: 'SHIPPED' },
    { id: '4', orderNumber: 'ORD004', buyer: { firstName: 'Jean', lastName: 'Kouassi' }, total: 6500, status: 'DELIVERED' },
    { id: '5', orderNumber: 'ORD005', buyer: { firstName: 'Marie', lastName: 'Traoré' }, total: 9800, status: 'PENDING' },
  ]
  
  const demoUsers = [
    { id: '1', firstName: 'Aminata', lastName: 'Diallo', username: 'aminata_lit', role: 'USER' },
    { id: '2', firstName: 'Kofi', lastName: 'Mensah', username: 'kofi_books', role: 'SELLER' },
    { id: '3', firstName: 'Fatou', lastName: 'Ndiaye', username: 'fatou_reads', role: 'USER' },
  ]
  
  const demoReports = [
    { id: '1', type: 'INAPPROPRIATE', reason: 'Contenu offensant dans la description' },
    { id: '2', type: 'SPAM', reason: 'Publication promotionnelle répétitive' },
  ]
  
  const demoTopBooks = [
    { id: '1', title: 'Les Soleils des Indépendances', author: 'Ahmadou Kourouma', sales: 234, revenue: 1989000 },
    { id: '2', title: 'Une Si Longue Lettre', author: 'Mariama Bâ', sales: 198, revenue: 1287000 },
    { id: '3', title: 'L\'Enfant Noir', author: 'Camara Laye', sales: 156, revenue: 1092000 },
    { id: '4', title: 'Tout s\'effondre', author: 'Chinua Achebe', sales: 143, revenue: 1287000 },
    { id: '5', title: 'L\'Aventure Ambiguë', author: 'Cheikh Hamidou Kane', sales: 121, revenue: 992200 },
  ]
  
  const displayStats = stats || demoStats
  const displayOrders = orders.length > 0 ? orders : demoOrders
  const displayUsers = users.length > 0 ? users : demoUsers
  const displayReports = reports.length > 0 ? reports : demoReports
  
  // Check admin access
  if (authLoading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </main>
    )
  }
  
  if (!user || user.role !== 'ADMIN') {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600 mb-4">Vous n'avez pas les permissions nécessaires</p>
          <Link href="/" className="btn-primary">Retour à l'accueil</Link>
        </div>
      </main>
    )
  }
  
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900">
                Dashboard Admin
              </h1>
              <p className="text-gray-600">
                Bienvenue, {user.firstName}! Voici un aperçu de la plateforme.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/analytics"
                className="btn-secondary flex items-center gap-2"
              >
                <FiBarChart2 className="w-5 h-5" />
                Analytics
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
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
            value={`${(displayStats.totalRevenue / 1000000).toFixed(1)}M XOF`}
            change={displayStats.revenueGrowth}
            icon={FiDollarSign}
            color="bg-primary/10 text-primary"
          />
        </motion.div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
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
            <TopBooks books={demoTopBooks} />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            <PendingReports reports={displayReports} />
            <NewUsers users={displayUsers} />
          </div>
        </div>
        
        {/* Admin Navigation */}
        <div className="mt-8">
          <h3 className="font-semibold text-gray-900 mb-4">Gestion</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { href: '/admin/users', icon: FiUsers, label: 'Utilisateurs', color: 'bg-blue-100 text-blue-600' },
              { href: '/admin/books', icon: FiBook, label: 'Livres', color: 'bg-green-100 text-green-600' },
              { href: '/admin/orders', icon: FiShoppingCart, label: 'Commandes', color: 'bg-purple-100 text-purple-600' },
              { href: '/admin/reports', icon: FiAlertCircle, label: 'Signalements', color: 'bg-red-100 text-red-600' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="card hover:shadow-lg transition-shadow flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="font-medium text-gray-900">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
