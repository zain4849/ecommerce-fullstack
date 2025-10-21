import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
// import productRoutes from "./routes/productRoutes.js";
// import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
// app.use("/api/products", productRoutes);
// app.use("/api/auth", authRoutes)
// Routes placeholder
app.get("/", (req, res) => {
  res.send("Ecommerce API running");
});

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
