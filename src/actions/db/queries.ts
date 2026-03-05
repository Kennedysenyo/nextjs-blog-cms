"use server";

import { notFound } from "next/navigation";
// import { sql as sqll } from "../../../db/old-manual-migrations/db";
import { revalidatePath } from "next/cache";
import { db } from "@/db/db";
import {
  postsCategoriesTable,
  postSeoTable,
  postTable,
  userTable,
} from "@/db/schema";
import { count, eq, ilike, sql, SQL } from "drizzle-orm";

export const fetchCategories = async () => {
  try {
    const categories = await db
      .select({
        id: postsCategoriesTable.id,
        name: postsCategoriesTable.name,
        slug: postsCategoriesTable.slug,
      })
      .from(postsCategoriesTable);
    return categories;
  } catch {
    notFound();
  }
};

export const fetchPostById = async (id: string) => {
  try {
    // const post = await sql`
    //   SELECT
    //     post."id",
    //     post."title",
    //     post."slug",
    //     post."excerpt",
    //     post."contentMd",
    //     post."featuredImage",
    //     post."status",
    //     post."publishedAt",
    //     category."id" AS "categoryId",
    //     category."name" AS "category",
    //     user."name" AS "author"
    //   FROM "posts" post
    //   LEFT JOIN "posts_categories" category
    //     ON category."id" = post."categoryId"
    //   LEFT JOIN "user" author
    //     ON post."authorId" = author."id"
    //   WHERE post."id" = ${id};
    // `;

    // return post[0];

    const [post] = await db
      .select({
        id: postTable.id,
        title: postTable.title,
        slug: postTable.slug,
        except: postTable.excerpt,
        contentMd: postTable.contentMd,
        featuredImage: postTable.featuredImage,
        status: postTable.status,
        publishedAt: postTable.publishedAt,
        categoryId: postsCategoriesTable.id,
        author: userTable.name,
      })
      .from(postTable)
      .leftJoin(
        postsCategoriesTable,
        eq(postTable.categoryId, postsCategoriesTable.id),
      )
      .leftJoin(userTable, eq(postTable.authorId, userTable.id))
      .all();
    return post;
  } catch {
    notFound();
  }
};

export const fetchPostStatus = async (id: string) => {
  try {
    //   const res = await sql`
    //   SELECT id, status FROM posts WHERE posts.id = ${id}
    // `;

    //   return res[0];

    const [status] = await db
      .select({ id: postTable.id, status: postTable.status })
      .from(postTable)
      .where(eq(postTable.id, id));

    return status;
  } catch {
    notFound();
  }
};

export const setPostStatusToPublish = async (
  id: string,
): Promise<string | null> => {
  try {
    // await sql.begin(async (tx) => {
    //   await tx`
    //     UPDATE posts
    //     SET "status" = 'published',
    //     "publishedAt" = now()
    //     WHERE id = ${id};
    //   `;

    //   await tx`
    //     UPDATE post_seo
    //     SET "robots" = 'index, follow'
    //     WHERE "postId" = ${id};
    //   `;
    // });

    await db.transaction(async (tx) => {
      await tx
        .update(postTable)
        .set({ status: "published", publishedAt: new Date(), archivedAt: null })
        .where(eq(postTable.id, id));

      await tx
        .update(postSeoTable)
        .set({ robots: "index, follow" })
        .where(eq(postSeoTable.postId, id));
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
  id: string,
): Promise<string | null> => {
  try {
    // await sql.begin(async (tx) => {
    //   await tx`
    //     UPDATE posts
    //     SET "status" = 'archived'
    //     WHERE id = ${id};
    //   `;

    //   await tx`
    //     UPDATE post_seo
    //     SET "robots" = 'noindex, follow'
    //     WHERE "postId" = ${id};
    //   `;
    // });

    await db.transaction(async (tx) => {
      await tx
        .update(postTable)
        .set({ status: "archived", publishedAt: null, archivedAt: new Date() })
        .where(eq(postTable.id, id));

      await tx
        .update(postSeoTable)
        .set({ robots: "noindex, follow" })
        .where(eq(postSeoTable.postId, id));
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
    // const metadata = await sql`
    //   SELECT
    //     "postId",
    //     "metaTitle",
    //     "metaDescription",
    //     "keywords"
    //   FROM post_seo
    //   WHERE "postId" = ${id}
    //   `;

    // return metadata[0];

    const [metadata] = await db
      .select({
        postId: postSeoTable.postId,
        metaTitle: postSeoTable.metaTitle,
        metaDescription: postSeoTable.metaDescription,
        keywords: postSeoTable.keywords,
      })
      .from(postSeoTable);
    return metadata;
  } catch {
    notFound();
  }
};

export const fetchAllPosts = async () => {
  //   const posts = await sql`
  //   SELECT
  //     posts.id,
  //     posts.title,
  //     posts.status,
  //     posts_categories.name AS "category"
  //   FROM posts
  //   INNER JOIN posts_categories
  //     ON posts."categoryId" = posts_categories.id
  //   ORDER BY posts."createdAt" DESC ;
  // `;

  //   return posts;

  const posts = await db
    .select({
      id: postTable.id,
      title: postTable.title,
      status: postTable.status,
      category: postsCategoriesTable.name,
    })
    .from(postTable)
    .innerJoin(
      postsCategoriesTable,
      eq(postTable.categoryId, postsCategoriesTable.id),
    )
    .all();
  return posts;
};

export const fetchPostContentById = async (id: string) => {
  try {
    //   const content = await sql`
    //   SELECT "contentMd" FROM posts
    //   WHERE id = ${id}
    // `;

    //   return content[0];

    const [content] = await db
      .select({ contentMd: postTable.contentMd })
      .from(postTable)
      .where(eq(postTable.id, id));

    return content;
  } catch {
    notFound();
  }
};

const ITEMS_PER_PAGE = 10;

export const fetchPostsTotalPages = async (
  term: string,
  category: string,
  status: string,
) => {
  try {
    // const conditions = [];

    // if (term?.trim()) {
    //   conditions.push(sql`
    //     (
    //       posts.id::TEXT ILIKE ${`%${term}%`} OR
    //       posts.title ILIKE ${`%${term}%`} OR
    //       posts.excerpt ILIKE ${`%${term}%`} OR
    //       posts."contentMd" ILIKE ${`%${term}%`} OR
    //       posts."createdAt"::text ILIKE ${`%${term}%`}
    //     )
    //   `);
    // }

    // if (category?.trim()) {
    //   conditions.push(sql`
    //     posts."categoryId" = ${category}
    //   `);
    // }

    // if (status?.trim()) {
    //   conditions.push(sql`
    //     posts.status = ${status}
    //   `);
    // }

    // const where = conditions.length
    //   ? sql`WHERE ${conditions.reduce(
    //       (acc, curr, i) => (i === 0 ? curr : sql`${acc} AND ${curr}`),
    //       sql``,
    //     )}`
    //   : sql``;

    // const result = await sql`
    //   SELECT COUNT(*) AS total
    //   FROM posts
    //   ${where};
    // `;

    // return Number(result[0].total);

    const conditions: SQL[] = [];

    if (term?.trim()) {
      const pattern = `%${term}%`;
      conditions.push(
        sql`(
        ${ilike(postTable.id, pattern)} OR
        ${ilike(postTable.title, pattern)} OR
        ${ilike(postTable.slug, pattern)} OR
        ${ilike(postTable.contentMd, pattern)} OR
        ${ilike(postTable.excerpt, pattern)} OR
        ${ilike(userTable.name, pattern)}
      )`,
      );
    }

    if (category?.trim()) {
      conditions.push(sql`
        ${ilike(postTable.categoryId, category)}
        `);
    }

    if (status?.trim()) {
      conditions.push(sql`${ilike(postTable.status, status)}`);
    }

    const query = db
      .select({ total: count() })
      .from(postTable)
      .leftJoin(userTable, eq(postTable.authorId, userTable.id)); // one row because COUNT(*)

    if (conditions.length > 0) {
      query.where(sql.join(conditions, " "));
    }

    const [result] = await query;
    return Number(result?.total);
  } catch (error) {
    throw new Error("Error fetching post count");
  }
};

export const fetchCategoriesAndPostsTotalPages = async (
  term: string,
  category: string,
  status: string,
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
  status: string,
) => {
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const conditions: SQL[] = [];

    // if (term?.trim()) {
    //   conditions.push(sqll`
    //     (
    //       posts.id::TEXT ILIKE ${`%${term}%`} OR
    //       posts.title ILIKE ${`%${term}%`} OR
    //       posts.excerpt ILIKE ${`%${term}%`} OR
    //       posts."contentMd" ILIKE ${`%${term}%`} OR
    //       posts."createdAt"::text ILIKE ${`%${term}%`}
    //     )
    //   `);
    // }

    if (term?.trim()) {
      const pattern = `%${term}%`;
      conditions.push(
        sql`(
        ${ilike(postTable.id, pattern)} OR
        ${ilike(postTable.title, pattern)} OR
        ${ilike(postTable.slug, pattern)} OR 
        ${ilike(postTable.excerpt, pattern)} OR
        ${ilike(postTable.contentMd, pattern)} OR
        ${ilike(userTable.name, pattern)}
        )`,
      );
    }

    // if (category?.trim()) {
    //   conditions.push(sqll`
    //     posts."categoryId" = ${category}
    //   `);
    // }

    if (category?.trim()) {
      conditions.push(sql`
        ${ilike(postTable.categoryId, category)}`);
    }

    // if (status?.trim()) {
    //   conditions.push(sqll`
    //     posts.status = ${status}
    //   `);
    // }

    if (status?.trim()) {
      conditions.push(sql`
        ${ilike(postTable.status, status)}`);
    }

    // const where = conditions.length
    //   ? sql`${conditions.reduce(
    //       (acc, curr, i) => (i === 0 ? curr : sql`${acc} AND ${curr}`),
    //       sql``,
    //     )}`
    //   : sql``;

    // const result = await sql`
    //   SELECT
    //     posts.id,
    //     posts.title,
    //     posts.status,
    //     posts_categories.name AS category
    //   FROM posts
    //   JOIN posts_categories
    //     ON posts."categoryId" = posts_categories.id
    //   ${where}
    //   ORDER BY posts."createdAt" DESC
    //   LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    // `;

    const query = db
      .select({
        id: postTable.id,
        title: postTable.title,
        status: postTable.status,
        category: postsCategoriesTable.name,
      })
      .from(postTable)
      .leftJoin(userTable, eq(postTable.authorId, userTable.id))
      .leftJoin(
        postsCategoriesTable,
        eq(postTable.categoryId, postsCategoriesTable.id),
      );
    if (conditions.length > 0) {
      query.where(sql.join(conditions));
    }
    const posts = await query;
    return posts;
  } catch (error) {
    throw new Error("Error fetching posts");
  }
};

export const deletePostById = async (id: string) => {
  try {
    // const deletedPostId = await sqll`
    // DELETE FROM posts WHERE posts.id = ${id} RETURNING id;`;
    // revalidatePath(`/posts/`);
    // return deletedPostId[0];

    const [deletedPostId] = await db
      .delete(postTable)
      .where(eq(postTable.id, id))
      .returning({ id: postTable.id });

    return deletedPostId;
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
    const conditions: SQL[] = [];

    // if (term?.trim()) {
    //   conditions.push(sqll`
    //     (
    //       posts_categories.id::TEXT ILIKE ${`%${term}%`} OR
    //       posts_categories.name ILIKE ${`%${term}%`} OR
    //       posts_categories.slug ILIKE ${`%${term}%`}

    //     )
    //   `);
    // }

    if (term?.trim()) {
      const pattern = `%${term}%`;
      conditions.push(sql`
        (
        ${ilike(postsCategoriesTable.id, pattern)} OR
        ${ilike(postsCategoriesTable.slug, pattern)} OR
        ${ilike(postsCategoriesTable.name, pattern)}

        )
        `);
    }

    // const result = await sqll`
    //   SELECT COUNT(*) AS total
    //   FROM posts_categories
    //   ${where};
    // `;

    const query = db.select({ total: count() }).from(postsCategoriesTable);

    if (conditions.length > 0) {
      query.where(sql.join(conditions));
    }

    const result = await query;

    return Math.ceil(Number(result[0].total) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching categories count");
  }
};

export const fetchCategoriesByFilter = async (
  currentPage: number,
  term: string,
) => {
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const conditions: SQL[] = [];

    // if (term?.trim()) {
    //   conditions.push(sql`
    //     (
    //       posts_categories.id::TEXT ILIKE ${`%${term}%`} OR
    //       posts_categories.name ILIKE ${`%${term}%`} OR
    //       posts_categories.slug ILIKE ${`%${term}%`}
    //     )
    //   `);
    // }

    if (term?.trim()) {
      const pattern = `%${term}%`;

      conditions.push(sql`
        (
        ${ilike(postsCategoriesTable.id, pattern)} OR
        ${ilike(postsCategoriesTable.name, pattern)} OR
        ${ilike(postsCategoriesTable.slug, pattern)} 
        )
        `);
    }

    // const where = conditions.length
    //   ? sql`WHERE ${conditions.reduce(
    //       (acc, curr, i) => (i === 0 ? curr : sql`${acc} AND ${curr}`),
    //       sql``,
    //     )}`
    //   : sql``;

    // const result = await sql`
    //   SELECT
    //     id,
    //     name,
    //     slug
    //   FROM posts_categories
    //   ${where}
    //   ORDER BY posts_categories."createdAt" DESC
    //   LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    // `;

    const query = db
      .select({
        id: postsCategoriesTable.id,
        name: postsCategoriesTable.name,
        slug: postsCategoriesTable.slug,
      })
      .from(postsCategoriesTable);

    if (conditions.length > 0) {
      query.where(sql.join(conditions));
    }

    const result = await query;

    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching categories");
  }
};

export const deleteCategoryById = async (id: string) => {
  try {
    // const deletedPostId = await sqll`
    // DELETE FROM posts_categories WHERE posts_categories.id = ${id} RETURNING id;`;

    const [deletedCategoryId] = await db
      .delete(postsCategoriesTable)
      .where(eq(postsCategoriesTable.id, id))
      .returning({ id: postsCategoriesTable.id });

    revalidatePath(`/posts/categories`);

    return deletedCategoryId;
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
    const [category] = await db
      .select({
        id: postsCategoriesTable.id,
        name: postsCategoriesTable.name,
        slug: postsCategoriesTable.slug,
      })
      .from(postsCategoriesTable)
      .where(eq(postsCategoriesTable.id, id));

    return category;
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
    const conditions: SQL[] = [];

    // if (term?.trim()) {
    //   conditions.push(sqll`
    //     (
    //       "user".id::TEXT ILIKE ${`%${term}%`} OR
    //       "user".name ILIKE ${`%${term}%`} OR
    //       "user".email ILIKE ${`%${term}%`} OR
    //       "user".role ILIKE ${`%${term}%`} OR

    //     )
    //   `);
    // }

    if (term?.trim()) {
      const pattern = `%${term}%`;

      conditions.push(
        sql`
        (
        ${ilike(userTable.id, pattern)} OR
        ${ilike(userTable.name, pattern)} OR
        ${ilike(userTable.email, pattern)} OR
        ${ilike(userTable.role, pattern)} 
        )`,
      );
    }

    // const where = conditions.length
    //   ? sqll`WHERE ${conditions.reduce(
    //       (acc, curr, i) => (i === 0 ? curr : sqll`${acc} AND ${curr}`),
    //       sqll``,
    //     )}`
    //   : sqll``;

    // const result = await sqll`
    //   SELECT COUNT(*) AS total
    //   FROM "user"
    //   ${where};
    // `;

    // return Math.ceil(Number(result[0].total) / ITEMS_PER_PAGE);

    const query = db.select({ total: count() }).from(userTable);

    if (conditions.length > 0) {
      query.where(sql.join(conditions));
    }

    const [result] = await query;

    return Math.ceil(result.total / ITEMS_PER_PAGE);
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching user count");
  }
};

export const fetchUsersByFilter = async (currentPage: number, term: string) => {
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const conditions: SQL[] = [];

    // if (term?.trim()) {
    //   conditions.push(sql`
    //     (
    //       "user".id::TEXT ILIKE ${`%${term}%`} OR
    //       "user".name ILIKE ${`%${term}%`} OR
    //       "user".email ILIKE ${`%${term}%`} OR
    //       "user".role ILIKE ${`%${term}%`}
    //     )
    //   `);
    // }

    if (term?.trim()) {
      const pattern = `%${term}%`;

      conditions.push(sql`(
        ${ilike(userTable.id, pattern)} OR
        ${ilike(userTable.name, pattern)} OR
        ${ilike(userTable.email, pattern)} OR
        ${ilike(userTable.role, pattern)} 
        )`);
    }

    // const where = conditions.length
    //   ? sql`WHERE ${conditions.reduce(
    //       (acc, curr, i) => (i === 0 ? curr : sql`${acc} AND ${curr}`),
    //       sql``,
    //     )}`
    //   : sql``;

    // const result = await sql`
    //   SELECT
    //     id,
    //     name,
    //     email,
    //     role
    //   FROM "user"
    //   ${where}
    //   ORDER BY "createdAt" DESC
    //   LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    // `;

    // return result;

    const query =
      conditions.length > 0
        ? db
            .select({
              id: userTable.id,
              name: userTable.name,
              email: userTable.email,
              role: userTable.role,
            })
            .from(userTable)
            .where(sql.join(conditions))
            .orderBy(userTable.createdAt)
        : db
            .select({
              id: userTable.id,
              name: userTable.name,
              email: userTable.email,
              role: userTable.role,
            })
            .from(userTable)
            .orderBy(userTable.createdAt);

    const users = await query;
    return users;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching categories");
  }
};

export const deleteUserById = async (id: string) => {
  try {
    // const deletedPostId = await sqll`
    // DELETE FROM user WHERE user.id = ${id} RETURNING id;`;

    const [deletedUserId] = await db
      .delete(userTable)
      .where(eq(userTable.id, id))
      .returning({ id: userTable.id });

    revalidatePath(`/users`);

    return deletedUserId;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    console.error(error as string);
  }
  throw new Error("Failed to Delete User");
};
