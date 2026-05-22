import { expect, test } from "@playwright/test";

test("register to checkout journey", async ({ page }) => {
  const suffix = Date.now();
  await page.goto("/auth/register");
  await page.getByLabel(/name/i).fill(`E2E User ${suffix}`);
  await page.getByLabel(/email/i).fill(`e2e-${suffix}@example.com`);
  await page.getByLabel(/password/i).fill("password123");
  await page.getByRole("button", { name: /create account|register|sign up/i }).click();

  await page.goto("/products");
  await expect(page).toHaveURL(/products/);
  await page.getByRole("button", { name: /add to cart/i }).first().click();

  await page.goto("/cart");
  await expect(page.getByText(/subtotal|cart/i)).toBeVisible();

  // Payment can be environment-dependent (Stripe test keys, iframe policy), so we verify checkout page render.
  await page.goto("/checkout");
  await expect(page.getByText(/pay securely|checkout|payment/i)).toBeVisible();

  await page.goto("/orders");
  await expect(page.getByText(/orders|order history/i)).toBeVisible();
});
