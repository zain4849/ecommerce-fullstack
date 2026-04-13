import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types/cart";
import { Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { updateQuantity, removeItem } from "@/store/cartSlice";

function CartRow({ item }: { item: CartItem }) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="grid grid-cols-12 gap-4 py-12 border-b items-center">
      {/* Product */}
      <div className="col-span-5 flex gap-4">
        <Image
          src={item.product.images?.[0] ?? "/placeholder.svg"}
          alt={item.product.name}
          width={100}
          height={100}
          className=""
        />
        <div>
          <h2 className="font-medium">{item.product.name}</h2>

          {/* Variants */}
          <p className="text-sm text-muted-foreground"></p>
        </div>
      </div>

      {/* Price */}
      <div className="col-span-2">AED {item.product.price.toFixed(2)}</div>

      {/* Quantity */}
      {/* Stepper */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            dispatch(updateQuantity({ productId: item.product._id, delta: -1 }))
          }
        >
          −
        </Button>

        <span className="w-6 text-center">{item.quantity}</span>
        <Button
          size="sm"
          onClick={() =>
            dispatch(updateQuantity({ productId: item.product._id, delta: 1 }))
          }
          disabled={
            item.product.stock !== undefined &&
            item.quantity >= item.product.stock
          }
        >
          +
        </Button>
      </div>

      {/* Total */}
      <div className="col-span-2 text-right font-bold text-xl">
        AED {(item.product.price * item.quantity).toFixed(2)}
      </div>

      {/* Remove */}
      <div className="col-span-1 text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(removeItem(item.product._id))}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default CartRow;
