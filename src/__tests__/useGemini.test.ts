import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGenerateContent = vi.hoisted(() => vi.fn())

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: mockGenerateContent,
    }),
  })),
}))

import { useGemini } from '../hooks/useGemini'

const mockConstraints = {
  destination: 'Goa',
  startDate: '2025-06-01',
  endDate: '2025-06-07',
  budgetINR: 50000,
  travelStyle: 'relaxed' as const,
  groupSize: 2,
  dietaryNeeds: '',
}

describe('useGemini', () => {
  beforeEach(() => {
    mockGenerateContent.mockReset()
  })

  it('returns loadingState loading immediately on call', () => {
    mockGenerateContent.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useGemini())

    act(() => {
      void result.current.generateItinerary(mockConstraints)
    })

    expect(result.current.loadingState).toBe('loading')
  })

  it('returns data on successful mock response', async () => {
    const mockDays = [
      { day: 1, activity: 'Beach day', estimatedCostINR: 500, note: 'Fun', revised: false },
    ]
    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify(mockDays) },
    })

    const { result } = renderHook(() => useGemini())

    await act(async () => {
      await result.current.generateItinerary(mockConstraints)
    })

    expect(result.current.loadingState).toBe('success')
    expect(result.current.itinerary).toHaveLength(1)
    expect(result.current.itinerary![0].activity).toBe('Beach day')
  })

  it('returns error message on failed mock response', async () => {
    mockGenerateContent.mockRejectedValue(new Error('API quota exceeded'))

    const { result } = renderHook(() => useGemini())

    await act(async () => {
      await result.current.generateItinerary(mockConstraints)
    })

    expect(result.current.loadingState).toBe('error')
    expect(result.current.error).toBe('API quota exceeded')
  })
})
