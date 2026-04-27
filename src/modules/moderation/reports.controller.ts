import { Request, Response } from "express";
import { db } from "../../db/index.js";
import { reports } from "../../db/schema/index.js";
import { eq, desc } from "drizzle-orm";

export const createReport = async (req: Request, res: Response) => {
	const reporterId = (req as any).user?.id;
	const { reportedUserId, postId, reason } = req.body;

	if (!reporterId) return res.status(401).json({ error: "Unauthorized" });

	try {
		await db.insert(reports).values({
			reporterId,
			reportedUserId,
			postId,
			reason,
		});
		res.json({ message: "Report submitted" });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getAllReports = async (req: Request, res: Response) => {
    try {
        const allReports = await db.query.reports.findMany({
            orderBy: [desc(reports.createdAt)],
            with: {
                reporter: true,
                reportedUser: true,
                post: true,
            },
        });
        res.json(allReports);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateReportStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        await db.update(reports).set({ status }).where(eq(reports.id, id));
        res.json({ message: "Report status updated" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteReport = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await db.delete(reports).where(eq(reports.id, id));
        res.json({ message: "Report deleted" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

