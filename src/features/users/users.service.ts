"use server";

import { auth } from "@/lib/better-auth/auth";
import {
  CreateUserFormErrors,
  CreateUserFormResponseType,
  CreateUserInserType,
} from "./users.types";
import { createUserInsertSchema } from "./users.schema";
import z from "zod";

export const createUser = async ({
  name,
  email,
  password,
}: CreateUserInserType) => {
  try {
    const data = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
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

  const result = createUserInsertSchema.safeParse(rawInput);

  if (!result.success) {
    let errors: CreateUserFormErrors = {};

    const flattenedErrors = z.flattenError(result.error).fieldErrors;

    for (const [key, value] of Object.entries(flattenedErrors)) {
      errors = { ...errors, [key]: value[0] };
    }

    return { errors, errorMessage: null, success: false };
  }
  const { name, email, password } = result.data;

  const errorMessage = await createUser({ name, email, password });

  if (errorMessage) {
    return { errors: {}, errorMessage, success: false };
  }

  return { errors: {}, success: true, errorMessage: null };
};
