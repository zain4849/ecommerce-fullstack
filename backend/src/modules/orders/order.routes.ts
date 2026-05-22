import express from "express";
import { adminMiddleware, authMiddleware } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import { createOrder, getAllOrders, getAnalytics, getMyOrders, updateOrderStatus } from "./order.controller.js";
import { orderIdParamSchema, updateOrderStatusSchema } from "./order.validators.js";

const router = express.Router();

router.get("/", authMiddleware, getMyOrders);
router.post("/", authMiddleware, createOrder);
router.get("/admin/all", authMiddleware, adminMiddleware, getAllOrders);
router.get("/admin/analytics", authMiddleware, adminMiddleware, getAnalytics);
router.patch(
  "/admin/:id/status",
  authMiddleware,
  adminMiddleware,
  validateRequest(orderIdParamSchema, "params"),
  validateRequest(updateOrderStatusSchema),
  updateOrderStatus,
);

export default router;
