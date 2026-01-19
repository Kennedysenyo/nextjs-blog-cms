"use server";

import { auth } from "@/lib/better-auth/auth";

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
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
