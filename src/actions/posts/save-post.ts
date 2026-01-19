"use server";

import { requireSession } from "@/lib/better-auth/server-auth";
import { sql } from "../../../db/db";
import { handleError } from "@/utils/handle-error";
import { ReturnedData } from "@/types/types";

interface PostDataType {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  categoryId: string;
}

const baseUrl = process.env.PUBLIC_SITE_URL;
if (!baseUrl) {
  throw new Error(
    "PUBLIC_SITE_URL environment variable is required to save new post!"
  );
}

export const savePost = async (data: PostDataType): Promise<ReturnedData> => {
  try {
    // console.table(data);

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

    const canonicalUrl = `${baseUrl}/insights/${data.slug}`;

    const result = await sql.begin(async (tx) => {
      const [post] = await tx`
        INSERT INTO "posts" (
        "title", 
        "slug", 
        "contentMd", 
        "excerpt",
        "featuredImage", 
        "categoryId", 
        "authorId",
        "status"
        )
        VALUES (
        ${data.title}, 
        ${data.slug}, 
        ${data.content}, 
        ${data.excerpt}, 
        ${data.featuredImage}, 
        ${data.categoryId}, 
        ${authorId}, 
        'draft'
      ) RETURNING id;
    `;

      await tx`
      INSERT INTO post_seo (
        "postId",
        "metaTitle",
        "metaDescription",
        "ogTitle",
        "ogDescription",
        "ogImage",
        "twitterTitle",
        "twitterDescription",
        "twitterImage",
        "canonicalUrl",
        "robots"
      )
      VALUES (
        ${post.id},
        ${data.title},
        ${data.excerpt},
        ${data.title},
        ${data.excerpt},
        ${data.featuredImage},
        ${data.title},
        ${data.excerpt},
        ${data.featuredImage},
        ${canonicalUrl},
        'noindex, nofollow'
      );

    `;
      return post.id;
    });

    return { postId: result, errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};
