"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { Product } from "@/types/product";
import { fetchProducts, ProductsResponse } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { addItem } from "@/store/cartSlice";

interface FilterState {
  priceRange: [number, number];
  category: string;
  brand: string;
  inStock: boolean | null;
  searchQuery: string;
  minRating: number;
}

export default function ProductListPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen">
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mt-4" />
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-square bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 bg-gray-200 rounded animate-pulse mt-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ProductListContent />
    </Suspense>
  );
}

function ProductListContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") ?? "";
  const searchFromUrl = searchParams.get("q") ?? "";
  const dispatch = useDispatch<AppDispatch>();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    category: categoryFromUrl,
    brand: "",
    inStock: null,
    searchQuery: searchFromUrl,
    minRating: 0,
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: categoryFromUrl,
      searchQuery: searchFromUrl,
    }));
    setCurrentPage(1);
  }, [categoryFromUrl, searchFromUrl]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res: ProductsResponse = await fetchProducts({
        q: filters.searchQuery || undefined,
        category: filters.category || undefined,
        brand: filters.brand || undefined,
        minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
        maxPrice: filters.priceRange[1] < 10000 ? filters.priceRange[1] : undefined,
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
        <svg
          key={i}
          className={`w-4 h-4 ${i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
        </svg>
      ))}
    </div>
  );

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" },
    { label: "Top Rated", value: "rating" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold mb-2">
            {filters.category || "All Products"}
          </h1>
          <p className="text-gray-600">
            Showing {totalResults} products
            {filters.searchQuery && (
              <span>
                {" "}
                for &quot;<b>{filters.searchQuery}</b>&quot;
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 sticky top-20 space-y-6">
            <h2 className="text-xl font-bold">Filters</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <Input
                placeholder="Search products..."
                value={filters.searchQuery}
                onChange={(e) => {
                  setFilters({ ...filters, searchQuery: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => {
                  setFilters({ ...filters, category: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <select
                value={filters.brand}
                onChange={(e) => {
                  setFilters({ ...filters, brand: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price Range (AED)</label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]],
                    });
                    setCurrentPage(1);
                  }}
                  placeholder="Min"
                  className="w-1/2"
                />
                <span>-</span>
                <Input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      priceRange: [filters.priceRange[0], parseInt(e.target.value) || 10000],
                    });
                    setCurrentPage(1);
                  }}
                  placeholder="Max"
                  className="w-1/2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Minimum Rating</label>
              <select
                value={filters.minRating}
                onChange={(e) => {
                  setFilters({ ...filters, minRating: Number(e.target.value) });
                  setCurrentPage(1);
                }}
                className="w-full border rounded px-3 py-2"
              >
                <option value={0}>All Ratings</option>
                <option value={4}>4+ Stars</option>
                <option value={3}>3+ Stars</option>
                <option value={2}>2+ Stars</option>
                <option value={1}>1+ Stars</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Stock Status</label>
              <select
                value={filters.inStock === null ? "all" : filters.inStock ? "inStock" : "outOfStock"}
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    inStock: e.target.value === "all" ? null : e.target.value === "inStock",
                  });
                  setCurrentPage(1);
                }}
                className="w-full border rounded px-3 py-2"
              >
                <option value="all">All</option>
                <option value="inStock">In Stock</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </div>

            <Button
              onClick={() => {
                setFilters({
                  priceRange: [0, 10000],
                  category: "",
                  brand: "",
                  inStock: null,
                  searchQuery: "",
                  minRating: 0,
                });
                setCurrentPage(1);
              }}
              variant="outline"
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Products Section */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg p-4 mb-6 flex justify-between items-center flex-wrap gap-4">
            <div>
              <span className="text-sm text-gray-600">{totalResults} results</span>
            </div>
            <div className="flex gap-4 items-center">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="border rounded px-3 py-2 text-sm"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewType("grid")}
                  className={`p-2 cursor-pointer rounded ${viewType === "grid" ? "bg-accent text-white" : "bg-gray-200"}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewType("list")}
                  className={`p-2 cursor-pointer rounded ${viewType === "list" ? "bg-accent text-white" : "bg-gray-200"}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 16a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-square bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 bg-gray-200 rounded animate-pulse mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    priceRange: [0, 10000],
                    category: "",
                    brand: "",
                    inStock: null,
                    searchQuery: "",
                    minRating: 0,
                  });
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div
              className={
                viewType === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {products.map((p) => {
                const description = p.description || "High-quality product for your needs";
                const inStock = typeof p.inStock === "boolean" ? p.inStock : true;
                const rating = p.rating ?? 0;

                return viewType === "grid" ? (
                  <div
                    key={p._id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group"
                  >
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      {!inStock && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold z-10">
                          Out of Stock
                        </div>
                      )}
                      <Link href={`/products/${p._id}`}>
                        <Image
                          src={p.images?.[0] || "/placeholder.svg"}
                          alt={p.name}
                          fill
                          className="object-contain p-4 group-hover:scale-110 transition-transform"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </Link>
                    </div>
                    <div className="p-4">
                      {p.brand && (
                        <span className="text-xs text-gray-400 uppercase tracking-wide">{p.brand}</span>
                      )}
                      <Link href={`/products/${p._id}`}>
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2 hover:text-accent">{p.name}</h3>
                      </Link>
                      <p className="text-gray-600 text-xs mb-2 line-clamp-1">{description}</p>
                      <div className="flex items-center gap-1 mb-3">
                        {renderStars(rating)}
                        <span className="text-xs text-gray-500">({rating.toFixed(1)})</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-primary">AED {p.price.toFixed(2)}</span>
                      </div>
                      <Button
                        size="sm"
                        className="w-full"
                        disabled={!inStock}
                        onClick={() => dispatch(addItem(p))}
                      >
                        {inStock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    key={p._id}
                    className="bg-white rounded-lg shadow-md p-4 flex gap-4 hover:shadow-lg transition"
                  >
                    <Link href={`/products/${p._id}`} className="flex-shrink-0">
                      <div className="relative w-32 h-32 bg-gray-100 rounded">
                        <Image
                          src={p.images?.[0] || "/placeholder.svg"}
                          alt={p.name}
                          fill
                          className="object-contain p-2"
                          sizes="128px"
                        />
                      </div>
                    </Link>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {p.brand && (
                          <span className="text-xs text-gray-400 uppercase tracking-wide">{p.brand}</span>
                        )}
                        <Link href={`/products/${p._id}`}>
                          <h3 className="font-semibold mb-1 hover:text-accent">{p.name}</h3>
                        </Link>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(rating)}
                          <span className="text-xs text-gray-500">({rating.toFixed(1)})</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">AED {p.price.toFixed(2)}</span>
                        <Button disabled={!inStock} onClick={() => dispatch(addItem(p))}>
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
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded bg-white border hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1
                      ? "bg-accent text-white"
                      : "bg-white border hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded bg-white border hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
