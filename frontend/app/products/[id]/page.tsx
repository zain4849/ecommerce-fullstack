"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import useBlur from "@/context/BlurContext";
import ProductCarousel from "@/components/ProductCarousel";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

const colors = [
  { name: "black", value: "black", class: "bg-black" },
  { name: "gray", value: "gray", class: "bg-gray-500" },
];

export default function ProductDetailPage() {
  const { addItem, increaseQuantity, decreaseQuantity } = useCart();
  const { isBlur } = useBlur();

  // When i visit route /products/123, param.id = 123
  const params = useParams(); // params = { id: "123" }
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState(colors[0].name);

  useEffect(() => {
    if (!params.id) return;

    api
      .get(`/products/${params.id}`)
      .then((res) => {
        // If API returns nothing, use dummy instead
        if (!res.data) {
          setProduct({
            _id: params.id!.toString(),
            name: "Dummy Product",
            description: "This is a placeholder product description.",
            price: 0,
            stock: 4,
            images: "/categories/camera.png",
          });
        } else {
          setProduct(res.data);
        }
      })
      .catch((err) => {
        console.log("Backend not ready, using dummy product...");
        setProduct({
          _id: params.id!.toString(),
          name: "Dummy Product",
          description: "This is a placeholder product description.",
          price: 0,
          stock: 100,
          images: "/categories/camera.png",
        });
      });
  }, [params.id]);

  if (!product) return <p className="text-center mt-10">Loading ...</p>;

  return (
    <div className=" p-6 mx-auto container w-full min-h-[70vh] pt-24">
      <p>
        {" "}
        Cameras / <b>Canon Camera</b>
      </p>
      <div className="flex justify-center  gap-36  h-[70vh]">
        <div className="mt-18">
          <Image
            src="/categories/camera.png"
            width={400}
            height={100}
            alt="Main Product Image"
          />
          <div className="flex mt-12 gap-12 justify-center">
            <Image
              src="/categories/camera.png"
              width={50}
              height={50}
              alt="Other images of product"
            />
            <Image
              src="/categories/camera.png"
              width={50}
              height={50}
              alt="Other images of product"
            />
            <Image
              src="/categories/camera.png"
              width={50}
              height={50}
              alt="Other images of product"
            />
            <Image
              src="/categories/camera.png"
              width={50}
              height={50}
              alt="Other images of product"
            />
          </div>
        </div>
        <div className="w-120 flex flex-col h-full gap-12">
          <div className="flex flex-col gap-4">
            <h1 className="text-[2.5rem]">Camera</h1>
            {/* Star rating */}
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={24}
                  // color={star <= rating ? "#ffc107" : "#e4e5e9"}
                />
              ))}
            </div>
            <p className="text-2xl flex items-center gap-1">
              <Image
                src="/UAE_Dirham_Symbol.svg"
                alt="UAE-Dirham"
                width={22}
                height={22}
              />
              119.99
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis, ex
              soluta ipsam similique delectus iusto reprehenderit eos iste quos
              iure cupiditate laborum dolore rerum cumque.
            </p>
          </div>
          <div>
            <hr />
            <div className="flex items-center gap-3 mt-4">
              <span>Colors: </span>
              {colors.map((color) => (
                <label key={color.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="color"
                    value={color.value}
                    className="sr-only peer"
                  />

                  <div
                    className={`
          w-4 h-4 rounded-full ${color.class}
          ring-2 ring-transparent ring-offset-2
          peer-checked:ring-black
        `}
                  />
                </label>
              ))}
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-2 mt-6">
              <Button
                size="sm"
                variant="outline"
                // onClick={() => decreaseQuantity(i.product._id)}
              >
                −
              </Button>

              {/* <span className="w-6 text-center">{i.quantity}</span> */}
              <span className="w-6 text-center">3</span>
              <Button
                size="sm"
                // variant=""
                // onClick={() => increaseQuantity(i.product._id)}
                // disabled={i.quantity >= i.product.stock}
              >
                +
              </Button>
            </div>
            <Button className="mt-12 w-full" onClick={() => addItem(product)}>
              Add To Cart
            </Button>
          </div>
        </div>
      </div>
      <h2 className="text-[2rem] font-black mb-12 text-center">
        Similar Products
      </h2>
      <ProductCarousel />
    </div>
  );
}
