import { pgTable, text, timestamp, integer, uuid, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users.js";

export const posts = pgTable("posts", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	caption: text("caption"),
	mediaUrl: text("media_url"),
	locationName: text("location_name"),
	likeCount: integer("like_count").default(0),
	commentCount: integer("comment_count").default(0),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const postLikes = pgTable("post_likes", {
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	postId: uuid("post_id")
		.notNull()
		.references(() => posts.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
	return {
		pk: primaryKey({ columns: [table.userId, table.postId] }),
	};
});

export const postComments = pgTable("post_comments", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	postId: uuid("post_id")
		.notNull()
		.references(() => posts.id, { onDelete: "cascade" }),
	comment: text("comment").notNull(),
	parentId: uuid("parent_id"), // For replies
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
	author: one(users, {
		fields: [posts.userId],
		references: [users.id],
	}),
	likes: many(postLikes),
	comments: many(postComments),
}));

export const postLikesRelations = relations(postLikes, ({ one }) => ({
	user: one(users, {
		fields: [postLikes.userId],
		references: [users.id],
	}),
	post: one(posts, {
		fields: [postLikes.postId],
		references: [posts.id],
	}),
}));

export const postCommentsRelations = relations(postComments, ({ one }) => ({
	user: one(users, {
		fields: [postComments.userId],
		references: [users.id],
	}),
	post: one(posts, {
		fields: [postComments.postId],
		references: [posts.id],
	}),
}));
