import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency (XOF)
export function formatCurrency(amount: number, currency = 'XOF'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  }).format(d)
}

// Format relative time
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffWeek = Math.floor(diffDay / 7)
  const diffMonth = Math.floor(diffDay / 30)

  if (diffSec < 60) return 'À l\'instant'
  if (diffMin < 60) return `Il y a ${diffMin} min`
  if (diffHour < 24) return `Il y a ${diffHour}h`
  if (diffDay < 7) return `Il y a ${diffDay}j`
  if (diffWeek < 4) return `Il y a ${diffWeek} sem`
  if (diffMonth < 12) return `Il y a ${diffMonth} mois`
  return formatDate(d)
}

// Format duration (seconds to readable)
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// Format audio progress
export function formatAudioTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

// Generate initials
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

// Slugify
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Condition label
export function getConditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    NEW: 'Neuf',
    LIKE_NEW: 'Comme neuf',
    VERY_GOOD: 'Très bon état',
    GOOD: 'Bon état',
    ACCEPTABLE: 'Acceptable',
  }
  return labels[condition] || condition
}

// Status label
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DRAFT: 'Brouillon',
    ACTIVE: 'En vente',
    SOLD: 'Vendu',
    RESERVED: 'Réservé',
    ARCHIVED: 'Archivé',
    PENDING: 'En attente',
    PAID: 'Payé',
    CONFIRMED: 'Confirmé',
    SHIPPED: 'Expédié',
    DELIVERED: 'Livré',
    CANCELLED: 'Annulé',
    REFUNDED: 'Remboursé',
  }
  return labels[status] || status
}

// Transaction type label
export function getTransactionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    DEPOSIT: 'Recharge',
    WITHDRAWAL: 'Retrait',
    PURCHASE: 'Achat',
    SALE: 'Vente',
    SUBSCRIPTION: 'Abonnement',
    COMMISSION: 'Commission',
    REFUND: 'Remboursement',
  }
  return labels[type] || type
}

// Status color
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-700',
    ACTIVE: 'bg-green-100 text-green-700',
    SOLD: 'bg-blue-100 text-blue-700',
    RESERVED: 'bg-yellow-100 text-yellow-700',
    ARCHIVED: 'bg-gray-100 text-gray-500',
    PENDING: 'bg-yellow-100 text-yellow-700',
    PAID: 'bg-blue-100 text-blue-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    SHIPPED: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    REFUNDED: 'bg-orange-100 text-orange-700',
    COMPLETED: 'bg-green-100 text-green-700',
    FAILED: 'bg-red-100 text-red-700',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

// Validate phone number (African format)
export function isValidAfricanPhone(phone: string): boolean {
  // Matches formats like +225XXXXXXXXXX, 00225XXXXXXXXXX, or local format
  const regex = /^(\+|00)?(225|226|227|228|229|233|234|221|223|224)[0-9]{8,10}$/
  return regex.test(phone.replace(/\s/g, ''))
}

// Format phone number
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `+225 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`
  }
  return phone
}

// Calculate commission
export function calculateCommission(amount: number, rate = 0.05): {
  commission: number
  sellerAmount: number
} {
  const commission = Math.round(amount * rate)
  const sellerAmount = amount - commission
  return { commission, sellerAmount }
}

// Generate random color for avatars
export function getRandomColor(seed: string): string {
  const colors = [
    'bg-primary-500',
    'bg-secondary-500',
    'bg-accent-500',
    'bg-rose-500',
    'bg-violet-500',
    'bg-cyan-500',
    'bg-emerald-500',
  ]
  const index = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[index % colors.length]
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Check if user has subscription access
export function hasSubscriptionAccess(subscription: any): boolean {
  if (!subscription) return false
  if (subscription.status !== 'ACTIVE') return false
  if (new Date(subscription.endDate) < new Date()) return false
  return true
}

// Parse query params
export function parseQueryParams<T extends Record<string, any>>(
  searchParams: URLSearchParams,
  defaults: T
): T {
  const result = { ...defaults }
  
  for (const [key, defaultValue] of Object.entries(defaults)) {
    const value = searchParams.get(key)
    if (value !== null) {
      if (typeof defaultValue === 'number') {
        result[key as keyof T] = Number(value) as T[keyof T]
      } else if (typeof defaultValue === 'boolean') {
        result[key as keyof T] = (value === 'true') as T[keyof T]
      } else {
        result[key as keyof T] = value as T[keyof T]
      }
    }
  }
  
  return result
}
