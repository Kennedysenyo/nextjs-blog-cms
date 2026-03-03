import z from "zod";
import { createPostSchema, updateSeoSchema } from "./posts.schema";

export type CreatePostInput = z.infer<typeof createPostSchema>;

export type UpdatePostInput = CreatePostInput;

export type CreatePostInputFormErrors = Partial<
  Record<keyof CreatePostInput, string>
>;

export type EditPostInputFormErrors = CreatePostInputFormErrors;

export interface CreatePostInputReturnedType {
  postId: string | null;
  errorMessage: string | null;
}

export interface CreatePostInputResponseType {
  errors: CreatePostInputFormErrors;
  success: boolean;
  returned: CreatePostInputReturnedType;
}

export interface EditPostInputResponseType extends Pick<
  CreatePostInputResponseType,
  "errors" | "success"
> {
  errorMessage: string | null;
}

export interface CreateSeoInput extends Omit<
  z.infer<typeof updateSeoSchema>,
  "keywords"
> {
  keywords: string[];
}

export type CreateSeoInputFormErrors = Partial<
  Record<keyof CreateSeoInput, string>
>;

export interface SeoFormResponseType {
  errors: CreateSeoInputFormErrors;
  success: boolean;
  errorMessage: string | null;
}
