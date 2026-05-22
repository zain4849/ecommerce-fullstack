"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "./ProductCard";
import { Product, getProductId } from "@/types/product";

const ProductCarousel = ({ products }: { products: Product[] }) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full group/carousel"
    >
      <CarouselContent className="-ml-3 md:-ml-4">
        {products.map((product) => (
          <CarouselItem
            className="pl-3 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            key={getProductId(product)}
          >
            <ProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-2 md:-left-5 size-10 bg-card border-border shadow-md hover:bg-card hover:scale-105 opacity-0 group-hover/carousel:opacity-100 transition-opacity disabled:opacity-0" />
      <CarouselNext className="-right-2 md:-right-5 size-10 bg-card border-border shadow-md hover:bg-card hover:scale-105 opacity-0 group-hover/carousel:opacity-100 transition-opacity disabled:opacity-0" />
    </Carousel>
  );
};

export default ProductCarousel;
