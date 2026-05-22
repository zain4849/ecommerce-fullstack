/** Stable JSON shape for `/products/search/suggestions` — keep stable when swapping to Elasticsearch. */
export interface ProductSearchSuggestionDTO {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  /** Serialized decimal string for display, e.g. "99.00" */
  price: string;
}

export interface ProductSearchSuggestionsResponseDTO {
  query: string;
  suggestions: ProductSearchSuggestionDTO[];
}
