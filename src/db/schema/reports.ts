import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users.js";
import { posts } from "./posts.js";

export const reportStatusEnum = pgEnum("report_status", ["pending", "resolved", "dismissed"]);

export const reports = pgTable("reports", {
	id: uuid("id").defaultRandom().primaryKey(),
	reporterId: text("reporter_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	reportedUserId: text("reported_user_id")
		.references(() => users.id, { onDelete: "cascade" }),
	postId: uuid("post_id")
        .references(() => posts.id, { onDelete: "cascade" }),
	reason: text("reason").notNull(),
    status: reportStatusEnum("status").default("pending").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reportsRelations = relations(reports, ({ one }) => ({
	reporter: one(users, {
		fields: [reports.reporterId],
		references: [users.id],
		relationName: "reporter",
	}),
	reportedUser: one(users, {
		fields: [reports.reportedUserId],
		references: [users.id],
		relationName: "reportedUser",
	}),
	post: one(posts, {
		fields: [reports.postId],
		references: [posts.id],
	}),
}));
