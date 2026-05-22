import express from "express";
import { adminMiddleware, authMiddleware } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  getProductSearchSuggestions,
  updateProduct,
} from "./product.controller.js";
import { createProductSchema, productIdParamSchema, updateProductSchema } from "./product.validators.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/search/suggestions", getProductSearchSuggestions);
router.get("/:id", validateRequest(productIdParamSchema, "params"), getProduct);

router.use(authMiddleware, adminMiddleware);
router.post("/", validateRequest(createProductSchema), createProduct);
router.put("/:id", validateRequest(productIdParamSchema, "params"), validateRequest(updateProductSchema), updateProduct);
router.delete("/:id", validateRequest(productIdParamSchema, "params"), deleteProduct);

export default router;
