import { Router } from "express";
import productRoutes from "./productRoutes";
import categoryRoutes from "./categoryRoutes";
import brandRoutes from "./brandRoutes";
import userRoutes from "./userRoutes";
import authRoutes from "../auth/routes/authRoutes";
import cartRoutes from "./cartRoutes";
import orderRoutes from "./orderRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/brands", brandRoutes);
router.use("/users", userRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);

export default router;
