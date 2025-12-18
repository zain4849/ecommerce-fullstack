import React from "react";

const CartHeader = () => {
  return (
    <div className="grid grid-cols-12 gap-8 pb-2 border-b text-md font-bold text-muted-foreground">
      <div className="col-span-5">Product</div>
      <div className="col-span-2">Price</div>
      <div className="col-span-2">Quantity</div>
      <div className="col-span-2 text-right">Subtotal</div>
      <div className="col-span-1" />
    </div>
  );
};

export default CartHeader;
