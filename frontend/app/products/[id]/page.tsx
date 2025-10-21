"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/cart/layout";

export default function ProductDetailPage() {
  const {addItem} = useCart()

  // When i visit route /products/123, param.id = 123
  const params = useParams() // params = { id: "123" }
  const [product, setProduct] = useState<Product | null>(null)



  useEffect(() => {
    if (params.id) {
      api.get(`/products/${params.id}`) 
      .then(res => setProduct(res.data))
      .catch(err => console.log(err))
    }
  }, [params.id])

  if (!product) return <p className="text-center mt-10">Loading ...</p>

  return (
    <div className=" p-6 max-w-3xl mx-auto">
      <img src="" alt="" />
      <h1  className="mt-4 font-bold text-2xl">{product?.name}</h1>
      <p className="mt-2 text-gray-700">{product?.description}</p>
      <p className="mt-4 font-semibold text-xl">{product?.price}</p>
      <p className="mt-2 text-sm text-gray-500">{product?.stock}</p>
      <Button className="mt-4 " onClick={() => addItem(product)}>Add To Cart</Button>
    </div>
  );
}