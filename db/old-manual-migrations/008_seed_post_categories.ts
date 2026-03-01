import { sql } from "./db";

export const up = async () => {
  await sql`
    INSERT INTO posts_categories (name, slug)
    VALUES 
    ('web design', 'web-design'),
    ('seo','seo' ),
    ('advertising', 'advertising'),
    ('development', 'development');
  `;

  console.log("✅ Categories seeded");
};
