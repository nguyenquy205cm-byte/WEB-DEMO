import { Router } from "express";
import * as authController from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", authMiddleware, authController.profile);
router.put("/change-password", authMiddleware, authController.changePassword);

export default router;
