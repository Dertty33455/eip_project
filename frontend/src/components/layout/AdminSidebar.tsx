'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    FiHome,
    FiUsers,
    FiBook,
    FiShoppingCart,
    FiAlertCircle,
    FiBarChart2,
    FiHeadphones,
    FiLogOut
} from 'react-icons/fi'
import { useAuth } from '@/hooks/useAuth'

const menuItems = [
    { href: '/admin', icon: FiHome, label: 'Tableau de bord' },
    { href: '/admin/users', icon: FiUsers, label: 'Utilisateurs' },
    { href: '/admin/books', icon: FiBook, label: 'Livres' },
    { href: '/admin/audiobooks', icon: FiHeadphones, label: 'Audiobooks' },
    { href: '/admin/orders', icon: FiShoppingCart, label: 'Commandes' },
    { href: '/admin/reports', icon: FiAlertCircle, label: 'Signalements' },
    { href: '/admin/pmf', icon: FiBarChart2, label: 'PMF Analytics' },
]

export default function AdminSidebar() {
    const pathname = usePathname()
    const { logout } = useAuth()

    return (
        <aside className="w-64 bg-white border-r min-h-screen flex flex-col sticky top-0">
            <div className="p-6 border-b">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
                        B
                    </div>
                    <span className="text-xl font-display font-bold text-gray-900">
                        BookShell <span className="text-primary text-xs ml-1 uppercase border border-primary px-1 rounded">Admin</span>
                    </span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                            <span>{item.label}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t">
                <button
                    onClick={() => logout()}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                >
                    <FiLogOut className="w-5 h-5" />
                    <span>Déconnexion</span>
                </button>
            </div>
        </aside>
    )
}
