import "server-only";

const API_BASE_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ServerApiOptions extends RequestInit {
  query?: Record<string, string | number | boolean | null | undefined>;
}

function buildUrl(path: string, query?: ServerApiOptions["query"]) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`); // URL object

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === null || value === undefined || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

export async function serverApiGet<T>(path: string, options: ServerApiOptions = {}) {
  const { query, headers, ...rest } = options; // for fetchProductByIdServer, we don't need to pass the query, headers, and ...rest
  const response = await fetch(buildUrl(path, query), { // buildUrl is used to build the URL for the API request
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...headers, // for fetchProductByIdServer, we don't need to pass the headers
    },
    ...rest, // for fetchProductByIdServer, we don't need to pass the ...rest
  });

  if (!response.ok) {
    throw new Error(`Server API request failed (${response.status}) for ${path}`);
  }

  return (await response.json()) as T; // return the response as a JSON object
}
