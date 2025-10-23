export interface ColorSuggestion {
  name: string;
  hex: string;
  harmony: 'excellent' | 'good' | 'neutral';
}

export type AppState = 'uploading' | 'editing';