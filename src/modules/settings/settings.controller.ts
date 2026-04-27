import { Request, Response } from "express";
import { db } from "../../db/index.js";
import { settings } from "../../db/schema/index.js";
import { sql } from "drizzle-orm";

export const getSettings = async (req: Request, res: Response) => {
    try {
        const allSettings = await db.select().from(settings);
        // Convert array to object { [key]: value }
        const settingsMap = allSettings.reduce((acc, curr) => ({
            ...acc,
            [curr.key]: curr.value
        }), {});
        res.json(settingsMap);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch settings" });
    }
};

export const updateSettings = async (req: Request, res: Response) => {
    const updates = req.body; // { key: value, key2: value2 }

    try {
        const queries = Object.entries(updates).map(([key, value]) => {
            return db.insert(settings)
                .values({ key, value: String(value) })
                .onConflictDoUpdate({
                    target: settings.key,
                    set: { value: String(value), updatedAt: new Date() }
                });
        });

        await Promise.all(queries);
        res.json({ message: "Settings updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update settings" });
    }
};
