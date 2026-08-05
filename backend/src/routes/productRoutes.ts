import { Router } from "express";
import * as productController from "../controllers/productController";
import { authMiddleware } from "../auth/middlewares/authMiddleware";
import { roleMiddleware } from "../auth/middlewares/roleMiddleware";
import { Role } from "@prisma/client";
import { validateProductPayload, validateProductUpdatePayload } from "../validators/productValidator";
import { productImageUpload } from "../middleware/uploadMiddleware";

const router = Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post(
  "/",
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  productImageUpload.array("images", 5),
  validateProductPayload,
  productController.createProduct,
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  productImageUpload.array("images", 5),
  validateProductUpdatePayload,
  productController.updateProduct,
);
router.delete("/:id", authMiddleware, roleMiddleware([Role.ADMIN]), productController.deleteProduct);

export default router;
