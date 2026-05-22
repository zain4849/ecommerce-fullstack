import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/ecommerce_test";
process.env.JWT_SECRET = "test-secret";
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

beforeAll(() => {
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL,
    },
  });
});

beforeEach(async () => {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
