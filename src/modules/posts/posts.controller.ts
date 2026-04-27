import { Request, Response } from "express";
import { db } from "../../db/index.js";
import { posts, postLikes, postComments } from "../../db/schema/index.js";
import { eq, desc, and } from "drizzle-orm";

export const createPost = async (req: Request, res: Response) => {
	const userId = (req as any).user?.id;
	const { caption, mediaUrl, locationName } = req.body;

	if (!userId) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	try {
		const newPost = await db.insert(posts).values({
			userId,
			caption,
			mediaUrl,
			locationName,
		}).returning();

		res.status(201).json(newPost[0]);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getFeed = async (req: Request, res: Response) => {
	try {
		const feed = await db.query.posts.findMany({
			orderBy: [desc(posts.createdAt)],
			with: {
				author: true,
			},
		});

		res.json(feed);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const allPosts = await db.query.posts.findMany({
            orderBy: [desc(posts.createdAt)],
            with: {
                author: true,
            },
        });
        res.json(allPosts);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};


export const deletePost = async (req: Request, res: Response) => {
	const userId = (req as any).user?.id;
	const { id } = req.params;

	if (!userId) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	try {
		await db.delete(posts).where(and(eq(posts.id, id), eq(posts.userId, userId)));
		res.json({ message: "Post deleted" });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

export const likePost = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const { id: postId } = req.params;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
        await db.insert(postLikes).values({ userId, postId });
        // Update like count (simplified)
        // await db.update(posts).set({ likeCount: sql`${posts.likeCount} + 1` }).where(eq(posts.id, postId));
        res.json({ message: "Liked" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const adminDeletePost = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await db.delete(posts).where(eq(posts.id, id));
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

