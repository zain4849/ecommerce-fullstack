"use client";

import { Product } from "@/types/product";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProductCard({product}: {product: Product}) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/product/${product._id}`)}
      className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition cursor-pointer flex flex-col"
    >
      <div className="relative w-full h-48 mb-4">
        <Image
          src={product.images || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-contain"
        />
      </div>
      <h3 className="text-gray-800 font-semibold text-lg">{product.name}</h3>
      {/* <p className="text-gray-500 text-sm">{product.brand}</p> */}
      <p className="text-yellow-500 font-bold mt-2">${product.price}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          // handle add to cart logic here
        }}
        className="mt-auto bg-yellow-400 text-white py-2 rounded-lg hover:bg-yellow-500 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
