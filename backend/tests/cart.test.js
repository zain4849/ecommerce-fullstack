import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app.js";
import Product from "../src/models/Product.js";
import Cart from "../src/models/Cart.js";

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

describe("Cart Routes", () => {
  it("should add a product to the cart", async () => {
    const product = await Product.create({ name: "CartProduct", price: 50 });
    const res = await request(app)
      .post("/api/cart")
      .send({ productId: product._id, quantity: 2 });

    expect(res.statusCode).toBe(201);
    expect(res.body.items[0].quantity).toBe(2);
  });

  it("should get cart items", async () => {
    const product = await Product.create({ name: "CartProduct", price: 50 });
    await request(app)
      .post("/api/cart")
      .send({ productId: product._id, quantity: 1 });

    const res = await request(app).get("/api/cart");
    expect(res.statusCode).toBe(200);
    expect(res.body.items.length).toBe(1);
  });
});
