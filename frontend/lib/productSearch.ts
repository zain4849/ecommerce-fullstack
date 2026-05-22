import api from "./api";
import type { ProductSearchSuggestionsResponse } from "@/types/productSearch";

export async function fetchProductSearchSuggestions(
  q: string,
  limit = 8,
): Promise<ProductSearchSuggestionsResponse> {
  const params = new URLSearchParams();
  params.set("q", q);
  params.set("limit", String(limit));
  const res = await api.get<ProductSearchSuggestionsResponse>(
    `/products/search/suggestions?${params.toString()}`,
  );
  return res.data;
}
