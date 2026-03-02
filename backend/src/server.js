import "dotenv/config";

import mongoose from "mongoose";
import app from "./app.js";

if (!process.env.MONGO_URI) {
  console.warn("Warning: MONGO_URI is not set. DB connection will fail.");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
