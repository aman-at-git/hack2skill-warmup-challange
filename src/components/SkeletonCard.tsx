import { memo } from 'react'

export const SkeletonCard = memo(function SkeletonCard() {
  return (
    <article
      aria-hidden="true"
      className="animate-pulse rounded-xl border border-gray-200 p-4 space-y-3 bg-white"
    >
      <div className="h-4 w-1/4 bg-gray-200 rounded" />
      <div className="h-3 w-3/4 bg-gray-200 rounded" />
      <div className="h-3 w-1/2 bg-gray-200 rounded" />
      <div className="h-3 w-2/3 bg-gray-200 rounded" />
    </article>
  )
})
