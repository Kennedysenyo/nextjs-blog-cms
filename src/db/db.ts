import { env } from "@/env/server";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/libsql";

dotenv.config({ path: ".env.local" });

export const db = drizzle(env.DB_FILE_NAME!);
