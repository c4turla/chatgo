import { db } from "./index.js";
import { users, userLocations, posts, accounts } from "./schema/index.js";
import { v4 as uuidv4 } from "uuid";
import { sql, eq } from "drizzle-orm";
import { auth } from "../auth.js";

async function seed() {
	console.log("🌱 Seeding database...");

	try {
        // 1. Create Admin Account (Catur) - Use Better Auth API for proper password hashing
        console.log("Setting up admin account...");
        const adminEmail = "catur.crh@gmail.com";
        
        // Delete existing user to avoid conflicts and ensure fresh start for admin
        await db.delete(users).where(eq(users.email, adminEmail));

        try {
            await auth.api.signUpEmail({
                body: {
                    email: adminEmail,
                    password: "Password123",
                    name: "Catur Admin",
                }
            });
            console.log("Admin account created successfully.");
        } catch (e) {
            console.log("Signup failed, checking if it was already there...");
        }

        // Promote to admin and set username
        await db.update(users)
            .set({ role: "admin", username: "caturadmin", emailVerified: true })
            .where(eq(users.email, adminEmail));

		// 2. Create other Users
		const userList = [
			{
				id: uuidv4(),
				name: "John Doe",
				username: "johndoe",
				email: "john@example.com",
				emailVerified: true,
				createdAt: new Date(),
				updatedAt: new Date(),
				gender: "male",
				age: 25,
				bio: "Adventurer and coffee lover.",
			},
			{
				id: uuidv4(),
				name: "Jane Smith",
				username: "janesmith",
				email: "jane@example.com",
				emailVerified: true,
				createdAt: new Date(),
				updatedAt: new Date(),
				gender: "female",
				age: 23,
				bio: "Digital nomad and photographer.",
			},
		];

		console.log("Creating/Updating other users...");
		for (const u of userList) {
            await db.insert(users).values(u).onConflictDoUpdate({
                target: users.email,
                set: { name: u.name, username: u.username }
            });
        }

		// 3. Create Locations (Jakarta Area)
        const allUsers = await db.select().from(users);
		const locations = allUsers.map((u, i) => ({
            userId: u.id,
            latitude: -6.17511 + (i * 0.01),
            longitude: 106.82715 + (i * 0.01),
            updatedAt: new Date(),
        }));

		console.log("Updating locations...");
		for (const loc of locations) {
            await db.insert(userLocations).values(loc).onConflictDoUpdate({
                target: userLocations.userId,
                set: { latitude: loc.latitude, longitude: loc.longitude }
            });
        }

		console.log("✅ Seeding completed successfully!");
	} catch (error) {
		console.error("❌ Seeding failed:", error);
	} finally {
		process.exit(0);
	}
}

seed();
