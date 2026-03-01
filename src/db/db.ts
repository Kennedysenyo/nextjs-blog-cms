import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/libsql";

dotenv.config({ path: ".env.local" });

export const db = drizzle(process.env.DB_FILE_NAME!);
