import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/index.js";
import * as schema from "./db/schema/index.js";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			user: schema.users,
			session: schema.sessions,
			account: schema.accounts,
			verification: schema.verifications,
		},
	}),
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: false,
				defaultValue: "user",
			},
		},
	},
	emailAndPassword: {
		enabled: true,
	},
	baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [
        "http://localhost:5173"
    ]
});
