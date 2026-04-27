import { Router } from "express";
import * as locationController from "./location.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/update", authMiddleware, locationController.updateLocation);

export default router;
