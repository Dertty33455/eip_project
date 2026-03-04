'use client'

import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { FiAlertCircle } from 'react-icons/fi'
import AdminSidebar from '@/components/layout/AdminSidebar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return (
            <main className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </main>
        )
    }

    if (!user || user.role !== 'ADMIN') {
        return (
            <main className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md mx-4">
                    <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
                    <p className="text-gray-600 mb-6">Vous n'avez pas les permissions nécessaires pour accéder à l'interface d'administration.</p>
                    <Link href="/" className="btn-primary w-full inline-block">Retour à l'accueil</Link>
                </div>
            </main>
        )
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar />
            <div className="flex-1 min-w-0">
                {children}
            </div>
        </div>
    )
}
