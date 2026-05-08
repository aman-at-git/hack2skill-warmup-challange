import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ConstraintForm } from '../components/ConstraintForm'

describe('ConstraintForm', () => {
  it('renders all 6 input fields', () => {
    render(<ConstraintForm onSubmit={vi.fn()} isLoading={false} />)
    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/budget/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/travel style/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/group size/i)).toBeInTheDocument()
  })

  it('shows validation error when destination is empty and form is submitted', async () => {
    const user = userEvent.setup()
    render(<ConstraintForm onSubmit={vi.fn()} isLoading={false} />)
    await user.click(screen.getByRole('button', { name: /generate itinerary/i }))
    expect(screen.getByText(/destination is required/i)).toBeInTheDocument()
  })

  it('calls onSubmit with correct TripConstraints shape when valid', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ConstraintForm onSubmit={onSubmit} isLoading={false} />)

    await user.type(screen.getByLabelText(/destination/i), 'Goa')
    await user.type(screen.getByLabelText(/start date/i), '2025-06-01')
    await user.type(screen.getByLabelText(/end date/i), '2025-06-07')
    await user.clear(screen.getByLabelText(/budget/i))
    await user.type(screen.getByLabelText(/budget/i), '50000')
    await user.clear(screen.getByLabelText(/group size/i))
    await user.type(screen.getByLabelText(/group size/i), '2')
    await user.click(screen.getByRole('button', { name: /generate itinerary/i }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        destination: 'Goa',
        budgetINR: 50000,
        groupSize: 2,
      })
    )
  })
})
