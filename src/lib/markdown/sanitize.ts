import { defaultSchema } from "rehype-sanitize";

export const markdownSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "media"],
  attributes: {
    ...(defaultSchema.attributes ?? {}),
    media: ["data-url", "dataUrl"],
  },
};
