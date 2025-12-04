import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String, // Not required
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    category: String, // Not required
    images: [String], // Not required
    inStock: {type: Boolean, default: true}
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
