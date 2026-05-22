import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import { addToCart, clearCart, getCart, removeFromCart, updateCartItem } from "./cart.controller.js";
import { addToCartSchema, productIdParamSchema, updateCartItemSchema } from "./cart.validators.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getCart);
router.post("/", validateRequest(addToCartSchema), addToCart);
router.delete("/:productId", validateRequest(productIdParamSchema, "params"), removeFromCart);
router.patch(
  "/:productId",
  validateRequest(productIdParamSchema, "params"),
  validateRequest(updateCartItemSchema),
  updateCartItem,
);
router.delete("/", clearCart);

export default router;
