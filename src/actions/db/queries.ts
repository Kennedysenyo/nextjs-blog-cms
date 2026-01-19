"use server";

import { notFound } from "next/navigation";
import { sql } from "../../../db/db";
import { revalidatePath } from "next/cache";

export const fetchCategories = async () => {
  try {
    const categories = await sql`
    SELECT id, name, slug FROM posts_categories;
  `;
    return categories;
  } catch {
    notFound();
  }
};

export const fetchPostById = async (id: string) => {
  try {
    const post = await sql`
      SELECT 
        post."id", 
        post."title", 
        post."slug",
        post."excerpt",
        post."contentMd", 
        post."featuredImage", 
        post."status",
        post."publishedAt",
        category."id" AS "categoryId",
        category."name" AS "category",
        author."name" AS "author"
      FROM "posts" post
      LEFT JOIN "posts_categories" category 
        ON category."id" = post."categoryId"
      LEFT JOIN "user" author 
        ON post."authorId" = author."id"
      WHERE post."id" = ${id};
    `;

    return post[0];
  } catch {
    notFound();
  }
};

export const fetchPostStatus = async (id: string) => {
  try {
    const res = await sql`
    SELECT id, status FROM posts WHERE posts.id = ${id}
  `;

    return res[0];
  } catch {
    notFound();
  }
};

export const setPostStatusToPublish = async (
  id: string
): Promise<string | null> => {
  try {
    await sql.begin(async (tx) => {
      await tx`
        UPDATE posts
        SET "status" = 'published',
        "publishedAt" = now()
        WHERE id = ${id};
      `;

      await tx`
        UPDATE post_seo
        SET "robots" = 'index, follow'
        WHERE "postId" = ${id};
      `;
    });
    revalidatePath(`posts/${id}/preview`);
    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return "Error! Status change unsuccessful";
    }
    return error as string;
  }
};

export const setPostStatusToArchive = async (
  id: string
): Promise<string | null> => {
  try {
    await sql.begin(async (tx) => {
      await tx`
        UPDATE posts
        SET "status" = 'archived'
        WHERE id = ${id};
      `;

      await tx`
        UPDATE post_seo
        SET "robots" = 'noindex, follow'
        WHERE "postId" = ${id};
      `;
    });
    revalidatePath(`/posts/${id}/preview`);
    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return "Error! Status change unsuccessful";
    }
    return error as string;
  }
};

// | Post Status | robots              |
// | ----------- | ------------------- |
// | `draft`     | `noindex, nofollow` |
// | `published` | `index, follow`     |
// | `archived`  | `noindex, follow`   |
export const setPostStatusToDraft = async (
  id: string
): Promise<string | null> => {
  try {
    await sql.begin(async (tx) => {
      await tx`
        UPDATE posts
        SET "status" = 'draft'
        WHERE id = ${id};
      `;

      await tx`
        UPDATE post_seo
        SET "robots" = 'noindex, nofollow'
        WHERE "postId" = ${id};
      `;
    });
    revalidatePath(`/posts/${id}/preview`);

    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return "Error! Status change unsuccessful";
    }
    return error as string;
  }
};

export const fetchMetadataByPostId = async (id: string) => {
  try {
    const metadata = await sql`
      SELECT 
        "postId", 
        "metaTitle", 
        "metaDescription", 
        "keywords" 
      FROM post_seo
      WHERE "postId" = ${id}
      `;

    return metadata[0];
  } catch {
    notFound();
  }
};

export const fetchAllPosts = async () => {
  const posts = await sql`
  SELECT
    posts.id,
    posts.title,
    posts.status,
    posts_categories.name AS "category"
  FROM posts
  INNER JOIN posts_categories
    ON posts."categoryId" = posts_categories.id
  ORDER BY posts."createdAt" DESC ;
`;
  // console.log(posts);
  return posts;
};

export const fetchPostContentById = async (id: string) => {
  try {
    const content = await sql`
    SELECT "contentMd" FROM posts
    WHERE id = ${id}
  `;

    // await sleep(2000);
    return content[0];
  } catch {
    notFound();
  }
};

const ITEMS_PER_PAGE = 10;

export const fetchPostsTotalPages = async (
  term: string,
  category: string,
  status: string
) => {
  try {
    const conditions = [];

    if (term?.trim()) {
      conditions.push(sql`
        (
          posts.id::TEXT ILIKE ${`%${term}%`} OR
          posts.title ILIKE ${`%${term}%`} OR
          posts.excerpt ILIKE ${`%${term}%`} OR
          posts."contentMd" ILIKE ${`%${term}%`} OR
          posts."createdAt"::text ILIKE ${`%${term}%`}
        )
      `);
    }

    if (category?.trim()) {
      conditions.push(sql`
        posts."categoryId" = ${category}
      `);
    }

    if (status?.trim()) {
      conditions.push(sql`
        posts.status = ${status}
      `);
    }

    const where = conditions.length
      ? sql`WHERE ${conditions.reduce(
          (acc, curr, i) => (i === 0 ? curr : sql`${acc} AND ${curr}`),
          sql``
        )}`
      : sql``;

    const result = await sql`
      SELECT COUNT(*) AS total
      FROM posts
      ${where};
    `;

    return Number(result[0].total);
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching post count");
  }
};

export const fetchCategoriesAndPostsTotalPages = async (
  term: string,
  category: string,
  status: string
) => {
  const [totalPages, categories] = await Promise.all([
    fetchPostsTotalPages(term, category, status),
    fetchCategories(),
  ]);

  return {
    totalPages: Math.ceil(totalPages / ITEMS_PER_PAGE),
    categories,
  };
};

export const fetchPostsByFilter = async (
  currentPage: number,
  term: string,
  category: string,
  status: string
) => {
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const conditions = [];

    if (term?.trim()) {
      conditions.push(sql`
        (
          posts.id::TEXT ILIKE ${`%${term}%`} OR
          posts.title ILIKE ${`%${term}%`} OR
          posts.excerpt ILIKE ${`%${term}%`} OR
          posts."contentMd" ILIKE ${`%${term}%`} OR
          posts."createdAt"::text ILIKE ${`%${term}%`}
        )
      `);
    }

    if (category?.trim()) {
      conditions.push(sql`
        posts."categoryId" = ${category}
      `);
    }

    if (status?.trim()) {
      conditions.push(sql`
        posts.status = ${status}
      `);
    }

    const where = conditions.length
      ? sql`WHERE ${conditions.reduce(
          (acc, curr, i) => (i === 0 ? curr : sql`${acc} AND ${curr}`),
          sql``
        )}`
      : sql``;

    const result = await sql`
      SELECT 
        posts.id,
        posts.title,
        posts.status,
        posts_categories.name AS category
      FROM posts
      JOIN posts_categories
        ON posts."categoryId" = posts_categories.id
      ${where}
      ORDER BY posts."createdAt" DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;

    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching posts");
  }
};

export const deletePostById = async (id: string) => {
  try {
    const deletedPostId = await sql`
    DELETE FROM posts WHERE posts.id = ${id} RETURNING id;`;
    revalidatePath(`/posts/`);

    return deletedPostId[0];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    console.error(error as string);
  }
  throw new Error("Failed to Delete Post");
};

export const fetchCategoriesTotalPages = async (term: string) => {
  try {
    const conditions = [];

    if (term?.trim()) {
      conditions.push(sql`
        (
          posts_categories.id::TEXT ILIKE ${`%${term}%`} OR
          posts_categories.name ILIKE ${`%${term}%`} OR
          posts_categories.slug ILIKE ${`%${term}%`} 
          
        )
      `);
    }

    const where = conditions.length
      ? sql`WHERE ${conditions.reduce(
          (acc, curr, i) => (i === 0 ? curr : sql`${acc} AND ${curr}`),
          sql``
        )}`
      : sql``;

    const result = await sql`
      SELECT COUNT(*) AS total
      FROM posts_categories
      ${where};
    `;

    return Math.ceil(Number(result[0].total) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching categories count");
  }
};

export const fetchCategoriesByFilter = async (
  currentPage: number,
  term: string
) => {
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const conditions = [];

    if (term?.trim()) {
      conditions.push(sql`
        (
          posts_categories.id::TEXT ILIKE ${`%${term}%`} OR
          posts_categories.name ILIKE ${`%${term}%`} OR
          posts_categories.slug ILIKE ${`%${term}%`}
        )
      `);
    }

    const where = conditions.length
      ? sql`WHERE ${conditions.reduce(
          (acc, curr, i) => (i === 0 ? curr : sql`${acc} AND ${curr}`),
          sql``
        )}`
      : sql``;

    const result = await sql`
      SELECT 
        id,
        name,
        slug
      FROM posts_categories
      ${where}
      ORDER BY posts_categories."createdAt" DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;

    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching categories");
  }
};

export const deleteCategoryById = async (id: string) => {
  try {
    const deletedPostId = await sql`
    DELETE FROM posts_categories WHERE posts_categories.id = ${id} RETURNING id;`;
    revalidatePath(`/posts/categories`);

    return deletedPostId[0];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    console.error(error as string);
  }
  throw new Error("Failed to Delete Post");
};

export const fetchCategoryById = async (id: string) => {
  try {
    const category = await sql`
      SELECT id, name, slug FROM posts_categories WHERE id = ${id}
    `;
    return category[0];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    console.error(error as string);
    notFound();
  }
};

export const fetchUsersTotalPages = async (term: string) => {
  try {
    const conditions = [];

    if (term?.trim()) {
      conditions.push(sql`
        (
          "user".id::TEXT ILIKE ${`%${term}%`} OR
          "user".name ILIKE ${`%${term}%`} OR
          "user".email ILIKE ${`%${term}%`} OR
          "user".role ILIKE ${`%${term}%`} OR
          
        )
      `);
    }

    // if (status) {

    // }

    const where = conditions.length
      ? sql`WHERE ${conditions.reduce(
          (acc, curr, i) => (i === 0 ? curr : sql`${acc} AND ${curr}`),
          sql``
        )}`
      : sql``;

    const result = await sql`
      SELECT COUNT(*) AS total
      FROM "user"
      ${where};
    `;

    return Math.ceil(Number(result[0].total) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching user count");
  }
};

export const fetchUsersByFilter = async (currentPage: number, term: string) => {
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const conditions = [];

    if (term?.trim()) {
      conditions.push(sql`
        (
          "user".id::TEXT ILIKE ${`%${term}%`} OR
          "user".name ILIKE ${`%${term}%`} OR
          "user".email ILIKE ${`%${term}%`} OR
          "user".role ILIKE ${`%${term}%`}
        )
      `);
    }

    const where = conditions.length
      ? sql`WHERE ${conditions.reduce(
          (acc, curr, i) => (i === 0 ? curr : sql`${acc} AND ${curr}`),
          sql``
        )}`
      : sql``;

    const result = await sql`
      SELECT 
        id,
        name,
        email,
        role
      FROM "user"
      ${where}
      ORDER BY "createdAt" DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;

    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching categories");
  }
};

export const deleteUserById = async (id: string) => {
  try {
    const deletedPostId = await sql`
    DELETE FROM user WHERE user.id = ${id} RETURNING id;`;
    revalidatePath(`/users`);

    return deletedPostId[0];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    console.error(error as string);
  }
  throw new Error("Failed to Delete User");
};
