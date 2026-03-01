import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const migrationDir = path.join(process.cwd(), "db", "migrations");

const runMigrations = async () => {
  const files = fs
    .readdirSync(migrationDir)
    .filter((f) => f.endsWith(".ts"))
    .sort();

  for (const file of files) {
    const fullPath = path.join(migrationDir, file);
    const fileUrl = pathToFileURL(fullPath).href;
    console.log(`Running migration: ${file}`);
    const migration = await import(fileUrl);
    await migration.up();
  }

  console.log("All migrations executed successfully.");
};

runMigrations().catch((error) => {
  console.error("Migrations failed: ", error);
  process.exit(1);
});
