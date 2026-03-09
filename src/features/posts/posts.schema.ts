import { postSeoTable, postTable } from "@/lib/db/schema";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

const insertPostSchema = createInsertSchema(postTable);

export const createPostSchema = insertPostSchema
  .pick({
    title: true,
    slug: true,
    contentMd: true,
    categoryId: true,
    excerpt: true,
    featuredImage: true,
  })
  .extend({
    title: z.string().min(3, {
      error: (iss) =>
        iss.input?.length === 0
          ? "Title is required"
          : "Title must be at least 3 characters",
    }),
    slug: z.string().min(3, {
      error: (iss) =>
        iss.input?.length === 0
          ? "Slug is required"
          : "Slug must be atleast 3 characters",
    }),
    contentMd: z.string().min(10, {
      error: (iss) =>
        iss.input?.length === 0
          ? "Content is required"
          : "Content must be atleatst 10 characters",
    }),
    categoryId: z.uuidv4(),
    excerpt: z
      .string()
      .min(120, {
        error: (iss) =>
          iss.input?.length === 0
            ? "Excerpt is required"
            : "Excerpt must be < 120 characters",
      })
      .max(160, "Excerpt must be between 160 and 120 characters"),
    featuredImage: z.url(),
  });

export const editPostSchema = createPostSchema;

const insertSeoSchema = createInsertSchema(postSeoTable);

export const updateSeoSchema = insertSeoSchema
  .pick({
    metaTitle: true,
    metaDescription: true,
    keywords: true,
  })
  .extend({
    keywords: z.string(),
  });
