'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiBook, FiSearch, FiPlus, FiMoreVertical, FiImage } from 'react-icons/fi'
import { useBooks } from '@/hooks/useApi'

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

export default function BooksAdmin() {
    const { getBooks } = useBooks()
    const [books, setBooks] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchBooks()
    }, [])

    const fetchBooks = async () => {
        setIsLoading(true)
        try {
            const res = await getBooks({ limit: 50 })
            if (res.data?.books) {
                setBooks(res.data.books)
            }
        } catch (error) {
            console.error('Failed to fetch books:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredBooks = books.filter(book =>
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-gray-900">Livres</h1>
                    <p className="text-gray-600 text-sm">Gérez le catalogue de livres physiques et numériques.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <FiPlus /> Nouveau livre
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par titre, auteur, ISBN..."
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
                                <th className="px-6 py-4">Livre</th>
                                <th className="px-6 py-4">Catégorie</th>
                                <th className="px-6 py-4">Prix</th>
                                <th className="px-6 py-4">Stock / Ventes</th>
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
                            ) : filteredBooks.length === 0 ? (
                                <tr>
                                    <td className="px-6 py-12 text-center text-gray-500" colSpan={6}>
                                        Aucun livre trouvé
                                    </td>
                                </tr>
                            ) : (
                                filteredBooks.map((book) => (
                                    <motion.tr
                                        key={book.id}
                                        initial="hidden"
                                        animate="visible"
                                        variants={fadeInUp}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-16 rounded bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden flex-shrink-0 border border-gray-100">
                                                    {book.coverImage ? (
                                                        <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <FiBook className="w-6 h-6" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900 text-sm truncate max-w-[200px]">{book.title}</p>
                                                    <p className="text-xs text-gray-500 truncate">{book.author}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {book.category?.name || 'Non classé'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-gray-900">{book.price?.toLocaleString()} XOF</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <p className="text-sm text-gray-900">{book.stock || 0} en stock</p>
                                                <p className="text-xs text-gray-500">{book.sales || 0} vendus</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${book.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' :
                                                    book.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                                                        'bg-amber-100 text-amber-700'
                                                }`}>
                                                {book.status}
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
