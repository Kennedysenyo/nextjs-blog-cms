import z from "zod";
import { createUserInsertSchema } from "./users.schema";

export type CreateUserFormType = z.infer<typeof createUserInsertSchema>;
export type CreateUserInserType = Omit<CreateUserFormType, "confirmPassword">;

export type CreateUserFormErrors = Partial<
  Record<keyof CreateUserFormType, string>
>;

export interface CreateUserFormResponseType {
  errors: CreateUserFormErrors;
  success: boolean;
  errorMessage: string | null;
}
