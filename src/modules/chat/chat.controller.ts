import { Request, Response } from "express";
import { db } from "../../db/index.js";
import { messages } from "../../db/schema/index.js";
import { eq, desc, or } from "drizzle-orm";

export const getAllMessages = async (req: Request, res: Response) => {
    try {
        const allMessages = await db.query.messages.findMany({
            orderBy: [desc(messages.createdAt)],
            with: {
                sender: true,
                receiver: true,
            },
        });
        res.json(allMessages);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMyMessages = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
        const myMessages = await db.query.messages.findMany({
            where: or(eq(messages.senderId, userId), eq(messages.receiverId, userId)),
            orderBy: [desc(messages.createdAt)],
            with: {
                sender: true,
                receiver: true,
            },
        });
        res.json(myMessages);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteMessage = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await db.delete(messages).where(eq(messages.id, id));
        res.json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
