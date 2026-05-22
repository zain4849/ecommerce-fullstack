import "dotenv/config";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import authRoutes from "./modules/auth/auth.routes.js";
import productRoutes from "./modules/products/product.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import orderRoutes from "./modules/orders/order.routes.js";
import handleStripeWebhook from "./modules/stripe/stripe.controller.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { prisma } from "./lib/prisma.js";
import { requestLogger } from "./lib/logger.js";

const app = express();
app.set("trust proxy", 1);

const configuredOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowVercelPreviews = process.env.ALLOW_VERCEL_PREVIEWS === "true";

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: "Too many requests from this IP, please try again later",
  skipSuccessfulRequests: true,
});

app.post("/api/webhook/stripe", express.raw({ type: "application/json" }), handleStripeWebhook);

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isConfiguredOrigin = configuredOrigins.includes(origin);
      const isVercelPreview = allowVercelPreviews && /^https:\/\/.*\.vercel\.app$/.test(origin);
      if (isConfiguredOrigin || isVercelPreview) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);
app.use(helmet({ hsts: process.env.NODE_ENV === "production" ? { maxAge: 31536000, includeSubDomains: true } : false }));
app.use(requestLogger);
app.use(passport.initialize());
app.use("/api/", generalLimiter);

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "ok", db: "ok" });
  } catch {
    res.status(503).json({ status: "degraded", db: "down" });
  }
});
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use(errorHandler);

export default app;
