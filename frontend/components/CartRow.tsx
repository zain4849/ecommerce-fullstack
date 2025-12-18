import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { CartItem } from "@/types/cart";

function CartRow({ item }: { item: CartItem }) {
  return (
    <div className="grid grid-cols-12 gap-4 py-12 border-b items-center">
      {/* Product */}
      <div className="col-span-5 flex gap-4">
        <Image
          src={item.product.images ?? "/placeholder.png"}
          alt={item.product.name}
          width={100}
          height={100}
          className=""
        />
        <div>
          <h2 className="font-medium">{item.product.name}</h2>

          {/* Variants */}
          <p className="text-sm text-muted-foreground">
            {/* Color: {item.product.color} • Size: {item.product.size} */}
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="col-span-2">${item.product.price.toFixed(2)}</div>

      {/* Quantity */}
      {/* Stepper */}
      <div className="flex items-center gap-2">
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

      {/* Total */}
      <div className="col-span-3 text-right font-bold text-xl">
        ${(item.product.price * item.quantity).toFixed(2)}
      </div>

      {/* Remove */}
      {/* <div className="col-span-1 text-right"></div> */}
      {/* <Button
        variant="ghost"
        size="icon"
        // onClick={() => removeItem(item.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button> */}
    </div>
  );
}

export default CartRow;
