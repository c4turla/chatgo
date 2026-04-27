import { Router } from "express";
import * as settingsController from "./settings.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router = Router();

router.get("/", authMiddleware, adminMiddleware, settingsController.getSettings);
router.patch("/", authMiddleware, adminMiddleware, settingsController.updateSettings);

export default router;
