import { Request, Response } from "express";
import { db } from "../../db/index.js";
import { users, userLocations } from "../../db/schema/index.js";
import { eq, sql } from "drizzle-orm";

export const getMe = async (req: Request, res: Response) => {
	// Better Auth session should be handled by a middleware
    // For now, let's assume we have a way to get the user id
    const userId = (req as any).user?.id;
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

	try {
		const user = await db.query.users.findFirst({
			where: eq(users.id, userId),
		});

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json(user);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

export const updateProfile = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const { username, bio, gender, age } = req.body;

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        await db.update(users)
            .set({ username, bio, gender, age, updatedAt: new Date() })
            .where(eq(users.id, userId));

        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.id, id),
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getNearbyUsers = async (req: Request, res: Response) => {
    const { latitude, longitude, radius = 5000 } = req.query; // radius in meters

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    try {
        const nearby = await db.execute(sql`
            SELECT u.*, 
                (6371 * acos(cos(radians(${latitude})) * cos(radians(ul.latitude)) * cos(radians(ul.longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(ul.latitude)))) AS distance
            FROM "user" u
            JOIN user_locations ul ON u.id = ul.user_id
            WHERE (6371 * acos(cos(radians(${latitude})) * cos(radians(ul.latitude)) * cos(radians(ul.longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(ul.latitude)))) < ${Number(radius) / 1000}
            ORDER BY distance ASC
        `);

        res.json(nearby.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const allUsers = await db.select().from(users).orderBy(users.createdAt);
        res.json(allUsers);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateUserRole = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, id));
        res.json({ message: "User role updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await db.delete(users).where(eq(users.id, id));
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
