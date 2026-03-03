"use server";

import z from "zod";
import { loginUserSchema } from "./auth.schema";
import { LoginUserFormState, LoginUserInputError } from "./auth.types";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

export const logOut = async () => {
  await auth.api.signOut({
    headers: await headers(),
  });
};

const login = async (
  email: string,
  password: string,
): Promise<string | null> => {
  try {
    const result = await auth.api.signInEmail({
      body: { email, password, rememberMe: true },
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

export const validateLogin = async (
  _prevState: LoginUserFormState,
  formData: FormData,
): Promise<LoginUserFormState> => {
  const userInput = Object.fromEntries(formData);

  const result = loginUserSchema.safeParse(userInput);

  if (!result.success) {
    let errors: LoginUserInputError = {};
    const flatenedErrors = z.flattenError(result.error).fieldErrors;

    for (const [key, value] of Object.entries(flatenedErrors)) {
      errors = { ...errors, [key]: value[0] };
    }

    return { errors, errorMessage: null, success: false };
  }
  const { email, password } = result.data;

  const errorMessage = await login(email, password);

  if (errorMessage) {
    return { errors: {}, success: false, errorMessage };
  }

  return { errors: {}, success: true, errorMessage: null };
};
