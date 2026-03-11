import React from 'react'

export function BookCardSkeleton() {
  return (
    <div className="p-4 rounded-2xl bg-white border border-cream-200/80">
      <div className="aspect-[3/4] skeleton rounded-xl mb-4" />
      <div className="h-4 skeleton rounded-full w-3/4 mb-3" />
      <div className="h-3 skeleton rounded-full w-1/2 mb-3" />
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-3.5 h-3.5 skeleton rounded-full" />
        ))}
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-cream-200/60">
        <div className="h-5 skeleton rounded-full w-20" />
        <div className="w-10 h-10 skeleton rounded-xl" />
      </div>
    </div>
  )
}

export function AudiobookCardSkeleton() {
  return (
    <div className="p-4 rounded-2xl bg-white border border-cream-200/80">
      <div className="aspect-square skeleton rounded-xl mb-4" />
      <div className="h-4 skeleton rounded-full w-3/4 mb-3" />
      <div className="h-3 skeleton rounded-full w-1/2 mb-3" />
      <div className="flex justify-between items-center">
        <div className="h-5 skeleton rounded-full w-28" />
      </div>
    </div>
  )
}

export function PostCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white border border-cream-200/80">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 skeleton rounded-full" />
        <div className="flex-1">
          <div className="h-4 skeleton rounded-full w-32 mb-2" />
          <div className="h-3 skeleton rounded-full w-20" />
        </div>
      </div>
      <div className="space-y-2.5 mb-5">
        <div className="h-3 skeleton rounded-full w-full" />
        <div className="h-3 skeleton rounded-full w-5/6" />
        <div className="h-3 skeleton rounded-full w-4/6" />
      </div>
      <div className="flex gap-4 pt-4 border-t border-cream-200/60">
        <div className="h-8 skeleton rounded-lg w-20" />
        <div className="h-8 skeleton rounded-lg w-20" />
        <div className="h-8 skeleton rounded-lg w-20" />
      </div>
    </div>
  )
}

export function OrderCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white border border-cream-200/80">
      <div className="flex justify-between items-start mb-5">
        <div className="h-5 skeleton rounded-full w-32" />
        <div className="h-6 skeleton rounded-full w-24" />
      </div>
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="w-16 h-20 skeleton rounded-xl" />
          <div className="flex-1">
            <div className="h-4 skeleton rounded-full w-3/4 mb-2" />
            <div className="h-3 skeleton rounded-full w-1/2" />
          </div>
        </div>
        <div className="flex justify-between pt-4 border-t border-cream-200/60">
          <div className="h-5 skeleton rounded-full w-24" />
          <div className="h-9 skeleton rounded-xl w-32" />
        </div>
      </div>
    </div>
  )
}
