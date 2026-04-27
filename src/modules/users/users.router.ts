import { Router } from "express";
import * as usersController from "./users.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router = Router();

router.get("/me", authMiddleware, usersController.getMe);
router.get("/nearby", usersController.getNearbyUsers);
router.put("/update", authMiddleware, usersController.updateProfile);
router.get("/:id", usersController.getUserById);

// Admin routes
router.get("/", authMiddleware, adminMiddleware, usersController.getAllUsers);
router.patch("/:id/role", authMiddleware, adminMiddleware, usersController.updateUserRole);
router.delete("/:id", authMiddleware, adminMiddleware, usersController.deleteUser);

export default router;
