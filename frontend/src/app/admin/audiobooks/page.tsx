'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiHeadphones, FiSearch, FiPlus, FiMoreVertical, FiPlay } from 'react-icons/fi'
import { useAudiobooks } from '@/hooks/useApi'

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

export default function AudiobooksAdmin() {
    const { getAudiobooks } = useAudiobooks()
    const [audiobooks, setAudiobooks] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchAudiobooks()
    }, [])

    const fetchAudiobooks = async () => {
        setIsLoading(true)
        try {
            const res = await getAudiobooks({ limit: 50 })
            if (res.data?.audiobooks) {
                setAudiobooks(res.data.audiobooks)
            }
        } catch (error) {
            console.error('Failed to fetch audiobooks:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredAudiobooks = audiobooks.filter(audio =>
        audio.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audio.author?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-gray-900">Audiobooks</h1>
                    <p className="text-gray-600 text-sm">Gérez le catalogue des livres audio.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <FiPlus /> Nouvel audio
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par titre, auteur..."
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
                                <th className="px-6 py-4">Audiobook</th>
                                <th className="px-6 py-4">Catégorie</th>
                                <th className="px-6 py-4">Durée</th>
                                <th className="px-6 py-4">Accès</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4" colSpan={6}>
                                            <div className="h-16 bg-gray-50 rounded-lg w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredAudiobooks.length === 0 ? (
                                <tr>
                                    <td className="px-6 py-12 text-center text-gray-500" colSpan={6}>
                                        Aucun audiobook trouvé
                                    </td>
                                </tr>
                            ) : (
                                filteredAudiobooks.map((audio) => (
                                    <motion.tr
                                        key={audio.id}
                                        initial="hidden"
                                        animate="visible"
                                        variants={fadeInUp}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded bg-primary/5 flex items-center justify-center text-primary overflow-hidden flex-shrink-0 border border-primary/10">
                                                    {audio.coverImage ? (
                                                        <img src={audio.coverImage} alt={audio.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <FiHeadphones className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900 text-sm truncate max-w-[200px]">{audio.title}</p>
                                                    <p className="text-xs text-gray-500 truncate">{audio.author}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {audio.category?.name || 'Non classé'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {audio.duration || '--'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${audio.isPremium ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                {audio.isPremium ? 'Premium' : 'Gratuit'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${audio.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {audio.status}
                                            </span>
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
