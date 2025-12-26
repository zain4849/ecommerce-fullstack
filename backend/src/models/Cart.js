import mongoose from "mongoose"

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true }, // ObjectId type (BSON type)
    items: [
      {
        // .populate("items.productId") Mongoose looks at your schema, sees that items.productId has ref: "Product", and automatically fetches those product documents.
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // ObjectId type (BSON type)
        quantity: { type: Number, required: true, min: 1, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

// {
//   "items": [
//     { "productId": ObjectId("671c23fdd25a9e57e8e3b3f2"), "quantity": 3 }
// ]

export default mongoose.model("Cart", cartSchema)
