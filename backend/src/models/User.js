import mongoose from "mongoose";


// The _id field is already the primary key, even though you don’t see it in your schema.
// You can’t replace the _id field as the primary key (MongoDB requires that).
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema)