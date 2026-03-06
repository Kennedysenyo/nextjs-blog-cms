import { createAccessControl } from "better-auth/plugins";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statements = {
  ...defaultStatements,
  post: ["create", "update:any", "update:own", "delete", "publish", "archive"],
  category: ["create", "delete", "update"],
  user: ["create", "update:any", "update:own", "delete", "ban", "impersonate"],
  session: ["list", "revoke", "delete"],
} as const;

export type Resource = keyof typeof statements;
export type Action<R extends Resource> = (typeof statements)[R][number];

export const fullAc = createAccessControl(statements);

export const adminRole = fullAc.newRole({
  ...adminAc,
  post: ["create", "archive", "update:any", "update:own", "publish", "delete"],
  category: ["create", "delete", "update"],
  user: ["create", "update:any", "ban", "delete", "impersonate"],
  session: ["delete", "list", "revoke"],
});

export const editorRole = fullAc.newRole({
  post: ["create", "update:any", "update:own", "archive", "publish", "delete"],
  user: ["update:own"],
});

export const userRole = fullAc.newRole({
  post: ["create", "update:own"],
  user: ["update:own"],
});

`
Failed query: update "post_seo" set "metaTitle" = $1, "metaDescription" = $2, "canonicalUrl" = $3, "ogTitle" = $4, "ogDescription" = $5, "ogImage" = $6, "ogType" = $7, "twitterCard" = $8, "twitterTittle" = $9, "twitterDescription" = $10, "twitterImage" = $11, "keywords" = $12 where "post_seo"."postId" = $13 params: How to Get More Customers for Your Business Using Digital Marketing (2026 Guide),A simple marketing system can bring steady customers. Here’s what works in Ghana in 2026—and how Websendor can do it for you.,http://localhost:3000/insights/how-to-get-more-customers-for-your-business-using-digital-marketing-2026-guide,How to Get More Customers for Your Business Using Digital Marketing (2026 Guide),A simple marketing system can bring steady customers. Here’s what works in Ghana in 2026—and how Websendor can do it for you.,https://mhvnss9dtliybovr.public.blob.vercel-storage.com/posts/1-19-2026-16-52-19,article,summary_large_image,How to Get More Customers for Your Business Using Digital Marketing (2026 Guide),A simple marketing system can bring steady customers. Here’s what works in Ghana in 2026—and how Websendor can do it for you.,https://mhvnss9dtliybovr.public.blob.vercel-storage.com/posts/1-19-2026-16-52-19,,13b86a22-7bda-43e5-9a9b-0e590e407094`;
