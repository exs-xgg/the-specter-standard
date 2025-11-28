export interface QuoteResponse {
  text: string;
  topic?: string;
}

export interface AdviceResponse {
  advice: string;
  strategy: string;
}

export enum ViewState {
  HOME = 'HOME',
  QUOTES = 'QUOTES',
  ADVICE = 'ADVICE',
  SAVED = 'SAVED',
}

export interface SavedQuote extends QuoteResponse {
  id: string;
  savedAt: number;
}

export interface GeminError {
  message: string;
}