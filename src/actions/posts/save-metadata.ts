"use server";

import { requireSession } from "@/lib/better-auth/server-auth";
import { sql } from "../../../db/old-manual-migrations/db";

interface MetaData {
  id: string;
  title: string;
  description: string;
  keywords: string[];
}

export const saveMetaData = async (
  metadata: MetaData,
): Promise<string | null> => {
  try {
    const session = await requireSession();
    const authorId = session?.user.id;
    if (!authorId) {
      throw new Error("Error! No User session found!");
    }

    if (!metadata.title || !metadata.description) {
      throw new Error("Missing required post fields");
    }

    await sql`
    UPDATE post_seo
    SET
      "metaTitle" = ${metadata.title},
      "metaDescription" = ${metadata.description},
      "ogTitle" = ${metadata.title},
      "ogDescription" = ${metadata.description},
      "twitterTitle" = ${metadata.title},
      "twitterDescription" = ${metadata.description},
      "keywords" = ${metadata.keywords}
    WHERE "postId" = ${metadata.id};
  `;

    return null;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return error as string;
  }
};
