'use client'

import useSWR from 'swr'
import { useCallback } from 'react'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error: any = new Error('An error occurred while fetching the data.')
    error.info = await res.json()
    error.status = res.status
    throw error
  }
  return res.json()
}

// Optimized hooks with SWR caching
export function useBooksOptimized(params?: {
  page?: number
  limit?: number
  category?: string
  condition?: string
  search?: string
}) {
  const searchParams = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value))
      }
    })
  }
  
  const { data, error, isLoading, mutate } = useSWR(
    `/api/books?${searchParams.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Cache pendant 5 secondes
    }
  )

  return {
    books: data?.data || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useAudiobooksOptimized(params?: {
  page?: number
  limit?: number
  category?: string
}) {
  const searchParams = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value))
      }
    })
  }
  
  const { data, error, isLoading, mutate } = useSWR(
    `/api/audiobooks?${searchParams.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  )

  return {
    audiobooks: data?.data || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useCategoriesOptimized() {
  const { data, error, isLoading } = useSWR(
    '/api/categories',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // Cache 1 minute - les catégories changent rarement
    }
  )

  return {
    categories: data?.data || [],
    isLoading,
    isError: error,
  }
}

export function usePostsOptimized(params?: {
  page?: number
  limit?: number
}) {
  const searchParams = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value))
      }
    })
  }
  
  const { data, error, isLoading, mutate } = useSWR(
    `/api/posts?${searchParams.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 3000,
    }
  )

  return {
    posts: data?.data || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    mutate,
  }
}

// Prefetch helper
export function prefetchData(url: string) {
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = url
  document.head.appendChild(link)
}
