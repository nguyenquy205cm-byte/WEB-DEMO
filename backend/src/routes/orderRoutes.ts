import { Router } from "express";
import * as orderController from "../controllers/orderController";
import { authMiddleware } from "../auth/middlewares/authMiddleware";

const router = Router();

router.post("/checkout", authMiddleware, orderController.checkout);
router.get("/", authMiddleware, orderController.getOrders);
router.get("/:id", authMiddleware, orderController.getOrderById);
router.put("/:id/cancel", authMiddleware, orderController.cancelOrder);

export default router;
