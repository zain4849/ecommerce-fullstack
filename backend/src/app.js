import "dotenv/config";


import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import handleStripeWebhook from "./controllers/stripeControlller.js";


// dotenv.config({ path: './backend/.env' });

const app = express();

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
