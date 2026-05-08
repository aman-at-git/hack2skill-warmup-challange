import { useState, useCallback, type FormEvent, type ChangeEvent } from 'react'
import type { TripConstraints } from '../types/trip'

interface Props {
  onSubmit: (constraints: TripConstraints) => void
  isLoading: boolean
}

interface FormErrors {
  destination?: string
  startDate?: string
  endDate?: string
  budgetINR?: string
  groupSize?: string
}

const defaultValues: TripConstraints = {
  destination: '',
  startDate: '',
  endDate: '',
  budgetINR: 10000,
  travelStyle: 'relaxed',
  groupSize: 1,
  dietaryNeeds: '',
}

function validate(values: TripConstraints): FormErrors {
  const errors: FormErrors = {}
  if (!values.destination.trim()) errors.destination = 'Destination is required'
  if (!values.startDate) errors.startDate = 'Start date is required'
  if (!values.endDate) errors.endDate = 'End date is required'
  if (values.startDate && values.endDate && values.endDate <= values.startDate)
    errors.endDate = 'End date must be after start date'
  if (values.budgetINR <= 0) errors.budgetINR = 'Budget must be greater than 0'
  if (values.groupSize < 1) errors.groupSize = 'Group size must be at least 1'
  return errors
}

export function ConstraintForm({ onSubmit, isLoading }: Props) {
  const [values, setValues] = useState<TripConstraints>(defaultValues)
  const [errors, setErrors] = useState<FormErrors>({})

  const handleChange = useCallback(
    (field: keyof TripConstraints) =>
      (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const raw = e.target.value
        setValues((prev) => ({
          ...prev,
          [field]:
            field === 'budgetINR' || field === 'groupSize' ? Number(raw) : raw,
        }))
      },
    []
  )

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      const errs = validate(values)
      setErrors(errs)
      if (Object.keys(errs).length === 0) onSubmit(values)
    },
    [values, onSubmit]
  )

  const inputClass =
    'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 ' +
    'focus:ring-2 focus:ring-blue-500 focus:outline-none'

  const labelClass = 'block text-sm font-medium text-gray-700'

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="destination" className={labelClass}>Destination</label>
        <input
          id="destination"
          type="text"
          value={values.destination}
          onChange={handleChange('destination')}
          aria-invalid={!!errors.destination}
          aria-describedby={errors.destination ? 'destination-error' : undefined}
          className={inputClass}
          placeholder="e.g. Goa, India"
        />
        {errors.destination && (
          <p id="destination-error" role="alert" className="mt-1 text-xs text-red-600">
            {errors.destination}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="startDate" className={labelClass}>Start Date</label>
          <input
            id="startDate"
            type="date"
            value={values.startDate}
            onChange={handleChange('startDate')}
            aria-invalid={!!errors.startDate}
            aria-describedby={errors.startDate ? 'startDate-error' : undefined}
            className={inputClass}
          />
          {errors.startDate && (
            <p id="startDate-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.startDate}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="endDate" className={labelClass}>End Date</label>
          <input
            id="endDate"
            type="date"
            value={values.endDate}
            onChange={handleChange('endDate')}
            aria-invalid={!!errors.endDate}
            aria-describedby={errors.endDate ? 'endDate-error' : undefined}
            className={inputClass}
          />
          {errors.endDate && (
            <p id="endDate-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.endDate}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="budgetINR" className={labelClass}>Budget (₹)</label>
        <input
          id="budgetINR"
          type="number"
          min="1"
          value={values.budgetINR}
          onChange={handleChange('budgetINR')}
          aria-invalid={!!errors.budgetINR}
          aria-describedby={errors.budgetINR ? 'budgetINR-error' : undefined}
          className={inputClass}
        />
        {errors.budgetINR && (
          <p id="budgetINR-error" role="alert" className="mt-1 text-xs text-red-600">
            {errors.budgetINR}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="travelStyle" className={labelClass}>Travel Style</label>
        <select
          id="travelStyle"
          value={values.travelStyle}
          onChange={handleChange('travelStyle')}
          className={inputClass}
        >
          <option value="relaxed">Relaxed</option>
          <option value="adventure">Adventure</option>
          <option value="cultural">Cultural</option>
        </select>
      </div>

      <div>
        <label htmlFor="groupSize" className={labelClass}>Group Size</label>
        <input
          id="groupSize"
          type="number"
          min="1"
          value={values.groupSize}
          onChange={handleChange('groupSize')}
          aria-invalid={!!errors.groupSize}
          aria-describedby={errors.groupSize ? 'groupSize-error' : undefined}
          className={inputClass}
        />
        {errors.groupSize && (
          <p id="groupSize-error" role="alert" className="mt-1 text-xs text-red-600">
            {errors.groupSize}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="dietaryNeeds" className={labelClass}>Dietary Needs</label>
        <input
          id="dietaryNeeds"
          type="text"
          value={values.dietaryNeeds}
          onChange={handleChange('dietaryNeeds')}
          className={inputClass}
          placeholder="e.g. vegetarian, gluten-free"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white
                   hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                   focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
      >
        {isLoading ? 'Generating…' : 'Generate Itinerary'}
      </button>
    </form>
  )
}
