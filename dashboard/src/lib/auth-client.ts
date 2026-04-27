import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000",
    // Adding the field here helps TypeScript recognize user.role
    user: {
        additionalFields: {
            role: {
                type: "string",
            },
        },
    },
});
