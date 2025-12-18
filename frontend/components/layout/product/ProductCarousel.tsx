"use client";

import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product";
// const [products, setProducts] = useState([]);

const productss: Product[] = [
  {
    _id: "1",
    name: "Product 1",
    price: 29.99,
    images: "/categories/camera.png",
    inStock: true,
  },
  {
    _id: "2",
    name: "Product 2",
    price: 49.99,
    images: "/categories/camera.png",
    inStock: true,
  },
  {
    _id: "3",
    name: "Product 3",
    price: 19.99,
    images: "/categories/camera.png",
    inStock: true,
  },
  {
    _id: "4",
    name: "Product 4",
    price: 39.99,
    images: "/categories/camera.png",
    inStock: true,
  },
  {
    _id: "5",
    name: "Product 5",
    price: 59.99,
    images: "/categories/camera.png",
    inStock: true,
  },
  {
    _id: "6",
    name: "Product 6",
    price: 89.99,
    images: "/categories/camera.png",
    inStock: true,
  },
];

const ProductCarousel = ({ products }: { products: Product[] }) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full "
    >
      <CarouselContent>
        {" "}
        {/*grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6*/}
        {productss.map((product, i) => (
          <CarouselItem
            className="md:basis-1/2 lg:basis-1/5"
            key={i}
            // onClick={() => router.push(`/product/${product._id}`)}
          >
            <ProductCard key={i} product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext />
      <CarouselPrevious />
    </Carousel>
  );
};

export default ProductCarousel;
