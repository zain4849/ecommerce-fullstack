import { jest } from '@jest/globals';

// Mock before importing your modules!
jest.unstable_mockModule('../src/middlewares/authMiddleware.js', () => ({
  authMiddleware: (req, res, next) => next(),
  adminMiddleware: (req, res, next) => next(),
}));


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

describe("Product Routes", () => {
  it("should create a new product", async () => {
    const res = await request(app)
      .post("/api/products")
      .send({ name: "Test Product", price: 99.99, stock: 12 });

    console.log(res.statusCode, res.body);


    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe("Test Product");
  });

  it("should fetch all products", async () => {
    await Product.create({ name: "P1", price: 10, description: "Desc1" });
    await Product.create({ name: "P2", price: 20, description: "Desc2" });

    const res = await request(app).get("/api/products");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });
});
