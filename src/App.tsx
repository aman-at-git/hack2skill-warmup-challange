import { useState, useCallback } from 'react'
import { ConstraintForm } from './components/ConstraintForm'
import { ItineraryPanel } from './components/ItineraryPanel'
import { ChaosButton } from './components/ChaosButton'
import { useGemini } from './hooks/useGemini'
import type { TripConstraints } from './types/trip'

export default function App() {
  const [destination, setDestination] = useState('')
  const { itinerary, loadingState, error, generateItinerary, replanItinerary } = useGemini()

  const handleSubmit = useCallback(
    (constraints: TripConstraints) => {
      setDestination(constraints.destination)
      generateItinerary(constraints)
    },
    [generateItinerary]
  )

  const handleReplan = useCallback(
    (disruption: string) => {
      replanItinerary(disruption)
    },
    [replanItinerary]
  )

  const isLoading = loadingState === 'loading'

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">TripFlip</h1>
          <p className="text-sm text-gray-500">Your plan, dynamically</p>
        </div>
        <ChaosButton
          onReplan={handleReplan}
          isDisabled={!itinerary || isLoading}
        />
      </header>

      <main className="flex flex-1 overflow-hidden">
        <section
          aria-label="Trip constraints"
          className="w-2/5 border-r border-gray-200 overflow-y-auto p-6 bg-white"
        >
          <h2 className="text-base font-semibold text-gray-900 mb-4">Trip Details</h2>
          <ConstraintForm onSubmit={handleSubmit} isLoading={isLoading} />
        </section>

        <div className="w-3/5 overflow-y-auto p-6">
          <ItineraryPanel
            itinerary={itinerary}
            loadingState={loadingState}
            error={error}
            destination={destination}
          />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-3 text-center text-sm text-gray-400">
        Powered by Google Gemini
      </footer>
    </div>
  )
}
