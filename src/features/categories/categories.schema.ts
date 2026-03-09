import { postsCategoriesTable } from "@/lib/db/schema";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

const categoryInsertSchema = createInsertSchema(postsCategoriesTable);

export const createCategoryInsertSchema = categoryInsertSchema
  .pick({
    name: true,
    slug: true,
  })
  .extend({
    name: z.string().min(4, {
      error: (iss) =>
        iss.input?.length === 0 ? "Name is required" : "Name must be > 4",
    }),
    slug: z.string().min(4, {
      error: (iss) =>
        iss.input?.length === 0 ? "Slug is required" : "Slug must be > 4",
    }),
  });

export const updateCategoryInsertSchema = createCategoryInsertSchema;
