import React from "react";
import { render, screen } from "@testing-library/react";
import CheckoutForm from "@/components/CheckoutForm";

vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
}));

vi.mock("@stripe/react-stripe-js", () => ({
  PaymentElement: () => <div data-testid="payment-element" />,
  useStripe: () => ({}),
  useElements: () => ({}),
}));

describe("CheckoutForm", () => {
  it("renders payment element and submit button", () => {
    render(<CheckoutForm />);
    expect(screen.getByTestId("payment-element")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /pay securely/i })).toBeInTheDocument();
  });
});
