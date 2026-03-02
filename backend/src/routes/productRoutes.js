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
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  createProductSchema,
  objectIdParamSchema,
  updateProductSchema,
} from "../validators/productValidators.js";

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/:id", validateRequest(objectIdParamSchema, "params"), getProduct);

router.use(authMiddleware, adminMiddleware)

// Admin
router.post("/", validateRequest(createProductSchema), createProduct);
router.put(
  "/:id",
  validateRequest(objectIdParamSchema, "params"),
  validateRequest(updateProductSchema),
  updateProduct
);
router.delete("/:id", validateRequest(objectIdParamSchema, "params"), deleteProduct);

export default router;
