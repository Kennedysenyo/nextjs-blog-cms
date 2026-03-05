"use server";

import { auth } from "@/lib/better-auth/auth";
import {
  CreateUserFormErrors,
  CreateUserFormResponseType,
  CreateUserInserType,
} from "./users.types";
import { createUserInsertSchema } from "./users.schema";
import z from "zod";
import { requirePermission } from "../auth/authorize";
import { db } from "@/db/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const createUser = async ({
  name,
  email,
  password,
  role,
}: CreateUserInserType): Promise<string | null> => {
  try {
    await requirePermission({ user: ["create"] });

    const data = await auth.api.createUser({
      body: {
        email,
        password,
        name,
        role,
      },
    });

    if (data.user.id) {
      await db
        .update(userTable)
        .set({ emailVerified: true })
        .where(eq(userTable.id, data.user.id));
    }

    return null;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return error as string;
  }
};

export const validateCreateUserForm = async (
  _prevState: CreateUserFormResponseType,
  formData: FormData,
): Promise<CreateUserFormResponseType> => {
  const rawInput = Object.fromEntries(formData);
  console.log(rawInput);

  const result = createUserInsertSchema.safeParse(rawInput);

  if (!result.success) {
    let errors: CreateUserFormErrors = {};

    const flattenedErrors = z.flattenError(result.error).fieldErrors;

    for (const [key, value] of Object.entries(flattenedErrors)) {
      errors = { ...errors, [key]: value[0] };
    }

    return { errors, errorMessage: null, success: false };
  }
  const { name, email, password, role } = result.data;

  const errorMessage = await createUser({ name, email, password, role });

  if (errorMessage) {
    return { errors: {}, errorMessage, success: false };
  }

  return { errors: {}, success: true, errorMessage: null };
};
