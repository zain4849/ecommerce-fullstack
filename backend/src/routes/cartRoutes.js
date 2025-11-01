import express from "express";
import {
  authMiddleware,
  // adminMiddleware,
} from "../middlewares/authMiddleware.js";
import {
  getCart,
  addToCart,
  clearCart,
  removeFromCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.use(authMiddleware); // Is ran first, has next() inside it so the routes below are run when we hit /auth endpoint

router.get("/", getCart);
router.post("/", addToCart);
router.delete("/:productId", removeFromCart);
router.delete("/", clearCart);

export default router;
