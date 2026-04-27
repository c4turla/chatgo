import express from "express";
import cors from "cors";
import helmet from "helmet";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import usersRouter from "./modules/users/users.router.js";
import postsRouter from "./modules/posts/posts.router.js";
import locationRouter from "./modules/location/location.router.js";
import friendsRouter from "./modules/friends/friends.router.js";
import reportsRouter from "./modules/moderation/reports.router.js";
import settingsRouter from "./modules/settings/settings.router.js";
import chatRouter from "./modules/chat/chat.router.js";
import { db } from "./db/index.js";
import { users, posts, messages, reports } from "./db/schema/index.js";
import { count } from "drizzle-orm";

const app = express();

app.use(cors({
	origin: "http://localhost:5173",
	credentials: true,
}));
app.use(helmet());
app.use(express.json());

// Better Auth handler
app.use("/api/auth", toNodeHandler(auth));

// API Routes
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/location", locationRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/chat", chatRouter);

// Dashboard Stats
app.get("/api/stats", async (req, res) => {
	try {
		const [userCount] = await db.select({ value: count() }).from(users);
		const [postCount] = await db.select({ value: count() }).from(posts);
		const [messageCount] = await db.select({ value: count() }).from(messages);
		const [reportCount] = await db.select({ value: count() }).from(reports);

		res.json({
			users: userCount.value,
			posts: postCount.value,
			messages: messageCount.value,
			reports: reportCount.value,
		});
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

// Health check
app.get("/health", (req, res) => {
	res.json({ status: "ok" });
});

export default app;
