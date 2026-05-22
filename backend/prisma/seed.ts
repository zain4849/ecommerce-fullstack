import "dotenv/config";
import bcrypt from "bcrypt";
import { Prisma, Role, PaymentStatus, OrderStatus } from "@prisma/client";
import { prisma } from "../src/lib/prisma.js";

const products = [
  { name: 'MacBook Pro 16"', description: "Apple M3 Pro chip, 18GB RAM, 512GB SSD.", price: 9299, stock: 12, category: "Laptops", brand: "Apple", images: ["/categories/laptop.png"], inStock: true, featured: true, rating: 4.8, numReviews: 156 },
  { name: "Dell XPS 15", description: "Intel i7, 16GB RAM, 1TB SSD, OLED display.", price: 6499, stock: 8, category: "Laptops", brand: "Dell", images: ["/categories/laptop.png"], inStock: true, featured: false, rating: 4.5, numReviews: 89 },
  { name: "iPhone 16 Pro Max", description: "A18 Pro chip, 256GB, titanium design.", price: 5499, stock: 20, category: "Mobile", brand: "Apple", images: ["/categories/mobile.png"], inStock: true, featured: true, rating: 4.7, numReviews: 234 },
  { name: "Sony WH-1000XM6", description: "Industry-leading noise cancellation.", price: 1399, stock: 22, category: "Audio", brand: "Sony", images: ["/categories/speakers.png"], inStock: true, featured: true, rating: 4.8, numReviews: 287 },
];

async function seed() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const [customerHash, adminHash] = await Promise.all([bcrypt.hash("password123", 10), bcrypt.hash("admin12345", 10)]);
  const [demo, admin] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Demo User",
        email: "demo@example.com",
        passwordHash: customerHash,
        role: Role.CUSTOMER,
      },
    }),
    prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@example.com",
        passwordHash: adminHash,
        role: Role.ADMIN,
      },
    }),
  ]);

  const createdProducts = await Promise.all(
    products.map((product) =>
      prisma.product.create({
        data: { ...product, price: new Prisma.Decimal(product.price) },
      }),
    ),
  );

  const cart = await prisma.cart.create({ data: { userId: demo.id } });
  await prisma.cartItem.createMany({
    data: [
      { cartId: cart.id, productId: createdProducts[0].id, quantity: 1 },
      { cartId: cart.id, productId: createdProducts[2].id, quantity: 1 },
    ],
  });

  await prisma.order.create({
    data: {
      userId: demo.id,
      totalAmount: new Prisma.Decimal(createdProducts[2].price),
      paymentStatus: PaymentStatus.PAID,
      status: OrderStatus.DELIVERED,
      paymentIntentId: "pi_seed_paid_001",
      items: {
        create: [
          {
            productId: createdProducts[2].id,
            quantity: 1,
            priceAtPurchase: createdProducts[2].price,
          },
        ],
      },
    },
  });

  console.log("Seed complete");
  console.log("Demo user: demo@example.com / password123");
  console.log("Admin user: admin@example.com / admin12345");
  console.log(`Seeded ${createdProducts.length} products`);
  await prisma.$disconnect();
  void admin;
}

seed().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
