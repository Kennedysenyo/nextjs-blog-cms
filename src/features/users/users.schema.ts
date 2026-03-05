import { userTable } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

const insertUserSchema = createInsertSchema(userTable);

export const createUserInsertSchema = insertUserSchema
  .pick({
    name: true,
    email: true,
    role: true,
  })
  .extend({
    name: z.string().min(3, {
      error: (iss) =>
        iss.input?.length === 0
          ? "Name is required"
          : "Name must be > 3 characters",
    }),
    email: z.email(),
    password: z.string().min(8, {
      error: (iss) =>
        iss.input?.length === 0
          ? "Password is required"
          : "Password must be > 8 characters",
    }),
    confirmPassword: z.string().min(8, {
      error: (iss) =>
        iss.input?.length === 0
          ? "Password is required"
          : "Password must be > 8 characters",
    }),
    role: z.enum(["user", "admin", "editor"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateUserInsertAdminSchema = insertUserSchema
  .pick({
    name: true,
    email: true,
    role: true,
  })
  .extend({
    name: z.string().min(3, {
      error: (iss) =>
        iss.input?.length === 0
          ? "Name is required"
          : "Name must be > 3 characters",
    }),
    email: z.email(),
    role: z.enum(["user", "admin", "editor"]),
  });

export const updateUserInsertUserSchema = insertUserSchema.pick({
  name: true,
});
