import { useMemo } from 'react'
import type { ItineraryDay, LoadingState } from '../types/trip'
import { ItineraryCard } from './ItineraryCard'
import { SkeletonCard } from './SkeletonCard'

interface Props {
  itinerary: ItineraryDay[] | null
  loadingState: LoadingState
  error: string | null
  destination: string
}

export function ItineraryPanel({ itinerary, loadingState, error, destination }: Props) {
  const totalCost = useMemo(
    () => itinerary?.reduce((sum, day) => sum + day.estimatedCostINR, 0) ?? 0,
    [itinerary]
  )

  const mapSrc = destination
    ? `https://maps.google.com/maps?q=${encodeURIComponent(destination)}&output=embed`
    : null

  return (
    <section
      aria-label="Itinerary"
      aria-busy={loadingState === 'loading'}
      className="flex flex-col gap-4"
    >
      {mapSrc && (
        <iframe
          title={`Map of ${destination}`}
          src={mapSrc}
          className="w-full h-48 rounded-xl border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}

      <div role="status" aria-live="polite" aria-atomic="true">
        {loadingState === 'loading' && (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {loadingState === 'error' && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {loadingState === 'success' && itinerary && (
          <>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Total estimated cost:{' '}
              <span className="text-blue-600 font-semibold">
                ₹{totalCost.toLocaleString('en-IN')}
              </span>
            </p>
            <div className="space-y-3">
              {itinerary.map((day) => (
                <ItineraryCard key={day.day} day={day} />
              ))}
            </div>
          </>
        )}

        {loadingState === 'idle' && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-gray-400 text-sm">
              Fill in your trip details on the left to generate your itinerary.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
