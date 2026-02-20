import "dotenv/config";


import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit"
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import handleStripeWebhook from "./controllers/stripeControlller.js";


// dotenv.config({ path: './backend/.env' });

const app = express();

// Rate Limiters
// Note on vercel deploment:
// express-rate-limiter stores counts in memory
// Vercel serverless = stateless
// Different requests → different instances
// Counters reset → unreliable
const generalLimiter = rateLimit({
  windowsMs: 15 * 60* 1000,// in 15 mins, we get max from each IP address no further
  max: 100, // Each IP limited to 100 req / windowMs
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many requests from this IP, please try again later",
  skipSuccessfulRequests: true,
// If response status is 2xx, it does NOT count (skip)
// Only failed logins increment the counter
})


// Stripe webhook must be registered before express.json() so Express does not consume the raw body
app.post(
  "/api/webhook/stripe",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// Middleware
app.use(express.json()); // converts incoming json bodies to objects
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}))
/*
DEFAULT
{
  origin: "*",                     // Allow requests from ANY origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
}
*/
app.use(helmet());
app.use(morgan("dev"));

// Applying rate limiters
app.use("/api/", generalLimiter)
app.use("/api/auth", authLimiter)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)
// app.use("/api/products", productRoutes);
// app.use("/api/auth", authRoutes)
// Routes placeholder
// app.get("/", (req, res) => {
//   res.send("Ecommerce API running");
// });

if (!process.env.MONGO_URI) {
  console.warn("Warning: MONGO_URI is not set. DB connection will fail.");
  process.exit(1); // Stopping the app because it can't function without a DB
}

// Connect DB + start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.error(err));
export default app
