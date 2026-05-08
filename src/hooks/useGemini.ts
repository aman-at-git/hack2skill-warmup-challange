import { useState, useCallback, useRef } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { ItineraryDay, TripConstraints, LoadingState } from '../types/trip'
import { sanitizeInput, sanitizeOutput } from '../utils/sanitize'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string
const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })

interface UseGeminiReturn {
  itinerary: ItineraryDay[] | null
  loadingState: LoadingState
  error: string | null
  generateItinerary: (constraints: TripConstraints) => Promise<void>
  replanItinerary: (disruption: string) => Promise<void>
}

export function useGemini(): UseGeminiReturn {
  const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(null)
  const [loadingState, setLoadingState] = useState<LoadingState>('idle')
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const currentItineraryRef = useRef<ItineraryDay[] | null>(null)

  const callGemini = useCallback(async (prompt: string): Promise<void> => {
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoadingState('loading')
    setError(null)

    try {
      const result = await model.generateContent(prompt)

      if (controller.signal.aborted) return

      const text = result.response.text()
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) throw new Error('No JSON array found in response')

      const parsed: unknown = JSON.parse(jsonMatch[0])
      if (!Array.isArray(parsed)) throw new Error('Response is not an array')

      const days: ItineraryDay[] = parsed.map((item: unknown) => {
        if (typeof item !== 'object' || item === null) throw new Error('Invalid day object')
        const d = item as Record<string, unknown>
        return {
          day: Number(d.day),
          activity: sanitizeOutput(String(d.activity ?? '')),
          estimatedCostINR: Number(d.estimatedCostINR ?? 0),
          note: sanitizeOutput(String(d.note ?? '')),
          revised: Boolean(d.revised),
        }
      })

      currentItineraryRef.current = days
      setItinerary(days)
      setLoadingState('success')
    } catch (err: unknown) {
      if (controller.signal.aborted) return
      const message = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(message)
      setLoadingState('error')
    }
  }, [])

  const generateItinerary = useCallback(async (constraints: TripConstraints): Promise<void> => {
    const prompt = `Generate a day-by-day travel itinerary for the following trip:
Destination: ${sanitizeInput(constraints.destination)}
Start: ${constraints.startDate}, End: ${constraints.endDate}
Budget: ₹${constraints.budgetINR}
Style: ${constraints.travelStyle}
Group size: ${constraints.groupSize}
Dietary needs: ${sanitizeInput(constraints.dietaryNeeds)}

Return ONLY a valid JSON array with no markdown, no explanation:
[{ "day": 1, "activity": "...", "estimatedCostINR": 1000, "note": "...", "revised": false }]`
    await callGemini(prompt)
  }, [callGemini])

  const replanItinerary = useCallback(async (disruption: string): Promise<void> => {
    if (!currentItineraryRef.current) return
    const prompt = `Here is the current travel itinerary:
${JSON.stringify(currentItineraryRef.current)}

A disruption has occurred: ${sanitizeInput(disruption)}

Update the itinerary to handle this disruption. Set "revised": true ONLY on days that changed.
Return ONLY a valid JSON array with no markdown, no explanation:
[{ "day": 1, "activity": "...", "estimatedCostINR": 1000, "note": "...", "revised": false }]`
    await callGemini(prompt)
  }, [callGemini])

  return { itinerary, loadingState, error, generateItinerary, replanItinerary }
}
