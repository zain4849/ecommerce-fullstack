import { loginSchema, registerSchema } from "../../src/modules/auth/auth.validators.js";
import { addToCartSchema, updateCartItemSchema } from "../../src/modules/cart/cart.validators.js";
import { updateOrderStatusSchema } from "../../src/modules/orders/order.validators.js";

describe("validators", () => { // this is the test suite for the validators
  it("accepts valid auth payloads", () => { // this is the test case for the validators
    expect(registerSchema.validate({ name: "Test User", email: "test@example.com", password: "password123" }).error).toBeUndefined();
    expect(loginSchema.validate({ email: "test@example.com", password: "password123" }).error).toBeUndefined();
  });

  it("rejects invalid cart payloads", () => {
    expect(addToCartSchema.validate({ productId: "bad-id", quantity: 0 }).error).toBeDefined(); // error is defined if the validation fails
    expect(updateCartItemSchema.validate({ delta: 0 }).error).toBeDefined();
  });

  it("accepts valid order status update", () => {
    expect(updateOrderStatusSchema.validate({ status: "SHIPPED" }).error).toBeUndefined();
  });
});
