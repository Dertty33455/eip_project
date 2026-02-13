import React from 'react'

export function BookCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
      <div className="flex justify-between items-center">
        <div className="h-5 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>
    </div>
  )
}

export function AudiobookCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-8 w-8 bg-gray-200 rounded-full" />
      </div>
    </div>
  )
}

export function PostCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-20" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-4/6" />
      </div>
      <div className="flex gap-4">
        <div className="h-8 bg-gray-200 rounded w-20" />
        <div className="h-8 bg-gray-200 rounded w-20" />
        <div className="h-8 bg-gray-200 rounded w-20" />
      </div>
    </div>
  )
}

export function OrderCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-5 bg-gray-200 rounded w-32" />
        <div className="h-6 bg-gray-200 rounded w-24" />
      </div>
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="w-16 h-20 bg-gray-200 rounded" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
        <div className="flex justify-between pt-3 border-t">
          <div className="h-5 bg-gray-200 rounded w-24" />
          <div className="h-8 bg-gray-200 rounded w-32" />
        </div>
      </div>
    </div>
  )
}
