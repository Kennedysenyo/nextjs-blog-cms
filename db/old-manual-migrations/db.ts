import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error(
    "DATABASE_URL environment variable is required to create db connection"
  );
}

export const sql = postgres(dbUrl, { ssl: "require" });
