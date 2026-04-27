import { Router } from "express";
import * as reportsController from "./reports.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router = Router();

router.post("/", authMiddleware, reportsController.createReport);

// Admin routes
router.get("/", authMiddleware, adminMiddleware, reportsController.getAllReports);
router.patch("/:id/status", authMiddleware, adminMiddleware, reportsController.updateReportStatus);
router.delete("/:id", authMiddleware, adminMiddleware, reportsController.deleteReport);

export default router;
