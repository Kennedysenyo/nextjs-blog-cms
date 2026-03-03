import z from "zod";
import { loginUserSchema } from "./auth.schema";

export type LoginUserInput = z.infer<typeof loginUserSchema>;

export type LoginUserInputError = Partial<Record<keyof LoginUserInput, string>>;

export interface LoginUserFormState {
  errors: LoginUserInputError;
  errorMessage: string | null;
  success: boolean;
}
