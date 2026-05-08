import { memo } from 'react'
import type { ItineraryDay } from '../types/trip'

interface Props {
  day: ItineraryDay
}

export const ItineraryCard = memo(function ItineraryCard({ day }: Props) {
  return (
    <article
      aria-label={`Day ${day.day}`}
      className="rounded-xl border border-gray-200 p-4 space-y-2 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-blue-600">Day {day.day}</span>
        {day.revised && (
          <span
            className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800"
            aria-label="This day was revised"
          >
            Revised
          </span>
        )}
      </div>
      <p className="font-medium text-gray-900">{day.activity}</p>
      <p className="text-sm text-gray-600">₹{day.estimatedCostINR.toLocaleString('en-IN')}</p>
      <p className="text-sm text-gray-500">{day.note}</p>
    </article>
  )
})
