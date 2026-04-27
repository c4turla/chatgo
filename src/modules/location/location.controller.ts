import { Request, Response } from "express";
import { db } from "../../db/index.js";
import { userLocations } from "../../db/schema/index.js";
import { sql } from "drizzle-orm";

export const updateLocation = async (req: Request, res: Response) => {
	const userId = (req as any).user?.id;
	const { latitude, longitude } = req.body;

	if (!userId) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	try {
        // Use raw SQL for PostGIS point creation
		await db.insert(userLocations).values({
			userId,
			latitude,
			longitude,
            updatedAt: new Date(),
		}).onConflictDoUpdate({
            target: userLocations.userId,
            set: {
                latitude,
                longitude,
                updatedAt: new Date(),
            }
        });

		res.json({ message: "Location updated" });
	} catch (error) {
        console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};
