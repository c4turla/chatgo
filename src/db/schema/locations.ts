import { pgTable, text, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const userLocations = pgTable("user_locations", {
	userId: text("user_id")
		.primaryKey()
		.references(() => users.id, { onDelete: "cascade" }),
	latitude: doublePrecision("latitude").notNull(),
	longitude: doublePrecision("longitude").notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
