/** Mirrors backend `productSearch.types.ts` — keep in sync when changing the suggestions API. */

export interface ProductSearchSuggestion {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  price: string;
}

export interface ProductSearchSuggestionsResponse {
  query: string;
  suggestions: ProductSearchSuggestion[];
}
