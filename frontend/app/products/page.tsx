"use client";

import { Suspense, useEffect, useState, useCallback, useMemo } from "react";
import { Product, getProductId } from "@/types/product";
import { fetchProducts, ProductsResponse } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { addItem } from "@/store/cartSlice";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Grid3X3,
  List as ListIcon,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterState {
  priceRange: [number, number];
  category: string;
  brand: string;
  inStock: boolean | null;
  searchQuery: string;
  minRating: number;
}

const DEFAULT_FILTERS: FilterState = {
  priceRange: [0, 10000],
  category: "",
  brand: "",
  inStock: null,
  searchQuery: "",
  minRating: 0,
};

export default function ProductListPage() {
  return (
    <Suspense fallback={<ProductListSkeleton />}>
      <ProductListContent />
    </Suspense>
  );
}

function ProductListSkeleton() { // This is the skeleton that is displayed while the products are loading
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-9 w-64 bg-muted rounded animate-pulse" />
          <div className="h-4 w-40 bg-muted rounded animate-pulse mt-3" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-card border border-border/60 rounded-2xl p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl border border-border/60 overflow-hidden"
            >
              <div className="aspect-square bg-muted animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                <div className="h-9 bg-muted rounded animate-pulse mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductListContent() { // This is the main component that fetches the products and displays them
  const searchParams = useSearchParams(); // It doesn't consider what page I'm in, it just gets the search params from the url if they match
  const categoryFromUrl = searchParams.get("category") ?? ""; // http://localhost:3000/products?category=electronics&sort=newest
  const searchFromUrl = searchParams.get("q") ?? ""; // http://localhost:3000/products?q=iphone&sort=newest
  const brandFromUrl = searchParams.get("brand") ?? "";
  const sortFromUrl = searchParams.get("sort") ?? "newest";
  const dispatch = useDispatch<AppDispatch>();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>(sortFromUrl);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    category: categoryFromUrl,
    brand: brandFromUrl,
    searchQuery: searchFromUrl,
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: categoryFromUrl,
      brand: brandFromUrl,
      searchQuery: searchFromUrl,
    }));
    setCurrentPage(1);
  }, [categoryFromUrl, searchFromUrl, brandFromUrl]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res: ProductsResponse = await fetchProducts({
        q: filters.searchQuery || undefined,
        category: filters.category || undefined,
        brand: filters.brand || undefined,
        minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
        maxPrice:
          filters.priceRange[1] < 10000 ? filters.priceRange[1] : undefined,
        minRating: filters.minRating > 0 ? filters.minRating : undefined,
        inStock: filters.inStock,
        sort: sortBy !== "newest" ? sortBy : undefined,
        page: currentPage,
        limit: 12,
      });
      setProducts(res.products);
      setTotalPages(res.totalPages);
      setTotalResults(res.total);
      setBrands(res.brands);
      setCategories(res.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, currentPage]);

  useEffect(() => {
    const timer = setTimeout(loadProducts, 300);
    return () => clearTimeout(timer);
  }, [loadProducts]);

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground/30",
          )}
        />
      ))}
    </div>
  );

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" },
    { label: "Top Rated", value: "rating" },
  ];

  const activeChips = useMemo(() => {
    const chips: { label: string; clear: () => void }[] = [];
    if (filters.category)
      chips.push({
        label: `Category: ${filters.category}`,
        clear: () => setFilters((f) => ({ ...f, category: "" })),
      });
    if (filters.brand)
      chips.push({
        label: `Brand: ${filters.brand}`,
        clear: () => setFilters((f) => ({ ...f, brand: "" })),
      });
    if (filters.minRating > 0)
      chips.push({
        label: `${filters.minRating}+ Stars`,
        clear: () => setFilters((f) => ({ ...f, minRating: 0 })),
      });
    if (filters.inStock !== null)
      chips.push({
        label: filters.inStock ? "In Stock" : "Out of Stock",
        clear: () => setFilters((f) => ({ ...f, inStock: null })),
      });
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000)
      chips.push({
        label: `AED ${filters.priceRange[0]} – ${filters.priceRange[1]}`,
        clear: () => setFilters((f) => ({ ...f, priceRange: [0, 10000] })),
      });
    return chips;
  }, [filters]);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const filterPanel = (
    <div className="bg-card rounded-2xl border border-border/60 p-5 md:p-6 space-y-6 lg:sticky lg:top-24">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold flex items-center gap-2">
          <SlidersHorizontal className="size-4" />
          Filters
        </h2>
        <button
          onClick={resetFilters}
          className="text-xs font-semibold text-primary hover:text-accent cursor-pointer"
        >
          Reset all
        </button>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wide text-muted-foreground">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={filters.searchQuery}
            onChange={(e) => {
              setFilters({ ...filters, searchQuery: e.target.value });
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wide text-muted-foreground">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => {
            setFilters({ ...filters, category: e.target.value });
            setCurrentPage(1);
          }}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wide text-muted-foreground">
          Brand
        </label>
        <select
          value={filters.brand}
          onChange={(e) => {
            setFilters({ ...filters, brand: e.target.value });
            setCurrentPage(1);
          }}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wide text-muted-foreground">
          Price Range (AED)
        </label>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) => {
              setFilters({
                ...filters,
                priceRange: [
                  parseInt(e.target.value) || 0,
                  filters.priceRange[1],
                ],
              });
              setCurrentPage(1);
            }}
            placeholder="Min"
            className="w-1/2"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) => {
              setFilters({
                ...filters,
                priceRange: [
                  filters.priceRange[0],
                  parseInt(e.target.value) || 10000,
                ],
              });
              setCurrentPage(1);
            }}
            placeholder="Max"
            className="w-1/2"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wide text-muted-foreground">
          Minimum Rating
        </label>
        <div className="flex flex-wrap gap-2">
          {[0, 4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => {
                setFilters({ ...filters, minRating: r });
                setCurrentPage(1);
              }}
              className={cn(
                "px-3 py-1.5 rounded-full border text-xs font-medium transition cursor-pointer",
                filters.minRating === r
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:border-primary/40",
              )}
            >
              {r === 0 ? "Any" : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wide text-muted-foreground">
          Availability
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { v: null as null | boolean, l: "All" },
            { v: true as null | boolean, l: "In Stock" },
            { v: false as null | boolean, l: "Out of Stock" },
          ].map((opt) => (
            <button
              key={String(opt.v)}
              onClick={() => {
                setFilters({ ...filters, inStock: opt.v });
                setCurrentPage(1);
              }}
              className={cn(
                "px-3 py-1.5 rounded-full border text-xs font-medium transition cursor-pointer",
                filters.inStock === opt.v
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:border-primary/40",
              )}
            >
              {opt.l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <p className="text-xs text-muted-foreground mb-2">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/products" className="hover:text-foreground">
              Products
            </Link>
            {filters.category && (
              <>
                <span className="mx-1.5">/</span>
                <span className="text-foreground font-medium">
                  {filters.category}
                </span>
              </>
            )}
          </p>
          <h1 className="text-2xl md:text-4xl font-black mb-1">
            {filters.category || "All Products"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {totalResults.toLocaleString()} product
            {totalResults === 1 ? "" : "s"} available
            {filters.searchQuery && (
              <span>
                {" "}for &quot;<b className="text-foreground">{filters.searchQuery}</b>&quot;
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters - desktop */}
        <aside className="hidden lg:block lg:col-span-1">{filterPanel}</aside>

        {/* Mobile filter sheet */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-background overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  aria-label="Close filters"
                  className="size-9 rounded-full hover:bg-muted flex items-center justify-center cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>
              {filterPanel}
            </div>
          </div>
        )}

        {/* Products Section */}
        <div className="lg:col-span-3">
          {/* Toolbar */}
          <div className="bg-card rounded-2xl border border-border/60 p-3 md:p-4 mb-5 flex justify-between items-center flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border border-border hover:border-primary/40 cursor-pointer"
              >
                <Filter className="size-4" />
                Filters
              </button>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Showing <b className="text-foreground">{products.length}</b> of{" "}
                <b className="text-foreground">{totalResults}</b>
              </span>
            </div>
            <div className="flex gap-3 items-center">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-background border border-border rounded-lg px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Sort: {opt.label}
                  </option>
                ))}
              </select>
              <div className="flex border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewType("grid")}
                  aria-label="Grid view"
                  className={cn(
                    "p-2 cursor-pointer transition",
                    viewType === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card hover:bg-muted",
                  )}
                >
                  <Grid3X3 className="size-4" />
                </button>
                <button
                  onClick={() => setViewType("list")}
                  aria-label="List view"
                  className={cn(
                    "p-2 cursor-pointer transition border-l border-border",
                    viewType === "list"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card hover:bg-muted",
                  )}
                >
                  <ListIcon className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeChips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => {
                    chip.clear();
                    setCurrentPage(1);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 cursor-pointer"
                >
                  {chip.label}
                  <X className="size-3" />
                </button>
              ))}
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground underline-offset-2 hover:underline cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-2xl border border-border/60 overflow-hidden"
                >
                  <div className="aspect-square bg-muted animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                    <div className="h-9 bg-muted rounded animate-pulse mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-border/60">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search terms.
              </p>
              <Button variant="outline" onClick={resetFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div
              className={
                viewType === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5"
                  : "space-y-4"
              }
            >
              {products.map((p) => {
                const description =
                  p.description || "High-quality product for your needs";
                const inStock =
                  typeof p.inStock === "boolean" ? p.inStock : true;
                const rating = p.rating ?? 0;

                return viewType === "grid" ? (
                  <div
                    key={getProductId(p)}
                    className="group bg-card rounded-2xl border border-border/60 overflow-hidden hover:border-primary/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-square bg-gradient-to-br from-muted/40 to-muted/10 overflow-hidden">
                      {!inStock && (
                        <div className="absolute top-3 right-3 bg-foreground/85 text-background text-[0.7rem] px-2 py-1 rounded-md font-bold z-10">
                          Out of Stock
                        </div>
                      )}
                      <Link href={`/products/${getProductId(p)}`}>
                        <Image
                          src={p.images?.[0] || "/placeholder.svg"}
                          alt={p.name}
                          fill
                          className="object-contain p-6 group-hover:scale-110 transition-transform duration-500 ease-out"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </Link>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      {p.brand && (
                        <span className="text-[0.7rem] text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                          {p.brand}
                        </span>
                      )}
                      <Link href={`/products/${getProductId(p)}`}>
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
                          {p.name}
                        </h3>
                      </Link>
                      {rating > 0 && (
                        <div className="flex items-center gap-1.5 mb-2">
                          {renderStars(rating)}
                          <span className="text-xs text-muted-foreground">
                            ({rating.toFixed(1)})
                          </span>
                        </div>
                      )}
                      <div className="mt-auto pt-2">
                        <span className="text-lg font-bold">
                          AED {Number(p.price).toFixed(2)}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="w-full mt-3 rounded-lg"
                        disabled={!inStock}
                        onClick={() => dispatch(addItem(p))}
                      >
                        {inStock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    key={getProductId(p)}
                    className="bg-card rounded-2xl border border-border/60 p-4 md:p-5 flex flex-col sm:flex-row gap-4 md:gap-6 hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <Link
                      href={`/products/${getProductId(p)}`}
                      className="flex-shrink-0 self-center sm:self-auto"
                    >
                      <div className="relative w-32 h-32 md:w-36 md:h-36 bg-gradient-to-br from-muted/40 to-muted/10 rounded-xl overflow-hidden">
                        <Image
                          src={p.images?.[0] || "/placeholder.svg"}
                          alt={p.name}
                          fill
                          className="object-contain p-3"
                          sizes="144px"
                        />
                      </div>
                    </Link>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {p.brand && (
                          <span className="text-[0.7rem] text-muted-foreground uppercase tracking-wider font-semibold">
                            {p.brand}
                          </span>
                        )}
                        <Link href={`/products/${getProductId(p)}`}>
                          <h3 className="font-semibold text-base mb-1 hover:text-primary transition-colors">
                            {p.name}
                          </h3>
                        </Link>
                        <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                          {description}
                        </p>
                        {rating > 0 && (
                          <div className="flex items-center gap-1.5 mb-2">
                            {renderStars(rating)}
                            <span className="text-xs text-muted-foreground">
                              ({rating.toFixed(1)})
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between flex-wrap gap-3 mt-3">
                        <span className="text-xl font-bold">
                          AED {Number(p.price).toFixed(2)}
                        </span>
                        <Button
                          disabled={!inStock}
                          onClick={() => dispatch(addItem(p))}
                        >
                          {inStock ? "Add to Cart" : "Out of Stock"}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="size-10 rounded-lg bg-card border border-border hover:border-primary/40 disabled:opacity-40 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "min-w-10 h-10 px-3 rounded-lg font-medium transition cursor-pointer",
                    currentPage === i + 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border hover:border-primary/40",
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="size-10 rounded-lg bg-card border border-border hover:border-primary/40 disabled:opacity-40 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
