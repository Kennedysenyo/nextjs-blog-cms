import z from "zod";
import {
  createUserInsertSchema,
  updatePersonalAccountSchema,
  updateUserInsertAdminSchema,
} from "./users.schema";
import { InferSelectModel } from "drizzle-orm";
import { userTable } from "@/db/schema";

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

export type AdminUpdateUserInsertType = z.infer<
  typeof updateUserInsertAdminSchema
>;
export type AdminUpdateUserFormErrors = Partial<
  Record<keyof AdminUpdateUserInsertType, string>
>;

export interface AdminUpdateUserFormResponseType {
  errors: AdminUpdateUserFormErrors;
  success: boolean;
  errorMessage: string | null;
}

// Select

type UserSelectType = InferSelectModel<typeof userTable>;

export type SelectUserAdminEdit = Pick<
  UserSelectType,
  "id" | "name" | "email" | "role"
>;

export type UserTableSelect = Pick<
  UserSelectType,
  "id" | "name" | "email" | "role"
>;

export type UpdatePersonalAcountType = z.infer<
  typeof updatePersonalAccountSchema
>;

export interface SelectUpdatePersonalAccount extends UpdatePersonalAcountType {
  id: string;
}

export type UpdatePersonalAcountFormErrors = Partial<
  Record<keyof UpdatePersonalAcountType, string>
>;

export type UpdatePersonalAcountFormState = {
  errors: UpdatePersonalAcountFormErrors;
  success: boolean;
  errorMessage: string | null;
};
