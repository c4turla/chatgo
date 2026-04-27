import { Router } from "express";
import * as postsController from "./posts.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router = Router();

router.post("/", authMiddleware, postsController.createPost);
router.get("/feed", postsController.getFeed);
router.delete("/:id", authMiddleware, postsController.deletePost);
router.post("/:id/like", authMiddleware, postsController.likePost);

// Admin routes
router.get("/", authMiddleware, adminMiddleware, postsController.getAllPosts);
router.delete("/admin/:id", authMiddleware, adminMiddleware, postsController.adminDeletePost);

export default router;
