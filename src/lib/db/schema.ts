import { InferSelectModel, sql } from "drizzle-orm";
import {
  AnyPgColumn,
  boolean,
  check,
  date,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin", "editor"]);
export const statusEnum = pgEnum("status", ["draft", "published", "archived"]);
export const robotsEnum = pgEnum("robots", [
  "index, follow",
  "noindex, follow",
  "index, nofollow",
  "noindex, nofollow",
]);
export const ogTypeEnum = pgEnum("ogType", ["article", "website", "profile"]);
export const twitterCardEnum = pgEnum("twitterCard", [
  "summary",
  "summary_large_image",
  "app",
  "player",
]);

export const userTable = pgTable(
  "user",
  {
    id: text().primaryKey(),
    name: varchar({ length: 100 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    emailVerified: boolean("emailVerified").notNull().default(false),
    image: text(),
    role: roleEnum().notNull().default("user"),
    banned: boolean().notNull().default(false),
    banReason: text("banReason"),
    banExpires: date("banExpires").default(sql`null`),
    isActive: boolean("isActive").notNull().default(true),
    createdBy: text("createdBy").references((): AnyPgColumn => userTable.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => [
    check("user_role_check", sql`${table.role} IN ('admin', 'user', 'editor')`),
    check(
      "user_ban_reason_check",
      sql`(${table.banned} = 'true' AND ${table.banReason} IS NOT NULL)
       OR
       (${table.banned} = 'false' AND ${table.banReason} IS NULL)`,
    ),
  ],
);

export const accountTable = pgTable("account", {
  id: text().primaryKey().notNull(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text(),
  password: text(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const userSessionTable = pgTable("session", {
  id: text().primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text().unique().notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .references(() => userTable.id, { onDelete: "cascade" })
    .notNull(),
});

export const userVerificationTable = pgTable("verification", {
  id: text().primaryKey().notNull(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const postsCategoriesTable = pgTable("posts_categories", {
  id: uuid()
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  name: varchar({ length: 100 }).unique().notNull(),
  slug: text().unique().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const postTable = pgTable(
  "posts",
  {
    id: uuid()
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    title: text().notNull(),
    slug: text().notNull().unique(),
    contentMd: text("contentMd").notNull(),
    excerpt: varchar({ length: 161 }).notNull(),
    featuredImage: text("featuredImage").notNull(),
    categoryId: uuid("categoryId")
      .notNull()
      .references(() => postsCategoriesTable.id, { onDelete: "set null" }),
    authorId: text("authorId")
      .notNull()
      .references(() => userTable.id),
    status: statusEnum().notNull().default("draft"),
    publishedAt: timestamp("publishedAt").default(sql`null`),
    archivedAt: timestamp("archivedAt").default(sql`null`),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => [
    check(
      "posts_state_check",
      sql`(
      (
      ${table.status} = 'draft' AND 
      ${table.publishedAt} IS NULL AND 
      ${table.archivedAt} IS NULL
      ) OR (
       ${table.status} = 'published' AND
        ${table.publishedAt} IS NOT NULL AND 
        ${table.archivedAt} IS NULL
        ) OR (
         ${table.status} = 'archived' AND 
         ${table.publishedAt} IS NULL AND 
         ${table.archivedAt} IS NOT NULL
         )
      ) `,
    ),
  ],
);

export const postsSlugsTable = pgTable("posts_slugs", {
  id: uuid()
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  postId: uuid("postId")
    .references(() => postTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  slug: text().notNull(),
  isCurrent: boolean("isCurrent").notNull().default(true),
  createdAt: timestamp("createAt").defaultNow().notNull(),
});

// POST SEO
export const postSeoTable = pgTable(
  "post_seo",
  {
    postId: uuid("postId")
      .primaryKey()
      .notNull()
      .references(() => postTable.id),
    metaTitle: text("metaTitle"),
    metaDescription: text("metaDescription"),
    canonicalUrl: text("canonicalUrl").unique(),
    robots: robotsEnum().notNull().default("index, follow"),
    ogTitle: text("ogTitle"),
    ogDescription: text("ogDescription"),
    ogImage: text("ogImage"),
    ogType: ogTypeEnum().default("article").notNull(),
    twitterCard: twitterCardEnum().notNull().default("summary_large_image"),
    twitterTitle: text("twitterTitle"),
    twitterDescription: text("twitterDescription"),
    twitterImage: text("twitterImage"),
    keywords: text().$type<string[]>(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [
    check(
      "post_seo_ogType_check",
      sql`${table.ogType} IN ('article', 'website', 'profile')`,
    ),
    check(
      "post_seo_robots_check",
      sql`${table.robots} IN ('index, follow', 'noindex, follow', 'index, nofollow', 'noindex, nofollow')`,
    ),
    check(
      "post_seo_twitterCard_check",
      sql`${table.twitterCard} IN ('summary', 'summary_large_image', 'app', 'player')`,
    ),
  ],
);

export type UserSelect = InferSelectModel<typeof userTable>; // users
export type CategoriesSelect = InferSelectModel<typeof postsCategoriesTable>; // categories
export type PostSelect = InferSelectModel<typeof postTable>; //posts
