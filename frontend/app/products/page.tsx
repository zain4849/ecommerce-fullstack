"use client";

import { useEffect, useState, useMemo } from "react";
import { Product } from "@/types/product";
import api from "@/lib/api";
import Link from "next/link";
import useBlur from "@/context/BlurContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FilterState {
  priceRange: [number, number];
  rating: number;
  category: string;
  inStock: boolean | null;
  searchQuery: string;
}

interface SortOption {
  label: string;
  value: string;
}

export default function ProductListPage() {
  const [productss, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isBlur } = useBlur();
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    rating: 0,
    category: "",
    inStock: null,
    searchQuery: "",
  });

  const products: Product[] = [
    { _id: "1", name: "Premium Wireless Headphones", price: 129.99, images: "/categories/camera.png", inStock: true },
    { _id: "2", name: "USB-C Charging Cable", price: 19.99, images: "/categories/camera.png", inStock: true },
    { _id: "3", name: "Portable Phone Stand", price: 24.99, images: "/categories/camera.png", inStock: true },
    { _id: "4", name: "4K Webcam", price: 199.99, images: "/categories/camera.png", inStock: false },
    { _id: "5", name: "Mechanical Keyboard RGB", price: 149.99, images: "/categories/camera.png", inStock: true },
    { _id: "6", name: "Wireless Mouse", price: 49.99, images: "/categories/camera.png", inStock: true },
    { _id: "7", name: "Monitor Arm Mount", price: 89.99, images: "/categories/camera.png", inStock: true },
    { _id: "8", name: "USB Hub 3.0", price: 39.99, images: "/categories/camera.png", inStock: true },
    { _id: "9", name: "Laptop Stand", price: 59.99, images: "/categories/camera.png", inStock: true },
    { _id: "10", name: "Desk Lamp LED", price: 69.99, images: "/categories/camera.png", inStock: false },
    { _id: "11", name: "Screen Protector", price: 14.99, images: "/categories/camera.png", inStock: true },
    { _id: "12", name: "Cable Organizer", price: 22.99, images: "/categories/camera.png", inStock: true },
  ];

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  // Helper for mock rating (1-5 stars)
  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
        </svg>
      ))}
    </div>
  );

  // Get product badge based on price and availability
  const getProductBadge = (index: number, inStock: boolean) => {
    if (!inStock) return { label: "Out of Stock", color: "bg-red-500" };
    if (index < 3) return { label: "New", color: "bg-blue-500" };
    if (index % 4 === 0) return { label: "Hot", color: "bg-orange-500" };
    if (index % 3 === 0) return { label: "Sale", color: "bg-green-500" };
    return null;
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesPrice = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
      const matchesStock = filters.inStock === null || p.inStock === filters.inStock;
      const matchesRating = (p as any).rating ? (p as any).rating >= filters.rating : filters.rating === 0;
      return matchesSearch && matchesPrice && matchesStock && matchesRating;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => ((b as any).rating || 0) - ((a as any).rating || 0));
        break;
      case "newest":
      default:
        break;
    }

    return filtered;
  }, [products, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = Array.from(new Set(products.map((p) => (p as any).category || "General")));
  const sortOptions: SortOption[] = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" },
    { label: "Top Rated", value: "rating" },
  ];

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!products.length) return <p className="text-center mt-10">No products found.</p>;

  return (
    <div className={`min-h-screen bg-gray-00 ${isBlur ? "blur-[1px]" : ""}`}>
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold mb-4">Products</h1>
          <p className="text-gray-600">Showing {filteredAndSortedProducts.length} products</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 sticky top-20 space-y-6">
            <h2 className="text-xl font-bold">Filters</h2>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <Input
                placeholder="Search products..."
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                className="w-full"
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Price Range</label>
              <div className="flex gap-2 items-center">
                <Input type="number" value={filters.priceRange[0]} onChange={(e) => setFilters({ ...filters, priceRange: [parseInt(e.target.value), filters.priceRange[1]] })} placeholder="Min" className="w-1/2" />
                <span>-</span>
                <Input type="number" value={filters.priceRange[1]} onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)] })} placeholder="Max" className="w-1/2" />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">Min Rating</label>
              <select value={filters.rating} onChange={(e) => setFilters({ ...filters, rating: parseInt(e.target.value) })} className="w-full border rounded px-3 py-2">
                <option value={0}>All Ratings</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>

            {/* Stock Status */}
            <div>
              <label className="block text-sm font-medium mb-2">Stock Status</label>
              <select value={filters.inStock === null ? "all" : filters.inStock ? "inStock" : "outOfStock"} onChange={(e) => setFilters({ ...filters, inStock: e.target.value === "all" ? null : e.target.value === "inStock" })} className="w-full border rounded px-3 py-2">
                <option value="all">All</option>
                <option value="inStock">In Stock</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </div>

            {/* Reset Filters */}
            <Button onClick={() => setFilters({ priceRange: [0, 1000], rating: 0, category: "", inStock: null, searchQuery: "" })} variant="outline" className="w-full">
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Products Section */}
        <div className="lg:col-span-3">
          {/* Top Controls */}
          <div className="bg-white rounded-lg p-4 mb-6 flex justify-between items-center flex-wrap gap-4">
            <div>
              <span className="text-sm text-gray-600">{filteredAndSortedProducts.length} results</span>
            </div>
            <div className="flex gap-4 items-center">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded px-3 py-2 text-sm">
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button onClick={() => setViewType("grid")} className={`p-2 cursor-pointer rounded ${viewType === "grid" ? "bg-accent text-white" : "bg-gray-200"}`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" /></svg>
                </button>
                <button onClick={() => setViewType("list")} className={`p-2 cursor-pointer rounded ${viewType === "list" ? "bg-accent text-white" : "bg-gray-200"}`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 16a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {paginatedProducts.length === 0 ? (
            <p className="text-center py-12 text-gray-500">No products match your filters.</p>
          ) : (
            <div className={viewType === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" : "space-y-4"}>
              {paginatedProducts.map((p, idx) => {
                const description = p.description || "High-quality product for your needs";
                const inStock = typeof p.inStock === "boolean" ? p.inStock : true;
                const rating = (p as any).rating || Math.floor(Math.random() * 2) + 4;
                const badge = getProductBadge(idx, inStock);
                const discount = (p as any).discount || (idx % 2 === 0 ? Math.floor(Math.random() * 30) + 10 : 0);
                const originalPrice = discount ? (p.price / (1 - discount / 100)).toFixed(2) : null;

                return viewType === "grid" ? (
                  <div key={p._id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group">
                    {/* Image Container */}
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      {badge && <div className={`absolute top-3 right-3 ${badge.color} text-white text-xs px-3 py-1 rounded-full font-semibold z-10`}>{badge.label}</div>}
                      {originalPrice && <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold">-{discount}%</div>}
                      <Link href={`/products/${p._id}`}>
                        <Image src={p.images} alt={p.name} fill className="object-contain p-4 group-hover:scale-110 transition-transform" sizes="(max-width: 768px) 100vw, 33vw" />
                      </Link>
                    </div>

                    {/* Card Content */}
                    <div className="p-4">
                      <Link href={`/products/${p._id}`}>
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2 hover:text-accent">{p.name}</h3>
                      </Link>
                      <p className="text-gray-600 text-xs mb-2 line-clamp-1">{description}</p>
                      <div className="flex items-center gap-1 mb-3">
                        {renderStars(rating)}
                        <span className="text-xs text-gray-500">({rating})</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-primary">AED {p.price.toFixed(2)}</span>
                        {originalPrice && <span className="text-sm line-through text-gray-500">AED {originalPrice}</span>}
                      </div>
                      <Button size="sm" className="w-full" disabled={!inStock}>
                        {inStock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div key={p._id} className="bg-white rounded-lg shadow-md p-4 flex gap-4 hover:shadow-lg transition">
                    <Link href={`/products/${p._id}`} className="flex-shrink-0">
                      <div className="relative w-32 h-32 bg-gray-100 rounded">
                        <Image src={p.images} alt={p.name} fill className="object-contain p-2" sizes="128px" />
                      </div>
                    </Link>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link href={`/products/${p._id}`}>
                          <h3 className="font-semibold mb-1 hover:text-accent">{p.name}</h3>
                        </Link>
                        <p className="text-gray-600 text-sm mb-2">{description}</p>
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(rating)}
                          <span className="text-xs text-gray-500">({rating})</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold">AED {p.price.toFixed(2)}</span>
                          {originalPrice && <span className="text-sm line-through text-gray-500 ml-2">AED {originalPrice}</span>}
                        </div>
                        <Button disabled={!inStock}>{inStock ? "Add to Cart" : "Out of Stock"}</Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );

