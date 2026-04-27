import { pgTable, text, timestamp, uuid, boolean, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users.js";

export const friendStatusEnum = pgEnum("friend_status", ["pending", "accepted", "blocked"]);

export const friends = pgTable("friends", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	friendId: text("friend_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	status: friendStatusEnum("status").default("pending").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messageTypeEnum = pgEnum("message_type", ["text", "image", "video", "audio"]);

export const messages = pgTable("messages", {
	id: uuid("id").defaultRandom().primaryKey(),
	senderId: text("sender_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	receiverId: text("receiver_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	content: text("content").notNull(),
	type: messageTypeEnum("type").default("text").notNull(),
	isRead: boolean("is_read").default(false).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
	sender: one(users, {
		fields: [messages.senderId],
		references: [users.id],
		relationName: "sender",
	}),
	receiver: one(users, {
		fields: [messages.receiverId],
		references: [users.id],
		relationName: "receiver",
	}),
}));

export const friendsRelations = relations(friends, ({ one }) => ({
	user: one(users, {
		fields: [friends.userId],
		references: [users.id],
		relationName: "user",
	}),
	friend: one(users, {
		fields: [friends.friendId],
		references: [users.id],
		relationName: "friend",
	}),
}));
