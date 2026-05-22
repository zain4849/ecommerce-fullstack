import React, { type ImgHTMLAttributes } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import CartRow from "@/components/CartRow";
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

describe("CartRow", () => {
  it("renders subtotal and allows remove action", () => {
    const dispatch = vi.fn();
    (useDispatch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(dispatch);

    render(
      <CartRow
        item={{
          quantity: 2,
          product: {
            id: "cm1234567890123456789012",
            name: "Wireless Mouse",
            price: "99",
            stock: 10,
            images: ["/placeholder.svg"],
          },
        }}
      />,
    );

    expect(screen.getByText(/wireless mouse/i)).toBeInTheDocument();
    expect(screen.getByText(/AED 198.00/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /remove item/i }));
    expect(dispatch).toHaveBeenCalled();
  });
});
