import { sql } from "../db";

export const up = async () => {
  await sql`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "posts_categories" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" TEXT UNIQUE NOT NULL,
      "slug" TEXT UNIQUE NOT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
};
