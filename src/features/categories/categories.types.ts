import z from "zod";
import { createCategoryInsertSchema } from "./categories.schema";

// Category Creation
export type InsertCategoryType = z.infer<typeof createCategoryInsertSchema>;

export type CreateCategoryFormErrors = Partial<
  Record<keyof InsertCategoryType, string>
>;

export interface CreateCategoryFormResponseType {
  errors: CreateCategoryFormErrors;
  success: boolean;
  errorMessage: string | null;
}

// Updating Category
export interface UpdateCategoryType extends InsertCategoryType {
  id: string;
}

export interface UpdateCategoryFormType extends InsertCategoryType {}

export type UpdateCategoryFormErrors = Partial<
  Record<keyof UpdateCategoryType, string>
>;

export interface UpdateCategoryFormResponseType {
  errors: UpdateCategoryFormErrors;
  success: boolean;
  errorMessage: string | null;
}
