"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetchProductSearchSuggestions } from "@/lib/productSearch";
import type { ProductSearchSuggestion } from "@/types/productSearch";
const DEBOUNCE_MS = 280;
const MIN_CHARS = 2;
const SUGGEST_LIMIT = 8;

export default function NavBarSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ProductSearchSuggestion[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < MIN_CHARS) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let cancelled = false;
    const t = setTimeout(() => {
      fetchProductSearchSuggestions(q, SUGGEST_LIMIT)
        .then((res) => {
          if (!cancelled) setSuggestions(res.suggestions);
        })
        .catch(() => {
          if (!cancelled) setSuggestions([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(t);
      setLoading(false);
    };
  }, [searchQuery]);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = searchQuery.trim();
      if (!q) return;
      setOpen(false);
      router.push(`/products?q=${encodeURIComponent(q)}`);
    },
    [router, searchQuery],
  );

  const trimmed = searchQuery.trim();
  const showPanel = open && trimmed.length >= MIN_CHARS;
  const qEncoded = encodeURIComponent(trimmed);

  return (
    <div ref={wrapRef} className="relative w-full max-w-[60%]">
      <form onSubmit={handleSubmit}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
        <Input
          type="search"
          placeholder="Search products..."
          value={searchQuery}
          autoComplete="off"
          aria-expanded={showPanel}
          aria-controls="navbar-search-results"
          aria-autocomplete="list"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          className="py-6 pl-13 rounded-[1.15rem] bg-white text-foreground placeholder:text-gray-400"
        />
      </form>

      {showPanel && (
        <div
          id="navbar-search-results"
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1 z-[200] rounded-[1rem] border bg-white text-foreground shadow-lg overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Searching…
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="max-h-[min(70vh,22rem)] overflow-y-auto py-1">
              {suggestions.map((s) => (
                <li key={s.id} role="option">
                  <Link
                    href={`/products/${s.id}`}
                    className="flex gap-3 px-3 py-2 hover:bg-gray-100 items-center"
                    onClick={() => setOpen(false)}
                  >
                    <div className="relative h-12 w-12 shrink-0 rounded-md bg-gray-50 overflow-hidden">
                      <Image
                        src={s.imageUrl || "/placeholder.svg"}
                        alt=""
                        fill
                        className="object-contain p-1"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{s.title}</p>
                      {s.subtitle && (
                        <p className="text-xs text-muted-foreground truncate">{s.subtitle}</p>
                      )}
                      <p className="text-sm text-gray-600">AED {Number(s.price).toFixed(2)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">
              No quick matches. You can still browse all results below.
            </p>
          )}

          <div className="border-t bg-gray-50">
            <Link
              href={`/products?q=${qEncoded}`}
              className="block px-4 py-3 text-sm font-medium text-center hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              View all results for &quot;{trimmed}&quot;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
