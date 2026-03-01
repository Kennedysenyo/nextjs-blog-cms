import { sql } from "../db";

export const up = async () => {
  await sql`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS posts (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "slug" TEXT UNIQUE NOT NULL,
    "contentMd" TEXT NOT NULL,
    "excerpt" TEXT,
    "featuredImage" TEXT NOT NULL,
    "categoryId" UUID NOT NULL REFERENCES posts_categories(id),
    "authorId" TEXT NOT NULL REFERENCES "user"(id),

    "status" TEXT NOT NULL
      CHECK (status IN ('draft', 'published', 'archived'))
      DEFAULT 'draft',

    "publishedAt" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),

    CHECK (
      (status = 'draft' AND "publishedAt" IS NULL)
      OR
      (status = 'published' AND "publishedAt" IS NOT NULL)
      OR
      (status = 'archived')
    )
  );

  `;

  await sql`
    DROP TRIGGER IF EXISTS posts_updated_at ON posts;
  `;

  await sql`
    CREATE TRIGGER posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
  `;
};
