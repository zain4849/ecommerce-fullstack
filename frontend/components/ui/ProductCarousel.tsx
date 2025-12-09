import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import { Card, CardContent } from "./card";

const products = [
  {
    _id: 1,
    name: "Product 1",
    price: 29.99,
    image: "/categories/camera.png", // Assuming you have this image in public/images
  },
  {
    _id: 2,
    name: "Product 2",
    price: 49.99,
    image: "/categories/camera.png", // Assuming you have this image in public/images
  },
  {
    _id: 3,
    name: "Product 3",
    price: 19.99,
    image: "/categories/camera.png", // Assuming you have this image in public/images
  },
  {
    _id: 4,
    name: "Product 4",
    price: 39.99,
    image: "/categories/camera.png", // Assuming you have this image in public/images
  },
  {
    _id: 5,
    name: "Product 5",
    price: 59.99,
    image: "/categories/camera.png", // Assuming you have this image in public/images
  },
  {
    _id: 6,
    name: "Product 6",
    price: 89.99,
    image: "/categories/camera.png", // Assuming you have this image in public/images
  },
];

const ProductCarousel = () => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full "
    >
      <CarouselContent >
        {" "}
        {/*grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6*/}
        {products.map((product, i) => (
          <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/5">
            <div className="p-1">

            <Card className="border-0 hover:ring-2 transition duration-300">
              <CardContent>
                <Link key={product._id} href={`/products/${product._id}`}>
                  <div className="h-[250px] flex justify-center items-center">
                    <Image
                      src={product.image}
                      alt={product.name}
                      className=" object-cover"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="p-2 px-1 my-4">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-gray-500">${product.price}</p>
                  </div>
                </Link>
                <Button className=" mx-1" onClick={() => addItem(product)}>
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext />
      <CarouselPrevious />
    </Carousel>
  );
};

export default ProductCarousel;
