import React, { type ImgHTMLAttributes } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import ProductCard from "@/components/layout/product/ProductCard";
import { useDispatch } from "react-redux";

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
}));

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt || "img"} />,
}));

vi.mock("next/link", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("ProductCard", () => {
  it("renders product and dispatches add to cart on click", () => {
    const dispatch = vi.fn();
    (useDispatch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(dispatch);

    render(
      <ProductCard
        product={{ id: "cm1234567890123456789012", name: "Mechanical Keyboard", price: "399", stock: 10, inStock: true }}
      />,
    );

    expect(screen.getByText("Mechanical Keyboard")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    expect(dispatch).toHaveBeenCalled();
  });
});
