"use server";

import { requireSession } from "@/lib/better-auth/server-auth";
import { sql } from "../../../../db/old-manual-migrations/db";
import { redirect } from "next/navigation";

export const addCategory = async (
  name: string,
  slug: string,
): Promise<string | null> => {
  try {
    const session = await requireSession();

    if (!session) {
      redirect("/login");
    }

    if (!name || !slug) {
      throw new Error("Name and Slug are required");
    }

    await sql`
      INSERT INTO posts_categories (name, slug)
      VALUES (${name}, ${slug});
`;

    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      if (
        error.message ===
        'duplicate key value violates unique constraint "posts_categories_name_key"'
      ) {
        return `'${slug}' already exists in DB, Try a different one.`;
      }
      return error.message;
    }
    console.error(error as string);
    return error as string;
  }
};
