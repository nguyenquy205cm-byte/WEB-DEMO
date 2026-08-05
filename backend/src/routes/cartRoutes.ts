import { Router } from "express";
import * as cartController from "../controllers/cartController";
import { authMiddleware } from "../auth/middlewares/authMiddleware";
import { validateAddCartItem, validateUpdateCartItem } from "../validators/cartValidator";

const router = Router();

router.post("/add", authMiddleware, validateAddCartItem, cartController.addItem);
router.get("/", authMiddleware, cartController.getCart);
router.put("/item/:id", authMiddleware, validateUpdateCartItem, cartController.updateItem);
router.delete("/item/:id", authMiddleware, cartController.deleteItem);
router.delete("/", authMiddleware, cartController.clearCart);

export default router;
