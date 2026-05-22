import reducer, { clearCart } from "@/store/cartSlice";

describe("cartSlice", () => {
  it("clears all cart items on clearCart fulfilled", () => {
    const state = {
      items: [
        {
          product: { id: "p1", name: "Keyboard", price: "100" },
          quantity: 2,
        },
      ],
      loading: false,
    };

    const next = reducer(state as never, clearCart.fulfilled(undefined, "req-1"));
    expect(next.items).toHaveLength(0);
  });
});
