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
import { Product } from "@/types/product";

const ProductCarousel = ({ products }: { products: Product[] }) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent>
        {products.map((product, i) => (
          <CarouselItem className="md:basis-1/2 lg:basis-1/5" key={product._id}>
            <ProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext className="right-[-8px] md:right-[-18px] bg-background/90 border-border hover:bg-background" />
      <CarouselPrevious className="left-[-8px] md:left-[-18px] bg-background/90 border-border hover:bg-background" />
    </Carousel>
  );
};

export default ProductCarousel;
