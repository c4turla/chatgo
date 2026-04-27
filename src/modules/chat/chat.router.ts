import { Router } from "express";
import * as chatController from "./chat.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router = Router();

router.get("/me", authMiddleware, chatController.getMyMessages);

// Admin routes
router.get("/", authMiddleware, adminMiddleware, chatController.getAllMessages);
router.delete("/:id", authMiddleware, adminMiddleware, chatController.deleteMessage);

export default router;
