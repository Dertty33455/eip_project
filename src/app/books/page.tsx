'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  FiSearch, 
  FiFilter, 
  FiGrid, 
  FiList, 
  FiStar, 
  FiHeart, 
  FiShoppingCart,
  FiBook,
  FiChevronDown,
  FiX
} from 'react-icons/fi'
import { useBooks, useCategories } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

// Book Card Component
function BookCard({ book, view }: { book: any; view: 'grid' | 'list' }) {
  const { isAuthenticated } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  
  const conditionLabels: Record<string, string> = {
    NEW: 'Neuf',
    LIKE_NEW: 'Comme neuf',
    GOOD: 'Bon état',
    ACCEPTABLE: 'Acceptable',
  }
  
  const conditionColors: Record<string, string> = {
    NEW: 'badge-success',
    LIKE_NEW: 'badge-info',
    GOOD: 'badge-warning',
    ACCEPTABLE: 'badge-secondary',
  }
  
  if (view === 'list') {
    return (
      <motion.div
        variants={fadeInUp}
        className="card flex gap-6 group"
      >
        {/* Cover Image */}
        <div className="relative w-32 h-48 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
              <FiBook className="w-10 h-10 text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <Link href={`/books/${book.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-primary transition-colors">
                  {book.title}
                </h3>
              </Link>
              <p className="text-gray-600">{book.author}</p>
            </div>
            <span className={`badge ${conditionColors[book.condition] || 'badge-secondary'}`}>
              {conditionLabels[book.condition] || book.condition}
            </span>
          </div>
          
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{book.description}</p>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FiStar 
                  key={i} 
                  className={`w-4 h-4 ${i < (book.rating || 4) ? 'text-accent fill-accent' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({book._count?.reviews || 0} avis)</span>
          </div>
          
          <div className="flex items-center justify-between mt-auto pt-4">
            <span className="text-xl font-bold text-primary">{book.price?.toLocaleString()} XOF</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite ? 'bg-red-100 text-red-500' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <FiHeart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
              </button>
              <button className="btn-primary flex items-center gap-2 py-2 px-4">
                <FiShoppingCart className="w-5 h-5" />
                <span>Ajouter</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }
  
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -5 }}
      className="card group"
    >
      <div className="relative aspect-[3/4] mb-4 rounded-lg overflow-hidden bg-gray-100">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            <FiBook className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <button 
          onClick={() => setIsFavorite(!isFavorite)}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
            isFavorite ? 'bg-red-100 text-red-500' : 'bg-white/90 text-gray-600 hover:text-red-500'
          }`}
        >
          <FiHeart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
        </button>
        {book.condition && (
          <span className={`absolute top-3 left-3 badge ${conditionColors[book.condition] || 'badge-secondary'}`}>
            {conditionLabels[book.condition] || book.condition}
          </span>
        )}
      </div>
      
      <Link href={`/books/${book.id}`}>
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-primary transition-colors">
          {book.title}
        </h3>
      </Link>
      <p className="text-sm text-gray-500 mb-2">{book.author}</p>
      
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <FiStar 
            key={i} 
            className={`w-4 h-4 ${i < (book.rating || 4) ? 'text-accent fill-accent' : 'text-gray-300'}`} 
          />
        ))}
        <span className="text-sm text-gray-500 ml-1">({book._count?.reviews || 0})</span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-primary">{book.price?.toLocaleString()} XOF</span>
        <button className="w-10 h-10 bg-primary/10 hover:bg-primary hover:text-white rounded-full flex items-center justify-center transition-colors">
          <FiShoppingCart className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  )
}

// Filter Sidebar Component
function FilterSidebar({ 
  filters, 
  setFilters, 
  categories,
  isOpen,
  onClose 
}: { 
  filters: any
  setFilters: (filters: any) => void
  categories: any[]
  isOpen: boolean
  onClose: () => void
}) {
  const conditions = [
    { value: 'NEW', label: 'Neuf' },
    { value: 'LIKE_NEW', label: 'Comme neuf' },
    { value: 'GOOD', label: 'Bon état' },
    { value: 'ACCEPTABLE', label: 'Acceptable' },
  ]
  
  const priceRanges = [
    { min: 0, max: 5000, label: 'Moins de 5 000 XOF' },
    { min: 5000, max: 10000, label: '5 000 - 10 000 XOF' },
    { min: 10000, max: 20000, label: '10 000 - 20 000 XOF' },
    { min: 20000, max: null, label: 'Plus de 20 000 XOF' },
  ]
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed top-0 left-0 h-full w-80 bg-white z-50 p-6 overflow-y-auto
        transform transition-transform duration-300
        lg:static lg:transform-none lg:z-0 lg:p-0 lg:h-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h3 className="text-lg font-semibold">Filtres</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        {/* Categories */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Catégories</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={!filters.category}
                onChange={() => setFilters({ ...filters, category: '' })}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-gray-700">Toutes les catégories</span>
            </label>
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === cat.id}
                  onChange={() => setFilters({ ...filters, category: cat.id })}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="text-gray-700">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Condition */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">État</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!filters.condition}
                onChange={() => setFilters({ ...filters, condition: '' })}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
              <span className="text-gray-700">Tous les états</span>
            </label>
            {conditions.map((cond) => (
              <label key={cond.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.condition === cond.value}
                  onChange={() => setFilters({ 
                    ...filters, 
                    condition: filters.condition === cond.value ? '' : cond.value 
                  })}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span className="text-gray-700">{cond.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Prix</h4>
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                  onChange={() => setFilters({ 
                    ...filters, 
                    minPrice: range.min, 
                    maxPrice: range.max 
                  })}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
          
          {/* Custom Price Range */}
          <div className="mt-4 flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        
        {/* Clear Filters */}
        <button
          onClick={() => setFilters({
            category: '',
            condition: '',
            minPrice: undefined,
            maxPrice: undefined,
            search: '',
          })}
          className="w-full py-2 text-primary border border-primary rounded-xl hover:bg-primary/5 transition-colors"
        >
          Effacer les filtres
        </button>
      </aside>
    </>
  )
}

export default function BooksPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    condition: '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
  })
  
  const { getBooks, isLoading } = useBooks()
  const { getCategories } = useCategories()
  const [books, setBooks] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 })
  
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await getCategories()
      if (data?.categories) {
        setCategories(data.categories)
      }
    }
    fetchCategories()
  }, [])
  
  useEffect(() => {
    const fetchBooks = async () => {
      const { data } = await getBooks({
        ...filters,
        page: pagination.page,
        limit: 12,
      })
      if (data) {
        setBooks(data.books || [])
        setPagination({
          page: data.pagination?.page || 1,
          total: data.pagination?.total || 0,
          pages: data.pagination?.pages || 1,
        })
      }
    }
    fetchBooks()
  }, [filters, pagination.page])
  
  // Demo books
  const demoBooks = [
    { id: '1', title: 'Les Soleils des Indépendances', author: 'Ahmadou Kourouma', price: 8500, rating: 5, condition: 'NEW', _count: { reviews: 128 } },
    { id: '2', title: 'Une Si Longue Lettre', author: 'Mariama Bâ', price: 6500, rating: 5, condition: 'NEW', _count: { reviews: 256 } },
    { id: '3', title: 'L\'Enfant Noir', author: 'Camara Laye', price: 7000, rating: 4, condition: 'LIKE_NEW', _count: { reviews: 89 } },
    { id: '4', title: 'Tout s\'effondre', author: 'Chinua Achebe', price: 9000, rating: 5, condition: 'NEW', _count: { reviews: 312 } },
    { id: '5', title: 'Le Monde s\'effondre', author: 'Chinua Achebe', price: 8000, rating: 4, condition: 'GOOD', _count: { reviews: 156 } },
    { id: '6', title: 'Sous l\'orage', author: 'Seydou Badian', price: 5500, rating: 4, condition: 'NEW', _count: { reviews: 67 } },
    { id: '7', title: 'Le Vieux Nègre et la Médaille', author: 'Ferdinand Oyono', price: 6000, rating: 4, condition: 'LIKE_NEW', _count: { reviews: 94 } },
    { id: '8', title: 'Ville Cruelle', author: 'Eza Boto', price: 7500, rating: 4, condition: 'NEW', _count: { reviews: 45 } },
    { id: '9', title: 'Mission Terminée', author: 'Mongo Beti', price: 6800, rating: 4, condition: 'GOOD', _count: { reviews: 72 } },
    { id: '10', title: 'Le Pauvre Christ de Bomba', author: 'Mongo Beti', price: 7200, rating: 5, condition: 'NEW', _count: { reviews: 98 } },
    { id: '11', title: 'L\'Aventure Ambiguë', author: 'Cheikh Hamidou Kane', price: 8200, rating: 5, condition: 'LIKE_NEW', _count: { reviews: 187 } },
    { id: '12', title: 'Soundjata ou l\'Épopée Mandingue', author: 'Djibril Tamsir Niane', price: 5800, rating: 4, condition: 'NEW', _count: { reviews: 134 } },
  ]
  
  const displayBooks = books.length > 0 ? books : demoBooks
  
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Tous les livres
          </h1>
          <p className="text-gray-600">
            Découvrez notre collection de livres africains et du monde entier
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <FilterSidebar 
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
          />
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un livre..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  <FiFilter className="w-5 h-5" />
                  <span>Filtres</span>
                </button>
                
                {/* Sort */}
                <div className="relative">
                  <select
                    value={`${filters.sortBy}-${filters.order}`}
                    onChange={(e) => {
                      const [sortBy, order] = e.target.value.split('-')
                      setFilters({ ...filters, sortBy, order })
                    }}
                    className="appearance-none pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                  >
                    <option value="createdAt-desc">Plus récents</option>
                    <option value="createdAt-asc">Plus anciens</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="title-asc">Titre A-Z</option>
                    <option value="title-desc">Titre Z-A</option>
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                
                {/* View Toggle */}
                <div className="hidden md:flex items-center border border-gray-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setView('grid')}
                    className={`p-3 ${view === 'grid' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                  >
                    <FiGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`p-3 ${view === 'list' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                  >
                    <FiList className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Results Info */}
            <div className="mb-6">
              <p className="text-gray-600">
                {pagination.total || displayBooks.length} livres trouvés
              </p>
            </div>
            
            {/* Books Grid/List */}
            {isLoading ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className={view === 'grid' 
                  ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                  : 'space-y-4'
                }
              >
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    {view === 'grid' ? (
                      <>
                        <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4" />
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                      </>
                    ) : (
                      <div className="flex gap-6">
                        <div className="w-32 h-48 bg-gray-200 rounded-lg" />
                        <div className="flex-1">
                          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                          <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                          <div className="h-3 bg-gray-200 rounded w-2/3" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className={view === 'grid' 
                  ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                  : 'space-y-4'
                }
              >
                {displayBooks.map((book) => (
                  <BookCard key={book.id} book={book} view={view} />
                ))}
              </motion.div>
            )}
            
            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPagination({ ...pagination, page: i + 1 })}
                    className={`w-10 h-10 rounded-lg ${
                      pagination.page === i + 1 
                        ? 'bg-primary text-white' 
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
