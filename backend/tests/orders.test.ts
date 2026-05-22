import request from "supertest";
import jwt from "jsonwebtoken";
import { OrderStatus, PaymentStatus, Role } from "@prisma/client";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

describe("Orders API", () => {
  it("returns user orders with JWT auth", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Order User",
        email: "orders@example.com",
        passwordHash: "hash",
        role: Role.CUSTOMER,
      },
    });
    const product = await prisma.product.create({
      data: {
        name: "Headphones",
        price: "199",
        stock: 10,
      },
    });
    await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: "199",
        paymentStatus: PaymentStatus.PAID,
        status: OrderStatus.DELIVERED,
        paymentIntentId: "pi_test_1",
        items: {
          create: [{ productId: product.id, quantity: 1, priceAtPurchase: "199" }],
        },
      },
    });

    const token = jwt.sign({ id: user.id, role: Role.CUSTOMER }, process.env.JWT_SECRET as string);
    const res = await request(app).get("/api/orders").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it("blocks customer token from admin order endpoints", async () => {
    const customerToken = jwt.sign({ id: "user-id", role: Role.CUSTOMER }, process.env.JWT_SECRET as string);
    const res = await request(app).get("/api/orders/admin/all").set("Authorization", `Bearer ${customerToken}`);
    expect(res.status).toBe(403);
  });
});
