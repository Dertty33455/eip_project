'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiAlertCircle, FiSearch, FiCheckCircle, FiMoreVertical, FiEye, FiClock } from 'react-icons/fi'
import { useApi } from '@/hooks/useApi'
import Link from 'next/link'

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

export default function ReportsAdmin() {
    const { get } = useApi()
    const [reports, setReports] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchReports()
    }, [])

    const fetchReports = async () => {
        setIsLoading(true)
        try {
            const res = await get('/api/admin/reports?status=PENDING&limit=100')
            if (res.data?.data) {
                setReports(res.data.data)
            }
        } catch (error) {
            console.error('Failed to fetch reports:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredReports = reports.filter(report =>
        report.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.type?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const typeLabels: Record<string, string> = {
        INAPPROPRIATE: 'Inapproprié',
        SPAM: 'Spam',
        HARASSMENT: 'Harcèlement',
        COPYRIGHT: 'Droit d\'auteur',
        OTHER: 'Autre',
    }

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3">
                        <FiAlertCircle className="text-red-500" /> Signalements
                    </h1>
                    <p className="text-gray-600 text-sm">Examinez les signalements émis par la communauté.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher dans les signalements..."
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
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Raison</th>
                                <th className="px-6 py-4">Cible</th>
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
                            ) : filteredReports.length === 0 ? (
                                <tr>
                                    <td className="px-6 py-12 text-center text-gray-500" colSpan={6}>
                                        Aucun signalement trouvé
                                    </td>
                                </tr>
                            ) : (
                                filteredReports.map((report) => (
                                    <motion.tr
                                        key={report.id}
                                        initial="hidden"
                                        animate="visible"
                                        variants={fadeInUp}
                                        className="hover:bg-gray-50/50 transition-colors text-sm"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-gray-900">
                                                {typeLabels[report.type] || report.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <p className="truncate text-gray-600 italic">"{report.reason}"</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-900 border-b border-dashed border-gray-200 inline-block">
                                                {report.targetType} #{report.targetId?.slice(0, 8)}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {new Date(report.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1.5 text-amber-600 font-medium text-xs">
                                                <FiClock /> En attente
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/reports/${report.id}`} className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors text-xs font-bold">
                                                    Examiner
                                                </Link>
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
