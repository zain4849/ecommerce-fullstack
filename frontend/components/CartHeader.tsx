import React from "react";

const CartHeader = () => {
  return (
    <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-border/60 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      <div className="col-span-6">Product</div>
      <div className="col-span-2 text-center">Price</div>
      <div className="col-span-2 text-center">Quantity</div>
      <div className="col-span-2 text-right">Subtotal</div>
    </div>
  );
};

export default CartHeader;
