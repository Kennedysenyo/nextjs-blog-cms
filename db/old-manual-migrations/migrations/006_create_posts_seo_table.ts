import { sql } from "../db";

export const up = async () => {
  await sql`
  CREATE TABLE IF NOT EXISTS post_seo (

    "postId" UUID PRIMARY KEY
    REFERENCES posts("id")
    ON DELETE CASCADE,

    "metaTitle" TEXT,
    "metaDescription" TEXT,

    "canonicalUrl" TEXT UNIQUE,
    "robots" TEXT NOT NULL DEFAULT 'index, follow',

    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImage" TEXT,
    "ogType" TEXT NOT NULL DEFAULT 'article',

    "twitterCard" TEXT NOT NULL DEFAULT 'summary_large_image',
    "twitterTitle" TEXT,
    "twitterDescription" TEXT,
    "twitterImage" TEXT,
      
    "keywords" TEXT[],

    CHECK (
      "robots" IN (
        'index, follow',
        'noindex, follow',
        'index, nofollow',
        'noindex, nofollow'
      )
    ),
    CHECK (
      "ogType" IN ('article', 'website', 'profile')
    ),
    CHECK (
      "twitterCard" IN (
        'summary',
        'summary_large_image',
        'app',
        'player'
      )
    ),

    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
  );
`;

  await sql`
    DROP TRIGGER IF EXISTS post_seo_updated_at ON post_seo;
    `;

  await sql`
    CREATE TRIGGER post_seo_updated_at
    BEFORE UPDATE ON post_seo
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
    `;
};
