"use server";

import {
  CreateCategoryFormResponseType,
  CreateCategoryFormErrors,
  InsertCategoryType,
  UpdateCategoryFormResponseType,
  UpdateCategoryFormErrors,
  UpdateCategoryType,
} from "@/features/categories/categories.types";
import {
  createCategoryInsertSchema,
  updateCategoryInsertSchema,
} from "@/features/categories/categories.schema";
import z from "zod";

import { db } from "@/db/db";
import { postsCategoriesTable } from "@/db/schema";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { requirePermission, requireSession } from "../auth/authorize";

export const addCategory = async ({
  name,
  slug,
}: InsertCategoryType): Promise<string | null> => {
  try {
    await requirePermission({ category: ["create"] });
    const session = await requireSession();

    if (!session) {
      redirect("/login");
    }

    await requirePermission({ category: ["create"] });

    await db.insert(postsCategoriesTable).values({
      id: crypto.randomUUID(),
      name,
      slug,
    });

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

export const validateCreateCategoryForm = async (
  _prevState: CreateCategoryFormResponseType,
  formData: FormData,
): Promise<CreateCategoryFormResponseType> => {
  const rawInput = Object.fromEntries(formData);

  const result = createCategoryInsertSchema.safeParse(rawInput);

  if (!result.success) {
    let errors: CreateCategoryFormErrors = {};

    const flattenedErrors = z.flattenError(result.error).fieldErrors;

    for (const [key, value] of Object.entries(flattenedErrors)) {
      errors = { ...errors, [key]: value[0] };
    }

    return { errors, errorMessage: null, success: false };
  }
  const { data } = result;
  const errorMessage = await addCategory(data);
  if (errorMessage) {
    return { errors: {}, success: false, errorMessage };
  }
  return { errors: {}, success: true, errorMessage: null };
};

export const updateCategory = async ({
  id,
  name,
  slug,
}: UpdateCategoryType) => {
  try {
    const session = await requireSession();

    if (!session) {
      redirect("/login");
    }

    await requirePermission({ category: ["update"] });

    await db
      .update(postsCategoriesTable)
      .set({
        name,
        slug,
      })
      .where(eq(postsCategoriesTable.id, id));

    return null;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    console.error(error as string);
    return error as string;
  }
};

export const validateEditCategoryForm = async (
  id: string,
  _prevState: UpdateCategoryFormResponseType,
  formData: FormData,
): Promise<UpdateCategoryFormResponseType> => {
  const rawInpt = Object.fromEntries(formData);

  const result = updateCategoryInsertSchema.safeParse(rawInpt);

  if (!result.success) {
    let errors: UpdateCategoryFormErrors = {};

    const flattenedErrors = z.flattenError(result.error).fieldErrors;

    for (const [key, value] of Object.entries(flattenedErrors)) {
      errors = { ...errors, [key]: value[0] };
    }

    return { errors, errorMessage: null, success: false };
  }

  const { data } = result;

  const errorMessage = await updateCategory({ ...data, id });
  if (errorMessage) {
    return { errors: {}, success: false, errorMessage };
  }
  return { errors: {}, success: true, errorMessage: null };
};
