import { db } from "./index.js";
import { users, accounts } from "./schema/index.js";
import { eq } from "drizzle-orm";

async function checkUser() {
    const email = "catur.crh@gmail.com";
    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (!user) {
        console.log("User not found!");
    } else {
        console.log("User found:", user);
        const account = await db.query.accounts.findFirst({
            where: eq(accounts.userId, user.id)
        });
        if (!account) {
            console.log("Account (credentials) not found for this user!");
        } else {
            console.log("Account found:", { ...account, password: "[REDACTED]" });
        }
    }
    process.exit(0);
}

checkUser();
