import request from "supertest";
import app from "../src/app.js";

describe("Auth API", () => {
  it("registers and logs in user", async () => {
    const registerRes = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    expect(registerRes.status).toBe(201);
    expect(registerRes.body.userData.email).toBe("test@example.com");
    expect(registerRes.headers["set-cookie"]).toBeDefined();

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.userData.email).toBe("test@example.com");
  });

  it("rate limits repeated failed login attempts", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Limiter User",
      email: "limiter@example.com",
      password: "password123",
    });

    for (let i = 0; i < 5; i++) {
      const res = await request(app).post("/api/auth/login").send({
        email: "limiter@example.com",
        password: "wrong-password",
      });
      expect([400, 429]).toContain(res.status);
    }

    const blocked = await request(app).post("/api/auth/login").send({
      email: "limiter@example.com",
      password: "wrong-password",
    });

    expect(blocked.status).toBe(429);
  });
});