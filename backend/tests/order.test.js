import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app.js";
import Product from "../src/models/Product.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe("Order Routes", () => {
  it("should create a new order", async () => {
    const product = await Product.create({ name: "OrderProduct", price: 30 });
    const res = await request(app)
      .post("/api/orders")
      .send({ items: [{ productId: product._id, quantity: 2 }] });

    expect(res.statusCode).toBe(201);
    expect(res.body.items[0].quantity).toBe(2);
  });

  it("should fetch all orders", async () => {
    const product = await Product.create({ name: "OrderProduct", price: 30 });
    await request(app)
      .post("/api/orders")
      .send({ items: [{ productId: product._id, quantity: 1 }] });

    const res = await request(app).get("/api/orders");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });
});
