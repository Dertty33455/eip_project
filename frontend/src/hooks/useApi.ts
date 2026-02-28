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

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options?.headers,
      }

      // Add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      // Laravel Sanctum requires a CSRF cookie for state-changing requests and
      // also the request to include credentials so the cookie is sent back.
      if (
        options?.method &&
        ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method.toUpperCase())
      ) {
        // ignore the response, we just need the cookie to be set
        await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
          credentials: 'include',
        })

        // read the XSRF token cookie and attach as header for the next request
        if (typeof document !== 'undefined') {
          const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
          if (match) {
            headers['X-XSRF-TOKEN'] = decodeURIComponent(match[1])
          }
        }
      }

      const res = await fetch(fullUrl, {
        ...options,
        headers,
        credentials: 'include', // send cookies for auth/session
      })
      
      const text = await res.text()
      const data = text ? JSON.parse(text) : null
      
      if (!res.ok) {
        // Try to surface validation errors if provided
        let errorMessage = data.error || data.message || 'Une erreur est survenue'
        if (data.errors) {
          // Laravel returns an object of arrays; join them into a single string
          const flat = Object.values(data.errors).flat()
          if (flat.length) {
            errorMessage = flat.join(' ')
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
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value))
        }
      })
    }
    const { data, error } = await api.get(`/api/books?${searchParams.toString()}`)
    
    // Transform Laravel pagination format to frontend format
    if (data && !error) {
      return {
        data: {
          books: data.data || [],
          pagination: {
            page: data.current_page || 1,
            total: data.total || 0,
            pages: data.last_page || 1,
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
    return api.post('/api/books', data, {
      showSuccessToast: true,
      successMessage: 'Livre ajouté avec succès!',
    })
  }, [api])

  const updateBook = useCallback(async (id: string, data: any) => {
    return api.patch(`/api/books/${id}`, data, {
      showSuccessToast: true,
      successMessage: 'Livre mis à jour!',
    })
  }, [api])

  const deleteBook = useCallback(async (id: string) => {
    return api.delete(`/api/books/${id}`, {
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
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value))
        }
      })
    }
    const { data, error } = await api.get(`/api/audiobooks?${searchParams.toString()}`)
    
    // Transform Laravel pagination format to frontend format
    if (data && !error) {
      return {
        data: {
          audiobooks: data.data || [],
          pagination: {
            page: data.current_page || 1,
            total: data.total || 0,
            pages: data.last_page || 1,
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
    const { data, error } = await api.get(`/api/posts?${searchParams.toString()}`)
    
    // Transform Laravel pagination format
    if (data && !error) {
      return {
        data: {
          posts: data.data || [],
          pagination: {
            page: data.current_page || 1,
            total: data.total || 0,
            pages: data.last_page || 1,
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
    return api.post('/api/posts', data, {
      showSuccessToast: true,
      successMessage: 'Publication créée!',
    })
  }, [api])

  const likePost = useCallback(async (postId: string) => {
    return api.post(`/api/posts/${postId}/like`, {}, {
      showErrorToast: false
    })
  }, [api])

  const commentPost = useCallback(async (postId: string, content: string) => {
    return api.post(`/api/posts/${postId}/comment`, { content }, {
      showErrorToast: false
    })
  }, [api])

  const sharePost = useCallback(async (postId: string, platform?: string) => {
    return api.post(`/api/posts/${postId}/share`, { platform }, {
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
    return api.patch('/api/notifications', { notificationIds: ids })
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
