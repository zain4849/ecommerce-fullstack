"use client";

import { Product } from "@/types/product";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent } from "../components/ui/card";
import Link from "next/link";
import { Button } from "./ui/button";
export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();

  return (

      <div className="p-1">
        <Card className="border-0 hover:ring-2 transition duration-300">
          <CardContent>
            <Link key={product._id} href={`/products/${product._id}`}>
              <div className="h-[250px] flex justify-center items-center">
                <Image
                  src={product.images || "/placeholder.jpg"}
                  alt={product.name}
                  className=" object-contain"
                  width={100}
                  height={100}
                />
              </div>
              <div className="p-2 px-1 my-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-500">${product.price}</p>
              </div>
            </Link>
            <Button className=" mx-1" onClick={() => "Added"}>
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      </div>
  );
}
