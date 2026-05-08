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

export interface GeminiState {
  itinerary: ItineraryDay[] | null;
  loadingState: LoadingState;
  error: string | null;
}
