import express from "express";
import { createOrder, getMyOrders } from "../controllers/orderController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Order routes
router.get("/", authMiddleware, getMyOrders);
router.post("/", authMiddleware, createOrder);

export default router;
