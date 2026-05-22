import request from "supertest";
import app from "../src/app.js";

describe("Stripe webhook API", () => {
  it("rejects webhook call without signature header", async () => {
    const res = await request(app).post("/api/webhook/stripe").send({ type: "payment_intent.succeeded" });
    expect(res.status).toBe(400);
  });
});
