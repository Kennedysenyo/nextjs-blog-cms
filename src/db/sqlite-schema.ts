// import { sql } from "drizzle-orm";
// import {
//   AnySQLiteColumn,
//   check,
//   integer,
//   sqliteTable,
//   text,
// } from "drizzle-orm/sqlite-core";

// export const userTable = sqliteTable(
//   "user",
//   {
//     id: text().primaryKey().notNull(),
//     name: text().notNull(),
//     email: text().notNull().unique(),
//     emailVerified: integer("emailVerified", { mode: "boolean" })
//       .notNull()
//       .default(false),
//     image: text(),
//     role: text({ enum: ["user", "admin", "editor"] })
//       .default("user")
//       .notNull(),
//     banned: integer("banned", { mode: "boolean" }).notNull().default(false),
//     banReason: text("banReason"),
//     banExpires: integer("banExpires", { mode: "timestamp" }).default(sql`null`),
//     isActive: integer("isActive", { mode: "boolean" }).notNull().default(true),
//     createdBy: text("createdBy").references(
//       (): AnySQLiteColumn => userTable.id,
//       { onDelete: "set null" },
//     ),
//     createdAt: integer({ mode: "timestamp" })
//       .notNull()
//       .default(sql`(unixepoch())`),
//     updatedAt: integer({ mode: "timestamp" })
//       .notNull()
//       .default(sql`(unixepoch())`),
//   },
//   (table) => [
//     check("user_role_check", sql`${table.role} IN ('user', 'admin', 'editor')`),
//     check(
//       "user_ban_reason_check",
//       sql`(
//       ${table.banned} = 'true' AND
//       ${table.banReason} IS NOT NULL
//       ) OR (
//        ${table.banned} = false AND
//        ${table.banReason} IS NULL
//        )`,
//     ),
//   ],
// );

// export const accountTable = sqliteTable("account", {
//   id: text().primaryKey().notNull(),
//   accountId: text("accountId").notNull(),
//   providerId: text("providerId").notNull(),
//   userId: text("userId")
//     .notNull()
//     .references(() => userTable.id, { onDelete: "cascade" }),
//   accessToken: text("accessToken"),
//   refreshToken: text("refreshToken"),
//   idToken: text("idToken"),
//   accessTokenExpiresAt: integer("accessTokenExpiresAt", {
//     mode: "timestamp",
//   }).default(sql`(unixepoch())`),
//   refreshTokenExpiresAt: integer("refreshTokenExpiresAt", {
//     mode: "timestamp",
//   }).default(sql`(unixepoch())`),
//   scope: text(),
//   password: text(),
//   createdAt: integer("createdAt", { mode: "timestamp" }).default(
//     sql`(unixepoch())`,
//   ),
//   updatedAt: integer("updatedAt", { mode: "timestamp" }).default(
//     sql`(unixepoch())`,
//   ),
// });

// export const userSessionTable = sqliteTable("session", {
//   id: text().primaryKey().notNull(),
//   expiresAt: integer("expiresAt", { mode: "timestamp" }).default(
//     sql`(unixepoch())`,
//   ),
//   token: text().unique().notNull(),
//   impersonatedBy: text("impersonatedBy"),
//   createdAt: integer("createdAt", { mode: "timestamp" }).default(
//     sql`(unixepoch())`,
//   ),
//   updatedAt: integer("updatedAt", { mode: "timestamp" }).default(
//     sql`(unixepoch())`,
//   ),
//   ipAddress: text("ipAddress"),
//   userAgent: text("userAgent"),
//   userId: text("userId")
//     .notNull()
//     .references(() => userTable.id, { onDelete: "cascade" }),
// });

// export const userVerificationTable = sqliteTable("verification", {
//   id: text().primaryKey().notNull(),
//   identifier: text().notNull(),
//   value: text().notNull(),
//   expiresAt: integer("expiresAt", { mode: "timestamp" }),
//   createdAt: integer("createdAt", { mode: "timestamp" }).default(
//     sql`(unixepoch())`,
//   ),
//   updatedAt: integer("updatedAt", { mode: "timestamp" }).default(
//     sql`(unixepoch())`,
//   ),
// });

// export const postsCategoriesTable = sqliteTable("posts_categories", {
//   id: text().primaryKey().notNull(),
//   name: text().unique().notNull(),
//   slug: text().unique().notNull(),
//   createdAt: integer("createdAt", { mode: "timestamp" }).default(
//     sql`(unixepoch())`,
//   ),
// });

// export const postTable = sqliteTable(
//   "posts",
//   {
//     id: text().primaryKey().notNull(),
//     title: text().notNull(),
//     slug: text().notNull().unique(),
//     contentMd: text("contentMd").notNull(),
//     excerpt: text(),
//     featuredImage: text("featuredImage").notNull(),
//     categoryId: text("categoryId")
//       .notNull()
//       .references(() => postsCategoriesTable.id),
//     authorId: text("authorId")
//       .notNull()
//       .references(() => userTable.id),
//     status: text({ enum: ["draft", "published", "archived"] })
//       .notNull()
//       .default("draft"),
//     publishedAt: integer("publishedAt", { mode: "timestamp" }),
//     archivedAt: integer("archivedAt", { mode: "timestamp" }),
//     createdAt: integer("createdAt", { mode: "timestamp" }).default(
//       sql`(unixepoch())`,
//     ),
//     updatedAt: integer("updatedAt", { mode: "timestamp" }).default(
//       sql`(unixepoch())`,
//     ),
//   },
//   (table) => [
//     check(
//       "posts_state_check",
//       sql`
//       (
//         (${table.status} = 'draft'
//           AND ${table.publishedAt} IS NULL
//           AND ${table.archivedAt} IS NULL
//         )
//         OR
//         (${table.status} = 'published'
//           AND ${table.publishedAt} IS NOT NULL
//           AND ${table.archivedAt} IS NULL
//         )
//         OR
//         (${table.status} = 'archived'
//           AND ${table.archivedAt} IS NOT NULL
//           AND ${table.publishedAt} IS NULL
//         )
//       )
//     `,
//     ),
//   ],
// );

// export const postsSlugsTable = sqliteTable("posts_slugs", {
//   id: text().primaryKey(),
//   postId: text("postId")
//     .notNull()
//     .references(() => postTable.id, { onDelete: "cascade" }),
//   slug: text().notNull(),
//   isCurrent: integer("isCurrent", { mode: "boolean" }).notNull().default(true),
//   createdAt: integer("createdAt", { mode: "timestamp" }).default(
//     sql`(unixepoch())`,
//   ),
// });

// export const postSeoTable = sqliteTable(
//   "post_seo",
//   {
//     postId: text("postId").primaryKey(),
//     metaTitle: text("metaTitle"),
//     metaDescription: text("metaDescription"),
//     canonicalUrl: text("canonicalUrl").unique(),
//     robots: text({
//       enum: [
//         "index, follow",
//         "noindex, follow",
//         "index, nofollow",
//         "noindex, nofollow",
//       ],
//     })
//       .notNull()
//       .default("index, follow"),
//     ogTitle: text("ogTitle"),
//     ogDescription: text("ogDescription"),
//     ogImage: text("ogImage"),
//     ogType: text("ogType", { enum: ["article", "website", "profile"] })
//       .notNull()
//       .default("article"),
//     twitterCard: text("twitterCard", {
//       enum: ["summary", "summary_large_image", "app", "player"],
//     })
//       .notNull()
//       .default("summary_large_image"),
//     twitterTitle: text("twitterTitle"),
//     twitterDescription: text("twitterDescription"),
//     twitterImage: text("twitterImage"),
//     keywords: text().$type<string[]>(),
//     createdAt: integer("createdAt", { mode: "timestamp" }).default(
//       sql`(unixepoch())`,
//     ),
//     updatedAt: integer("updatedAt", { mode: "timestamp" }).default(
//       sql`(unixepoch())`,
//     ),
//   },
//   (table) => [
//     check(
//       "post_seo_ogType_check",
//       sql`${table.ogType} IN ('article','website','profile')`,
//     ),
//     check(
//       "post_seo_robots_check",
//       sql`${table.robots} IN ('index, follow','noindex, follow','index, nofollow', 'noindex, nofollow')`,
//     ),
//     check(
//       "post_seo_twitterCard_check",
//       sql`${table.twitterCard} IN ('summary', 'summary_large_image', 'app', 'player')`,
//     ),
//   ],
// );

// // export const user = userTable;
// // export const session = userSessionTable;
// // export const account = accountTable;
// // export const verification = userVerificationTable;
