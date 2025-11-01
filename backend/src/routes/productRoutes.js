import express from "express";
import {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/:id", getProduct);

// Admin
router.post("/", authMiddleware, adminMiddleware, createProduct);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;
