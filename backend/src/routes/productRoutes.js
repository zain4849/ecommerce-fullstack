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

router.use(authMiddleware, adminMiddleware)

// Admin
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
