'use client'

import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

interface ApiOptions {
  showSuccessToast?: boolean
  showErrorToast?: boolean
  successMessage?: string
}

interface ApiState<T> {
  data: T | null
  error: string | null
  isLoading: boolean
}

export function useApi<T = any>() {
  // allow switching between Next.js built-in routes or external service
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  })

  const request = useCallback(async (
    url: string,
    options?: RequestInit,
    apiOptions?: ApiOptions
  ): Promise<{ data: T | null; error: string | null; raw?: any }> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`

      // Get token from localStorage for Bearer auth
      let token = ''
      if (typeof window !== 'undefined') {
        const authData = localStorage.getItem('BookShell-auth')
        if (authData) {
          try {
            const parsed = JSON.parse(authData)
            token = parsed.state?.token || ''
          } catch (e) {
            // localStorage data not valid JSON, ignore
          }
        }
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string>),
      }

      // Add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      // Django REST Framework doesn't require CSRF cookies like Laravel Sanctum
      // Remove CSRF handling for Django backend
      const res = await fetch(fullUrl, {
        ...options,
        headers,
        // Django doesn't need credentials for JWT auth
      })

      const text = await res.text()
      const data = text ? JSON.parse(text) : null

      if (!res.ok) {
        // Handle unauthorized errors (401)
        if (res.status === 401) {
          if (typeof window !== 'undefined') {
            // Clear auth data and redirect to login
            localStorage.removeItem('BookShell-auth')
            document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

            // Avoid infinite redirect if already on login or register
            const pathname = window.location.pathname
            if (pathname !== '/login' && pathname !== '/register') {
              window.location.href = `/login?redirect=${encodeURIComponent(pathname)}`
            }
          }
        }

        // Try to surface validation errors if provided
        let errorMessage = data.error || data.message || 'Une erreur est survenue'
        if (data.errors) {
          // Django returns validation errors as an object; join them into a single string
          if (Array.isArray(data.errors)) {
            errorMessage = data.errors.join(' ')
          } else if (typeof data.errors === 'object') {
            const flat = Object.values(data.errors).flat()
            if (flat.length) {
              errorMessage = flat.join(' ')
            }
          }
        }
        setState({ data: null, error: errorMessage, isLoading: false })

        if (apiOptions?.showErrorToast !== false) {
          toast.error(errorMessage)
        }

        return { data: null, error: errorMessage, raw: data }
      }

      setState({ data, error: null, isLoading: false })

      if (apiOptions?.showSuccessToast) {
        toast.success(apiOptions.successMessage || 'Opération réussie')
      }

      return { data, error: null }
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur de connexion'
      setState({ data: null, error: errorMessage, isLoading: false })

      if (apiOptions?.showErrorToast !== false) {
        toast.error(errorMessage)
      }

      return { data: null, error: errorMessage }
    }
  }, [])

  const get = useCallback((url: string, options?: ApiOptions) => {
    return request(url, { method: 'GET' }, options)
  }, [request])

  const post = useCallback((url: string, body: any, options?: ApiOptions) => {
    return request(url, { method: 'POST', body: JSON.stringify(body) }, options)
  }, [request])

  const put = useCallback((url: string, body: any, options?: ApiOptions) => {
    return request(url, { method: 'PUT', body: JSON.stringify(body) }, options)
  }, [request])

  const patch = useCallback((url: string, body: any, options?: ApiOptions) => {
    return request(url, { method: 'PATCH', body: JSON.stringify(body) }, options)
  }, [request])

  const del = useCallback((url: string, options?: ApiOptions) => {
    return request(url, { method: 'DELETE' }, options)
  }, [request])

  return {
    ...state,
    request,
    get,
    post,
    put,
    patch,
    delete: del,
  }
}

// Custom hooks for specific API endpoints
export function useBooks() {
  const api = useApi()

  const getBooks = useCallback(async (params?: {
    page?: number
    limit?: number
    category?: string
    condition?: string
    minPrice?: number
    maxPrice?: number
    search?: string
    sortBy?: string
    order?: string
  }) => {
    const searchParams = new URLSearchParams()
    let ordering = undefined
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Map frontend parameter names to Django API parameter names
          if (key === 'category') {
            searchParams.set('genre', String(value))
          } else if (key === 'sortBy' && params.order) {
            // Combine sortBy and order into Django's ordering format
            const cleanSortBy = String(value) === 'createdAt' ? 'created_at' : String(value).replace(/([A-Z])/g, '_$1').toLowerCase()
            ordering = params.order === 'desc' ? `-${cleanSortBy}` : cleanSortBy
          } else if (key === 'order') {
            // Skip, handled with sortBy
          } else if (key === 'limit') {
            // DRF uses page_size parameter (but PAGE_SIZE is set in settings)
            // Skip limit as it's not supported directly
          } else {
            searchParams.set(key, String(value))
          }
        }
      })
    }
    
    // Add ordering if it was set
    if (ordering) {
      searchParams.set('ordering', ordering)
    }
    
    const { data, error } = await api.get(`/api/books/?${searchParams.toString()}`)

    // Transform Django pagination format to frontend format
    if (data && !error) {
      return {
        data: {
          books: data.results || [],
          pagination: {
            page: Math.ceil((data.previous ? parseInt(data.previous.split('page=')[1] || '1') : 1) + 1),
            total: data.count || 0,
            pages: Math.ceil((data.count || 0) / 20), // Assuming 20 per page
          }
        },
        error: null
      }
    }
    return { data: null, error }
  }, [api])

  const getBook = useCallback(async (id: string) => {
    return api.get(`/api/books/${id}`)
  }, [api])

  const createBook = useCallback(async (data: any) => {
    return api.post('/api/books/create/', data, {
      showSuccessToast: true,
      successMessage: 'Livre ajouté avec succès!',
    })
  }, [api])

  const updateBook = useCallback(async (id: string, data: any) => {
    return api.patch(`/api/books/${id}/update/`, data, {
      showSuccessToast: true,
      successMessage: 'Livre mis à jour!',
    })
  }, [api])

  const deleteBook = useCallback(async (id: string) => {
    return api.delete(`/api/books/${id}/delete/`, {
      showSuccessToast: true,
      successMessage: 'Livre supprimé!',
    })
  }, [api])

  return {
    ...api,
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
  }
}

export function useAudiobooks() {
  const api = useApi()

  const getAudiobooks = useCallback(async (params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
  }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'category') {
            searchParams.set('genre', String(value))
          } else if (key === 'limit') {
            // Skip limit, DRF uses PAGE_SIZE from settings
          } else {
            searchParams.set(key, String(value))
          }
        }
      })
    }
    const { data, error } = await api.get(`/api/audiobooks?${searchParams.toString()}`)

    // Transform Django pagination format to frontend format
    if (data && !error) {
      return {
        data: {
          audiobooks: data.results || [],
          pagination: {
            page: Math.ceil((data.previous ? parseInt(data.previous.split('page=')[1] || '1') : 1) + 1),
            total: data.count || 0,
            pages: Math.ceil((data.count || 0) / 20), // Assuming 20 per page
          }
        },
        error: null
      }
    }
    return { data: null, error }
  }, [api])

  const getAudiobook = useCallback(async (id: string) => {
    return api.get(`/api/audiobooks/${id}`)
  }, [api])

  return {
    ...api,
    getAudiobooks,
    getAudiobook,
  }
}

export function useWallet() {
  const api = useApi()

  const getWallet = useCallback(async () => {
    return api.get('/api/wallet')
  }, [api])

  const deposit = useCallback(async (data: {
    amount: number
    provider: 'MTN_MOMO' | 'MOOV_MONEY'
    phoneNumber: string
  }) => {
    return api.post('/api/wallet/deposit', data, {
      showSuccessToast: true,
      successMessage: 'Dépôt initié! Confirmez sur votre téléphone.',
    })
  }, [api])

  const withdraw = useCallback(async (data: {
    amount: number
    provider: 'MTN_MOMO' | 'MOOV_MONEY'
    phoneNumber: string
  }) => {
    return api.post('/api/wallet/withdraw', data, {
      showSuccessToast: true,
      successMessage: 'Retrait initié!',
    })
  }, [api])

  return {
    ...api,
    getWallet,
    deposit,
    withdraw,
  }
}

export function usePosts() {
  const api = useApi()

  const getPosts = useCallback(async (params?: {
    page?: number
    limit?: number
    userId?: string
  }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value))
        }
      })
    }
    const { data, error } = await api.get(`/api/social/posts/?${searchParams.toString()}`)

    // Transform Django pagination format
    if (data && !error) {
      return {
        data: {
          posts: data.results || [],
          pagination: {
            page: Math.ceil((data.previous ? parseInt(data.previous.split('page=')[1] || '1') : 1) + 1),
            total: data.count || 0,
            pages: Math.ceil((data.count || 0) / 20), // Assuming 20 per page
          }
        },
        error: null
      }
    }
    return { data: null, error }
  }, [api])

  const createPost = useCallback(async (data: {
    content: string
    images?: string[]
    type?: string
  }) => {
    return api.post('/api/social/posts/', data, {
      showSuccessToast: true,
      successMessage: 'Publication créée!',
    })
  }, [api])

  const likePost = useCallback(async (postId: string) => {
    return api.post(`/api/social/posts/${postId}/like/`, {}, {
      showErrorToast: false
    })
  }, [api])

  const commentPost = useCallback(async (postId: string, content: string) => {
    return api.post(`/api/social/posts/${postId}/comment/`, { content }, {
      showErrorToast: false
    })
  }, [api])

  const sharePost = useCallback(async (postId: string, platform?: string) => {
    return api.post(`/api/social/posts/${postId}/share/`, { platform }, {
      showSuccessToast: true,
      successMessage: 'Post partagé!',
    })
  }, [api])

  return {
    ...api,
    getPosts,
    createPost,
    likePost,
    commentPost,
    sharePost,
  }
}

export function useFavorites() {
  const api = useApi()

  const getFavorites = useCallback(async () => {
    return api.get('/api/favorites')
  }, [api])

  const toggleFavorite = useCallback(async (bookId?: string, audiobookId?: string) => {
    return api.post('/api/favorites', { bookId, audiobookId })
  }, [api])

  return {
    ...api,
    getFavorites,
    toggleFavorite,
  }
}

export function useNotifications() {
  const api = useApi()

  const getNotifications = useCallback(async () => {
    return api.get('/api/notifications')
  }, [api])

  const markAsRead = useCallback(async (ids: string[]) => {
    return api.patch('/api/notifications/mark-as-read', { notificationIds: ids })
  }, [api])

  return {
    ...api,
    getNotifications,
    markAsRead,
  }
}

export function useCategories() {
  const api = useApi()

  const getCategories = useCallback(async () => {
    return api.get('/api/categories')
  }, [api])

  return {
    ...api,
    getCategories,
  }
}

export function useSearch() {
  const api = useApi()

  const search = useCallback(async (query: string, type?: 'all' | 'books' | 'audiobooks' | 'users') => {
    const params = new URLSearchParams({ q: query })
    if (type) params.set('type', type)
    return api.get(`/api/search?${params.toString()}`)
  }, [api])

  return {
    ...api,
    search,
  }
}

export function useOrders() {
  const api = useApi()

  const getOrders = useCallback(async () => {
    return api.get('/api/orders')
  }, [api])

  const createOrder = useCallback(async (data: {
    items: { bookId: string; quantity: number }[]
    shippingAddress: string
    paymentProvider: 'MTN_MOMO' | 'MOOV_MONEY' | 'WALLET'
    phoneNumber?: string
  }) => {
    return api.post('/api/orders', data, {
      showSuccessToast: true,
      successMessage: 'Commande créée avec succès!',
    })
  }, [api])

  return {
    ...api,
    getOrders,
    createOrder,
  }
}

export function useSubscriptions() {
  const api = useApi()

  const getSubscription = useCallback(async () => {
    return api.get('/api/subscriptions')
  }, [api])

  const subscribe = useCallback(async (data: {
    plan: 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
    provider: 'MTN_MOMO' | 'MOOV_MONEY' | 'WALLET'
    phoneNumber?: string
  }) => {
    return api.post('/api/subscriptions', data, {
      showSuccessToast: true,
      successMessage: 'Abonnement initié!',
    })
  }, [api])

  return {
    ...api,
    getSubscription,
    subscribe,
  }
}

export function useAudioProgress() {
  const api = useApi()

  const saveProgress = useCallback(async (data: {
    audiobook_id: number
    chapter_id: number
    position?: number
    completed?: boolean
    speed?: number
  }) => {
    // We use the authenticated user_id from the backend session
    return api.post('/api/audio-progress', {
      ...data,
      user_id: undefined, // Let backend handle user_id from Auth::id() or provide it if needed
    })
  }, [api])

  const getProgress = useCallback(async (audiobookId: number) => {
    return api.get(`/api/audio-progress?audiobook_id=${audiobookId}`)
  }, [api])

  return {
    ...api,
    saveProgress,
    getProgress,
  }
}

export function usePmf() {
  const api = useApi()

  const getCohorts = useCallback(async (weeks: number = 12) => {
    return api.get(`/api/pmf/cohorts?weeks=${weeks}`)
  }, [api])

  const getScore = useCallback(async () => {
    return api.get('/api/pmf/score')
  }, [api])

  return {
    ...api,
    getCohorts,
    getScore,
  }
}
