import React, { useState } from "react";
import { Button } from "./ui/button";
import CartPage from "@/app/cart/page";
import { useCart } from "@/context/CartContext";

const CheckoutButton = ({type='button'}) => {
  const [loading, setLoading] = useState(false);
  const {items} = useCart()

  const handleCheckout = () => {

  };

  return (
    <div>
      <Button onClick={handleCheckout} disabled={loading || items.length === 0}>
        {loading ? "Processing ..." : "Proceed"}
      </Button>
    </div>
  );
};

export default CheckoutButton;
