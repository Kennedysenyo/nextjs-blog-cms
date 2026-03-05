"use server";

import { db } from "@/db/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { SelectUserAdminEdit } from "./users.types";

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
