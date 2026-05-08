import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ItineraryCard } from '../components/ItineraryCard'
import type { ItineraryDay } from '../types/trip'

const baseDay: ItineraryDay = {
  day: 1,
  activity: 'Visit Baga Beach',
  estimatedCostINR: 2000,
  note: 'Arrive early to avoid crowds',
  revised: false,
}

describe('ItineraryCard', () => {
  it('renders day number, activity, and cost', () => {
    render(<ItineraryCard day={baseDay} />)
    expect(screen.getByText('Day 1')).toBeInTheDocument()
    expect(screen.getByText('Visit Baga Beach')).toBeInTheDocument()
    expect(screen.getByText(/2,000/)).toBeInTheDocument()
  })

  it('shows Revised badge when revised prop is true', () => {
    render(<ItineraryCard day={{ ...baseDay, revised: true }} />)
    expect(screen.getByText('Revised')).toBeInTheDocument()
  })

  it('does not show Revised badge when revised is false', () => {
    render(<ItineraryCard day={baseDay} />)
    expect(screen.queryByText('Revised')).not.toBeInTheDocument()
  })
})
