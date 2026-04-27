import { Request, Response } from "express";
import { db } from "../../db/index.js";
import { friends } from "../../db/schema/index.js";
import { eq, and, or } from "drizzle-orm";

export const sendFriendRequest = async (req: Request, res: Response) => {
	const userId = (req as any).user?.id;
	const { friendId } = req.body;

	if (!userId) return res.status(401).json({ error: "Unauthorized" });

	try {
		await db.insert(friends).values({
			userId,
			friendId,
			status: "pending",
		});
		res.json({ message: "Request sent" });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

export const acceptFriendRequest = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const { requestId } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
        await db.update(friends)
            .set({ status: "accepted" })
            .where(and(eq(friends.id, requestId), eq(friends.friendId, userId)));
        res.json({ message: "Accepted" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getFriends = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
        const list = await db.select().from(friends).where(
            and(
                or(eq(friends.userId, userId), eq(friends.friendId, userId)),
                eq(friends.status, "accepted")
            )
        );
        res.json(list);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
