"use server";

import { db } from "@/db/db";
import { postsCategoriesTable } from "@/db/schema";

import { count, eq, ilike, sql, SQL } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { CategorySelectType } from "./categories.types";
import { fi } from "zod/v4/locales";

export const fetchCategories = async (): Promise<CategorySelectType[]> => {
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

const ITEMS_PER_PAGE = 10;

export const fetchCategoriesTotalPages = async (term: string) => {
  try {
    const conditions: SQL[] = [];

    if (term?.trim()) {
      const pattern = `%${term}%`;
      conditions.push(sql`
      (
       posts_categories.id::TEXT ILIKE ${pattern} OR 
       posts_categories.name ILIKE ${pattern} OR
       posts_categories.slug ILIKE ${pattern}
      )
      `);
    }

    let joinedConditions: SQL;
    let result: { total: number }[];

    if (conditions.length > 0) {
      joinedConditions = conditions.reduce(
        (acc, curr, i) => (i === 0 ? curr : sql`${acc} AND ${curr}`),
        sql``,
      );
      result = await db
        .select({ total: count() })
        .from(postsCategoriesTable)
        .where(joinedConditions);
    } else {
      result = await db.select({ total: count() }).from(postsCategoriesTable);
    }

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

    if (term?.trim()) {
      const pattern = `%${term}%`;

      conditions.push(sql`
        (
       posts_categories.id::TEXT ILIKE ${pattern} OR
       posts_categories.name ILIKE ${pattern} OR
       posts_categories.slug ILIKE ${pattern}
        )
        `);
    }

    let joinedConditions: SQL;
    let result: { id: string; name: string; slug: string }[];

    if (conditions.length > 0) {
      joinedConditions = conditions.reduce(
        (acc, curr, i) => (i === 0 ? curr : sql`${acc} AND ${curr}`),
        sql``,
      );

      result = await db
        .select({
          id: postsCategoriesTable.id,
          name: postsCategoriesTable.name,
          slug: postsCategoriesTable.slug,
        })
        .from(postsCategoriesTable)
        .where(joinedConditions)
        .limit(ITEMS_PER_PAGE)
        .offset(offset);
    } else {
      result = await db
        .select({
          id: postsCategoriesTable.id,
          name: postsCategoriesTable.name,
          slug: postsCategoriesTable.slug,
        })
        .from(postsCategoriesTable)
        .limit(ITEMS_PER_PAGE)
        .offset(offset);
    }

    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching categories");
  }
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
