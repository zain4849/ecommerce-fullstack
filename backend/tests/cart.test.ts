import request from "supertest";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

describe("Cart API", () => {
  it("adds and fetches cart", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Cart User",
        email: "cart@example.com",
        passwordHash: "hash",
        role: Role.CUSTOMER,
      },
    });
    const product = await prisma.product.create({
      data: {
        name: "Mouse",
        price: "99",
        stock: 10,
      },
    });

    const token = jwt.sign({ id: user.id, role: Role.CUSTOMER }, process.env.JWT_SECRET as string);
    const addRes = await request(app).post("/api/cart").set("Authorization", `Bearer ${token}`).send({
      productId: product.id,
      quantity: 1,
    });
    expect(addRes.status).toBe(200);

    const getRes = await request(app).get("/api/cart").set("Authorization", `Bearer ${token}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.items.length).toBe(1);
  });
});
