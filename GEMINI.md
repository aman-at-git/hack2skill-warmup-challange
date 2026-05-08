Build a React + TypeScript + Vite + Tailwind app called TripFlip.
A trip planner that generates itineraries from constraints and re-plans
dynamically when disruptions happen.

## Project Structure
src/
  components/
    ConstraintForm.tsx     # Left panel inputs
    ItineraryCard.tsx      # Single day card
    ItineraryPanel.tsx     # Right panel: list of cards
    ChaosButton.tsx        # Red disruption trigger
    SkeletonCard.tsx       # Loading placeholder
  hooks/
    useGemini.ts           # Gemini API custom hook
  types/
    trip.ts                # All TypeScript interfaces
  utils/
    sanitize.ts            # Input sanitization helpers
  __tests__/
    ConstraintForm.test.tsx
    ItineraryCard.test.tsx
    useGemini.test.ts
  App.tsx
  main.tsx

## Security
- API key ONLY via import.meta.env.VITE_GEMINI_API_KEY — never hardcoded
- Create .env.example with VITE_GEMINI_API_KEY=your_key_here
- Add .env to .gitignore
- Sanitize all user inputs before sending to Gemini (strip HTML tags)
- Sanitize all Gemini response text before rendering (no dangerouslySetInnerHTML)

## TypeScript Types (src/types/trip.ts)
export interface TripConstraints {
  destination: string;
  startDate: string;
  endDate: string;
  budgetINR: number;
  travelStyle: 'adventure' | 'relaxed' | 'cultural';
  groupSize: number;
  dietaryNeeds: string;
}

export interface ItineraryDay {
  day: number;
  activity: string;
  estimatedCostINR: number;
  note: string;
  revised: boolean;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

## Google Services Usage (critical scoring dimension)
- Gemini API: use @google/generative-ai SDK, model gemini-2.0-flash
- Google Fonts: add <link> for Inter font in index.html from fonts.googleapis.com
- Google Maps: embed an <iframe> in the itinerary header showing the destination
  city using maps.google.com/maps?q={destination}&output=embed
- Use the @google/generative-ai npm package (not raw fetch)

## Gemini Integration (src/hooks/useGemini.ts)
- useGemini custom hook: accepts prompt string, returns { data, loading, error }
- On itinerary generation: prompt Gemini to return ONLY valid JSON array:
  [{ day, activity, estimatedCostINR, note, revised: false }]
- On chaos re-plan: send original itinerary + disruption description, ask Gemini
  to return updated JSON with revised:true on changed days only
- Parse with try/catch — handle malformed JSON gracefully with user-friendly error

## Efficiency
- React.memo on ItineraryCard (re-renders only when its own props change)
- useCallback on all handlers passed to child components
- useMemo on total budget calculation across itinerary days
- Show SkeletonCard placeholders while loading (not a spinner)
- Abort previous Gemini request if user submits form again before it completes

## Accessibility
- Every <input> and <select> must have an associated <label htmlFor>
- Semantic structure: <main>, <section aria-label="Trip constraints">,
  <section aria-label="Itinerary">, <article> per day card
- ChaosButton: aria-label="Describe a disruption and re-plan your trip"
- Results area: role="status" aria-live="polite" aria-atomic="true"
- Loading state: aria-busy="true" on itinerary panel while fetching
- All interactive elements keyboard navigable with visible focus rings
  (Tailwind: focus:ring-2 focus:ring-blue-500 focus:outline-none)
- Color contrast WCAG AA: use text-gray-900 on white, white on blue-600+
- Add aria-invalid="true" and aria-describedby on form fields with errors

## Code Quality
- No 'any' types — all props and state must be fully typed
- Each component under 100 lines — split if larger
- All async functions handle errors with try/catch
- No console.log in final code (use console.error for errors only)
- ESLint-clean: no unused variables, no missing dependencies in useEffect

## Testing (src/__tests__/)
Install vitest + @testing-library/react + @testing-library/user-event.

Write these 3 tests:

1. ConstraintForm.test.tsx
   - renders all 6 input fields
   - shows validation error when destination is empty and form is submitted
   - calls onSubmit with correct TripConstraints shape when valid

2. ItineraryCard.test.tsx  
   - renders day number, activity, and cost
   - shows "Revised" badge when revised prop is true
   - does NOT show badge when revised is false

3. useGemini.test.ts
   - returns loading:true immediately on call
   - returns data on successful mock response
   - returns error message on failed mock response

## UI Layout
- Two-panel layout: constraint form left (40%), itinerary right (60%)
- Top bar: "TripFlip" logo + tagline "Your plan, dynamically"
- Each itinerary card: day number, activity name, ₹ cost, note, revised badge
- Chaos modal: textarea "What changed?" + "Re-plan" button
- Footer: "Powered by Google Gemini" text

Start with ONLY:
1. Project setup with all dependencies installed
2. Type definitions in trip.ts
3. ConstraintForm component with all fields and validation
4. useGemini hook skeleton (no real API call yet)
Do not build the full app in one step.
