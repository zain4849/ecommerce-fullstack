import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    _id: {type: String},
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    category: String,
    images: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
