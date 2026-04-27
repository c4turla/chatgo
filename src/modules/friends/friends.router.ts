import { Router } from "express";
import * as friendsController from "./friends.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, friendsController.getFriends);
router.post("/request", authMiddleware, friendsController.sendFriendRequest);
router.post("/accept", authMiddleware, friendsController.acceptFriendRequest);

export default router;
