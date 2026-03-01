"use server";

import { requireSession } from "@/lib/better-auth/server-auth";
import { redirect } from "next/navigation";
import { sql } from "../../../../db/old-manual-migrations/db";

export const saveCategoryEdit = async (
  id: string,
  name: string,
  slug: string,
) => {
  try {
    const session = await requireSession();

    if (!session) {
      redirect("/login");
    }

    if (!id || !name || !slug) {
      throw new Error("Id, Name, and Slug are required");
    }

    await sql`
   UPDATE posts_categories 
   SET 
   name = ${name}, 
   slug = ${slug}
   WHERE id =  ${id};
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
