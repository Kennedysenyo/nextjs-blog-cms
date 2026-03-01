import { z } from "zod";

const EnvSchema = z.object({
  DB_FILE_NAME: z.string().min(1),
});

type EnvType = z.infer<typeof EnvSchema>;

export const env: EnvType = {
  DB_FILE_NAME: process.env.DB_FILE_NAME!,
};
