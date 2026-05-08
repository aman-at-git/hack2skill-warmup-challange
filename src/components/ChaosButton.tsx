import { useState, useCallback, useRef, useEffect, type KeyboardEvent } from 'react'

interface Props {
  onReplan: (disruption: string) => void
  isDisabled: boolean
}

export function ChaosButton({ onReplan, isDisabled }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [disruption, setDisruption] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen) textareaRef.current?.focus()
  }, [isOpen])

  const handleOpen = useCallback(() => setIsOpen(true), [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setDisruption('')
  }, [])

  const handleReplan = useCallback(() => {
    if (!disruption.trim()) return
    onReplan(disruption)
    handleClose()
  }, [disruption, onReplan, handleClose])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    },
    [handleClose]
  )

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        disabled={isDisabled}
        aria-label="Describe a disruption and re-plan your trip"
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white
                   hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed
                   focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors"
      >
        Chaos Button
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Describe disruption"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onKeyDown={handleKeyDown}
        >
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl mx-4">
            <h2 className="text-lg font-semibold text-gray-900">What changed?</h2>
            <textarea
              ref={textareaRef}
              value={disruption}
              onChange={(e) => setDisruption(e.target.value)}
              rows={4}
              placeholder="Describe the disruption (e.g. flight cancelled, budget reduced by ₹10,000)..."
              aria-label="Describe the disruption"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900
                         focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg
                           focus:ring-2 focus:ring-gray-400 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReplan}
                disabled={!disruption.trim()}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg
                           hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed
                           focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors"
              >
                Re-plan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
