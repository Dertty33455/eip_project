'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiSearch, FiFilter, FiMoreVertical } from 'react-icons/fi'
import { useApi } from '@/hooks/useApi'

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

export default function UsersAdmin() {
    const { get } = useApi()
    const [users, setUsers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setIsLoading(true)
        try {
            const res = await get('/api/admin/users')
            if (res.data?.data) {
                setUsers(res.data.data)
            }
        } catch (error) {
            console.error('Failed to fetch users:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredUsers = users.filter(user =>
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-gray-900">Utilisateurs</h1>
                    <p className="text-gray-600 text-sm">Gérez les comptes utilisateurs et leurs permissions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{users.length} utilisateurs au total</span>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un utilisateur..."
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
                                <th className="px-6 py-4">Utilisateur</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Téléphone</th>
                                <th className="px-6 py-4">Rôle</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4">Date d'inscription</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4" colSpan={7}>
                                            <div className="h-12 bg-gray-50 rounded-lg w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td className="px-6 py-12 text-center text-gray-500" colSpan={7}>
                                        Aucun utilisateur trouvé
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        initial="hidden"
                                        animate="visible"
                                        variants={fadeInUp}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">{user.firstName} {user.lastName}</p>
                                                    <p className="text-xs text-gray-500">@{user.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900">{user.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-500">{user.phone || '--'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'SELLER' ? 'bg-emerald-100 text-emerald-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-1.5 text-xs ${user.status === 'ACTIVE' ? 'text-emerald-600' : 'text-amber-600'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'
                                                    }`}></div>
                                                {user.status === 'ACTIVE' ? 'Actif' : user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                                                <FiMoreVertical />
                                            </button>
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
