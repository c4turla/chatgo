import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

async function enablePostGIS() {
	const client = new pg.Client({
		connectionString: process.env.DATABASE_URL,
	});

	try {
		await client.connect();
		console.log("Connected to database...");
		await client.query("CREATE EXTENSION IF NOT EXISTS postgis;");
		console.log("PostGIS extension enabled successfully!");
	} catch (error) {
		console.error("Error enabling PostGIS:", error);
	} finally {
		await client.end();
	}
}

enablePostGIS();
