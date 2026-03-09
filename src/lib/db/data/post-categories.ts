import { InferInsertModel } from "drizzle-orm";
import { postsCategoriesTable } from "../schema";

type PostCategoriesType = InferInsertModel<typeof postsCategoriesTable>;

export const postCategories: PostCategoriesType[] = [
  {
    id: "3ca11495-d09b-43a5-8166-d4296bc89730",
    name: "web design",
    slug: "web-design",
    createdAt: new Date("2026-01-19 11:50:50.754393+00"),
  },
  {
    id: "5262505e-1ae3-47fd-9f1f-36f909c314b7",
    name: "Local News",
    slug: "local-news",
    createdAt: new Date("2026-01-19 11:53:59.374107+00"),
  },
  {
    id: "6e3b91b6-aa10-4bb1-8b80-da0f09b8f3c4",
    name: "Marketing",
    slug: "marketing",
    createdAt: new Date("2026-01-19 11:51:20.257715+00"),
  },
  {
    id: "aed66f8c-316c-4a49-accd-d34ab52ef8ba",
    name: "seo",
    slug: "seo",
    createdAt: new Date("2026-01-19 11:51:01.862335+00"),
  },
  {
    id: "e4cc5690-a1e4-4dd3-aa84-0ea42bf13f7f",
    name: "Business Strategy",
    slug: "business-strategy",
    createdAt: new Date("2026-01-19 11:53:45.948234+00"),
  },
];
