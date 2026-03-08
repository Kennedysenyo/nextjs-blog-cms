"use server";

import { db } from "@/db/db";
import {
  postsCategoriesTable,
  postSeoTable,
  postTable,
  userTable,
} from "@/db/schema";
import { count, desc, eq, sql, SQL } from "drizzle-orm";

import { notFound } from "next/navigation";
import { fetchCategories } from "../categories/categories.queries";
import {
  SelectRecentDraftPostType,
  SelectRecentPublishedPostType,
} from "./posts.types";

export const fetchPostById = async (id: string) => {
  try {
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
        category: postsCategoriesTable.name,
        author: userTable.name,
      })
      .from(postTable)
      .leftJoin(
        postsCategoriesTable,
        eq(postTable.categoryId, postsCategoriesTable.id),
      )
      .leftJoin(userTable, eq(postTable.authorId, userTable.id))
      .where(eq(postTable.id, id));

    return post;
  } catch {
    notFound();
  }
};

export const fetchPostByIdForEdit = async (id: string) => {
  try {
    const [post] = await db
      .select({
        title: postTable.title,
        slug: postTable.slug,
        excerpt: postTable.excerpt,
        contentMd: postTable.contentMd,
        featuredImage: postTable.featuredImage,
        categoryId: postTable.categoryId,
      })
      .from(postTable)
      .where(eq(postTable.id, id));

    return post;
  } catch {
    notFound();
  }
};

export const fetchPostStatus = async (id: string) => {
  try {
    const [status] = await db
      .select({ id: postTable.id, status: postTable.status })
      .from(postTable)
      .where(eq(postTable.id, id));

    return status;
  } catch {
    notFound();
  }
};

export const fetchMetadataByPostId = async (id: string) => {
  try {
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

export const fetchPostContentById = async (id: string) => {
  try {
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
    const conditions: SQL[] = [];

    if (term?.trim()) {
      const pattern = `%${term}%`;
      conditions.push(
        sql`(
        posts.id::TEXT ILIKE ${pattern} OR
        posts.title ILIKE ${pattern} OR 
        posts.slug ILIKE ${pattern} OR 
        posts.excerpt ILIKE ${pattern} OR
        "user".name ILIKE ${pattern}
        )`,
      );
    }

    if (category?.trim()) {
      conditions.push(sql`
      (posts."categoryId" = ${category})
        `);
    }

    if (status?.trim()) {
      conditions.push(sql`
        (posts.status = ${status})
        `);
    }

    let result: { total: number }[];

    let joinedConditions: SQL;

    if (conditions.length > 0) {
      joinedConditions = conditions.reduce(
        (acc, curr, i) => (i === 0 ? curr : sql`${acc} AND ${curr}`),
        sql``,
      );

      result = await db
        .select({ total: count() })
        .from(postTable)
        .leftJoin(userTable, eq(postTable.authorId, userTable.id))
        .where(joinedConditions);
    } else {
      result = await db
        .select({ total: count() })
        .from(postTable)
        .leftJoin(userTable, eq(postTable.authorId, userTable.id));
    }

    return Number(result[0]?.total);
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

    if (term?.trim()) {
      const pattern = `%${term}%`;

      conditions.push(
        sql`(
        posts.id::TEXT ILIKE ${pattern} OR
        posts.title ILIKE ${pattern} OR
        posts.slug ILIKE ${pattern} OR
        posts."contentMd" ILIKE ${pattern} OR
        "user".name ILIKE ${pattern}
        )`,
      );
    }

    if (category?.trim()) {
      conditions.push(sql`
        (posts."categoryId" = ${category})
        `);
    }

    if (status?.trim()) {
      conditions.push(sql`
       (posts.status = ${status})
        `);
    }

    let posts: {
      id: string;
      title: string;
      status: "draft" | "published" | "archived";
      category: string | null;
    }[];
    let joinedConditions: SQL;

    if (conditions.length > 0) {
      joinedConditions = conditions.reduce(
        (acc, curr, i) => (i === 0 ? curr : sql`${acc} AND ${curr}`),
        sql``,
      );

      posts = await db
        .select({
          id: postTable.id,
          title: postTable.title,
          status: postTable.status,
          category: postsCategoriesTable.name,
        })
        .from(postTable)
        .leftJoin(userTable, eq(userTable.id, postTable.authorId))
        .leftJoin(
          postsCategoriesTable,
          eq(postsCategoriesTable.id, postTable.categoryId),
        )
        .where(joinedConditions)
        .limit(ITEMS_PER_PAGE)
        .offset(offset);
    } else {
      posts = await db
        .select({
          id: postTable.id,
          title: postTable.title,
          status: postTable.status,
          category: postsCategoriesTable.name,
        })
        .from(postTable)
        .leftJoin(userTable, eq(userTable.id, postTable.authorId))
        .leftJoin(
          postsCategoriesTable,
          eq(postsCategoriesTable.id, postTable.categoryId),
        )
        .limit(ITEMS_PER_PAGE)
        .offset(offset);
    }

    return posts;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching posts");
  }
};

export const fetchPostAuthorId = async (postId: string) => {
  const [authorId] = await db
    .select({ authorId: postTable.authorId })
    .from(postTable)
    .where(eq(postTable.id, postId));

  return authorId;
};

const fetchTotalPosts = async (): Promise<number> => {
  const [result] = await db.select({ total: count() }).from(postTable);
  return result.total;
};

const fetchTotalPublishedPosts = async (): Promise<number> => {
  const [result] = await db
    .select({ total: count() })
    .from(postTable)
    .where(eq(postTable.status, "published"));
  return result.total;
};

const fetchTotalDraftPosts = async (): Promise<number> => {
  const [result] = await db
    .select({ total: count() })
    .from(postTable)
    .where(eq(postTable.status, "draft"));
  return result.total;
};

const fetchTotalArchivedPosts = async (): Promise<number> => {
  const [result] = await db
    .select({ total: count() })
    .from(postTable)
    .where(eq(postTable.status, "archived"));
  return result.total;
};

export const fetchCardsData = async () => {
  const [allTotal, publishedTotal, draftsTotal, archivedTotal] =
    await Promise.all([
      fetchTotalPosts(),
      fetchTotalPublishedPosts(),
      fetchTotalDraftPosts(),
      fetchTotalArchivedPosts(),
    ]);

  return [allTotal, publishedTotal, draftsTotal, archivedTotal];
};

export const fetchRecentPublished = async (): Promise<
  SelectRecentPublishedPostType[]
> => {
  const posts = await db
    .select({
      id: postTable.id,
      title: postTable.title,
      publishedAt: postTable.publishedAt,
      author: userTable.name,
      image: userTable.image,
    })
    .from(postTable)
    .leftJoin(userTable, eq(postTable.authorId, userTable.id))
    .where(eq(postTable.status, "published"))
    .orderBy(desc(postTable.publishedAt))
    .limit(5);
  return posts;
};

export const fetchRecentDrafts = async (): Promise<
  SelectRecentDraftPostType[]
> => {
  const posts = await db
    .select({
      id: postTable.id,
      title: postTable.title,
      createdAt: postTable.createdAt,
      author: userTable.name,
      image: userTable.image,
    })
    .from(postTable)
    .leftJoin(userTable, eq(postTable.authorId, userTable.id))
    .where(eq(postTable.status, "draft"))
    .orderBy(desc(postTable.createdAt))
    .limit(5);
  return posts;
};

export const fetchRecents = async () => {
  const [recentPublished, recentDrafts] = await Promise.all([
    fetchRecentPublished(),
    fetchRecentDrafts(),
  ]);
  return { recentPublished, recentDrafts };
};
