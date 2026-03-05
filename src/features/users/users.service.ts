"use server";

import { auth } from "@/lib/better-auth/auth";
import {
  AdminUpdateUserFormErrors,
  AdminUpdateUserFormResponseType,
  AdminUpdateUserInsertType,
  CreateUserFormErrors,
  CreateUserFormResponseType,
  CreateUserInserType,
} from "./users.types";
import {
  createUserInsertSchema,
  updateUserInsertAdminSchema,
} from "./users.schema";
import z from "zod";
import { requirePermission } from "../auth/authorize";
import { db } from "@/db/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

const createUser = async ({
  name,
  email,
  password,
  role,
}: CreateUserInserType): Promise<string | null> => {
  try {
    const session = await requirePermission({ user: ["create"] });
    const { id } = session.user;

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
        .set({ emailVerified: true, createdBy: id })
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
  // console.log(rawInput);

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

const adminUpdateUser = async (
  { name, email, role }: AdminUpdateUserInsertType,
  id: string,
): Promise<string | null> => {
  try {
    await requirePermission({ user: ["update:any"] });

    await auth.api.adminUpdateUser({
      body: {
        userId: id,
        data: {
          name,
          email,
          role,
        },
      },
      headers: await headers(),
    });

    return null;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return error as string;
  }
};

export const validateAdminUpdateUserForm = async (
  id: string,
  _preState: AdminUpdateUserFormResponseType,
  formData: FormData,
): Promise<AdminUpdateUserFormResponseType> => {
  const rawInput = Object.fromEntries(formData);

  const result = updateUserInsertAdminSchema.safeParse(rawInput);
  console.log(result);

  if (!result.success) {
    const flattenedErrors = z.flattenError(result.error).fieldErrors;
    let errors: AdminUpdateUserFormErrors = {};

    for (const [key, value] of Object.entries(flattenedErrors)) {
      errors = { ...errors, [key]: value[0] };
    }

    return { errors, errorMessage: null, success: false };
  }

  const errorMessage = await adminUpdateUser(result.data, id);

  if (errorMessage) {
    return { errors: {}, errorMessage, success: false };
  }

  return { errors: {}, errorMessage: null, success: true };
};
