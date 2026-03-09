"use server";

import { db } from "@/lib/db/db";
import { userTable } from "@/lib/db/schema";
import { count, eq, sql, SQL } from "drizzle-orm";
import { notFound } from "next/navigation";
import { SelectUserAdminEdit, UserTableSelect } from "./users.types";
import { requireSession } from "../auth/authorize";
import { email } from "zod";
import { role } from "better-auth/plugins";

const ITEMS_PER_PAGE = 10;

export const adminFetchUserById = async (
  id: string,
): Promise<SelectUserAdminEdit> => {
  try {
    const [user] = await db
      .select({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
        role: userTable.role,
      })
      .from(userTable)
      .where(eq(userTable.id, id));
    return user;
  } catch (error) {
    notFound();
  }
};

export const fetchUsersTotalPages = async (term: string) => {
  try {
    const conditions: SQL[] = [];

    if (term?.trim()) {
      const pattern = `%${term}%`;
      conditions.push(
        sql`(
          "user".id::TEXT ILIKE ${pattern} OR
          "user".name ILIKE ${pattern} OR
          "user".email ILIKE ${pattern} OR
          "user".role::TEXT ILIKE ${pattern}
          )`,
      );
    }

    let results: { total: number }[];
    let newConditions: SQL;

    if (conditions.length > 0) {
      newConditions = conditions.reduce(
        (acc, curr, i) => (i === 0 ? curr : sql`${acc} AND ${curr}`),
        sql``,
      );

      results = await db
        .select({ total: count() })
        .from(userTable)
        .where(newConditions);
    } else {
      results = await db.select({ total: count() }).from(userTable);
    }

    return Math.ceil(results[0].total / ITEMS_PER_PAGE);
  } catch (error) {
    // console.error(error);
    throw new Error("Error fetching user count");
  }
};

export const fetchUsersByFilter = async (currentPage: number, term: string) => {
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const conditions: SQL[] = [];

    if (term?.trim()) {
      const pattern = `%${term}%`;

      conditions.push(sql`(
       "user".id::TEXT ILIKE ${pattern} OR
       "user".name ILIKE ${pattern} OR
       "user".email ILIKE ${pattern} OR
       "user".role::TEXT ILIKE ${pattern}
        )`);
    }

    let users: UserTableSelect[];
    if (conditions.length > 0) {
      const joinedConditions: SQL = conditions.reduce(
        (acc, curr, i) => (i === 0 ? curr : sql`${acc} AND ${curr}`),
        sql``,
      );

      users = await db
        .select({
          id: userTable.id,
          name: userTable.name,
          email: userTable.email,
          role: userTable.role,
        })
        .from(userTable)
        .where(joinedConditions)
        .limit(ITEMS_PER_PAGE)
        .offset(offset);
    } else {
      users = await db
        .select({
          id: userTable.id,
          name: userTable.name,
          email: userTable.email,
          role: userTable.role,
        })
        .from(userTable)
        .limit(ITEMS_PER_PAGE)
        .offset(offset);
    }
    return users;
  } catch (error) {
    // console.error(error);
    throw new Error("Error fetching users");
  }
};

export const fetchUserDetails = async () => {
  try {
    const session = await requireSession();
    const userId = session.user.id;
    const [details] = await db
      .select({
        id: userTable.id,
        name: userTable.name,
        image: userTable.image,
        email: userTable.email,
        role: userTable.role,
      })
      .from(userTable)
      .where(eq(userTable.id, userId));
    return details;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    notFound();
  }
};

export const fetPersonalAccountDataForEdit = async () => {
  try {
    const session = await requireSession();

    const userId = session.user.id;

    const [data] = await db
      .select({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
      })
      .from(userTable)
      .where(eq(userTable.id, userId));
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    notFound();
  }
};
