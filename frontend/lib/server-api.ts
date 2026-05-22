import "server-only";

const API_BASE_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ServerApiOptions extends RequestInit {
  query?: Record<string, string | number | boolean | null | undefined>;
}

function buildUrl(path: string, query?: ServerApiOptions["query"]) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === null || value === undefined || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

export async function serverApiGet<T>(path: string, options: ServerApiOptions = {}) {
  const { query, headers, ...rest } = options;
  const response = await fetch(buildUrl(path, query), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...rest,
  });

  if (!response.ok) {
    throw new Error(`Server API request failed (${response.status}) for ${path}`);
  }

  return (await response.json()) as T;
}
