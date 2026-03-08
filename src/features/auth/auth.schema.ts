import { userTable } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

const insertUserSchema = createInsertSchema(userTable);

export const loginUserSchema = insertUserSchema
  .pick({
    email: true,
  })
  .extend({
    password: z.string().min(8, {
      error: (iss) =>
        iss.input?.length === 0
          ? "Password is required"
          : "Password should >= 8 characters",
    }),
  });
