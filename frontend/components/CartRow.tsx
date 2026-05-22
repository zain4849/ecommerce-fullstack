import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types/cart";
import { getProductId } from "@/types/product";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { updateQuantity, removeItem } from "@/store/cartSlice";

function CartRow({ item }: { item: CartItem }) {
  const dispatch = useDispatch<AppDispatch>();
  const pid = getProductId(item.product);
  const price = Number(item.product.price);
  const subtotal = price * item.quantity;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4 py-5 md:py-6 border-b border-border/60 items-center">
      {/* Product */}
      <div className="md:col-span-6 flex gap-4">
        <Link
          href={`/products/${pid}`}
          className="relative size-20 md:size-24 rounded-xl bg-gradient-to-br from-muted/40 to-muted/10 border border-border/60 flex items-center justify-center shrink-0 overflow-hidden"
        >
          <Image
            src={item.product.images?.[0] ?? "/placeholder.svg"}
            alt={item.product.name}
            width={96}
            height={96}
            className="object-contain p-2"
          />
        </Link>
        <div className="flex flex-col justify-center min-w-0">
          {item.product.brand && (
            <span className="text-[0.7rem] uppercase tracking-wider text-muted-foreground font-semibold">
              {item.product.brand}
            </span>
          )}
          <Link
            href={`/products/${pid}`}
            className="font-semibold leading-snug hover:text-primary transition-colors line-clamp-2"
          >
            {item.product.name}
          </Link>
          <button
            onClick={() => dispatch(removeItem(pid))}
            className="md:hidden mt-2 inline-flex items-center gap-1 text-xs text-sale font-medium hover:underline self-start cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            Remove
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="md:col-span-2 flex md:justify-center items-center text-sm md:text-base">
        <span className="md:hidden text-xs text-muted-foreground mr-2">
          Price:
        </span>
        AED {price.toFixed(2)}
      </div>

      {/* Quantity */}
      <div className="md:col-span-2 flex md:justify-center items-center">
        <div className="flex items-center border border-border rounded-lg overflow-hidden bg-background">
          <Button
            size="icon"
            variant="ghost"
            className="size-9 rounded-none hover:bg-muted"
            onClick={() =>
              dispatch(updateQuantity({ productId: pid, delta: -1 }))
            }
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="size-3.5" />
          </Button>
          <span className="w-10 text-center text-sm font-semibold">
            {item.quantity}
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="size-9 rounded-none hover:bg-muted"
            onClick={() =>
              dispatch(updateQuantity({ productId: pid, delta: 1 }))
            }
            disabled={
              item.product.stock !== undefined &&
              item.quantity >= item.product.stock
            }
            aria-label="Increase quantity"
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Subtotal + remove */}
      <div className="md:col-span-2 flex items-center md:justify-end gap-3">
        <span className="md:hidden text-xs text-muted-foreground">
          Subtotal:
        </span>
        <span className="font-bold md:text-lg">AED {subtotal.toFixed(2)}</span>
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex text-muted-foreground hover:text-sale"
          onClick={() => dispatch(removeItem(pid))}
          aria-label="Remove item"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export default CartRow;
