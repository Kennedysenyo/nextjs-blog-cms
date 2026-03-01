import { sql } from "../db";

export const up = async () => {
  await sql`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS post_slugs (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "postId" UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      "slug" TEXT NOT NULL,
      "isCurrent" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now()
    );
  `;

  // ensure one current slug per post
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS post_slugs_one_current
    ON post_slugs ("postId")
    WHERE "isCurrent" = true;
  `;

  // speed up slug lookups
  await sql`
    CREATE INDEX IF NOT EXISTS post_slugs_slug_idx
    ON post_slugs ("slug");
  `;
};
