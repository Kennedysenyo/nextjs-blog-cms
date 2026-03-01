"use server";

import { requireSession } from "@/lib/better-auth/server-auth";
import { PostDataType } from "@/types/types";
import { sql } from "../../../db/old-manual-migrations/db";

export const saveEdit = async (
  postId: string,
  data: PostDataType,
): Promise<string | null> => {
  try {
    const session = await requireSession();
    const authorId = session?.user.id;
    if (!authorId) {
      throw new Error("Error! No User session found!");
    }

    if (
      !data.title ||
      !data.slug ||
      !data.content ||
      !data.featuredImage ||
      !data.categoryId
    ) {
      throw new Error("Missing required post fields");
    }

    await sql`
  UPDATE posts
  SET
    "title" = ${data.title},
    "slug" = ${data.slug},
    "contentMd" = ${data.content},
    "excerpt" = ${data.excerpt},
    "featuredImage" = ${data.featuredImage},
    "categoryId" = ${data.categoryId}
  WHERE id = ${postId};
`;

    // console.table(post[0]);

    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return error.message;
    }
    return error as string;
  }
};
