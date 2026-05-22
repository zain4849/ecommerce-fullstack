import request from "supertest";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

const adminToken = () => jwt.sign({ id: "admin-id", role: Role.ADMIN }, process.env.JWT_SECRET as string);

describe("Products API", () => {
  it("creates and lists products with paginated shape", async () => {
    const createRes = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken()}`)
      .send({ name: "Keyboard", price: 199, stock: 10 });
    expect(createRes.status).toBe(201);
    expect(createRes.body.id).toBeDefined();

    const listRes = await request(app).get("/api/products");
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body.products)).toBe(true);
    expect(listRes.body.products.length).toBeGreaterThanOrEqual(1);
  });

  it("rejects non-admin users for admin routes", async () => {
    const customerToken = jwt.sign({ id: "customer-id", role: Role.CUSTOMER }, process.env.JWT_SECRET as string);
    const res = await request(app).post("/api/products").set("Authorization", `Bearer ${customerToken}`).send({
      name: "Should Fail",
      price: 10,
      stock: 1,
    });
    expect(res.status).toBe(403);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
