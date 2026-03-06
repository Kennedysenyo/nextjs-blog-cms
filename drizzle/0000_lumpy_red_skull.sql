CREATE TYPE "public"."ogType" AS ENUM('article', 'website', 'profile');--> statement-breakpoint
CREATE TYPE "public"."robots" AS ENUM('index, follow', 'noindex, follow', 'index, nofollow', 'noindex, nofollow');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin', 'editor');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."twitterCard" AS ENUM('summary', 'summary_large_image', 'app', 'player');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_seo" (
	"postId" uuid PRIMARY KEY NOT NULL,
	"metaTitle" text,
	"metaDescription" text,
	"canonicalUrl" text,
	"robots" "robots" DEFAULT 'index, follow' NOT NULL,
	"ogTitle" text,
	"ogDescription" text,
	"ogImage" text,
	"ogType" "ogType" DEFAULT 'article' NOT NULL,
	"twitterCard" "twitterCard" DEFAULT 'summary_large_image' NOT NULL,
	"twitterTitle" text,
	"twitterDescription" text,
	"twitterImage" text,
	"keywords" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "post_seo_canonicalUrl_unique" UNIQUE("canonicalUrl"),
	CONSTRAINT "post_seo_ogType_check" CHECK ("post_seo"."ogType" IN ('article', 'website', 'profile')),
	CONSTRAINT "post_seo_robots_check" CHECK ("post_seo"."robots" IN ('index, follow', 'noindex, follow', 'index, nofollow', 'noindex, nofollow')),
	CONSTRAINT "post_seo_twitterCard_check" CHECK ("post_seo"."twitterCard" IN ('summary', 'summary_large_image', 'app', 'player'))
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"contentMd" text NOT NULL,
	"excerpt" varchar(161) NOT NULL,
	"featuredImage" text NOT NULL,
	"categoryId" uuid NOT NULL,
	"authorId" text NOT NULL,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"publishedAt" timestamp DEFAULT null,
	"archivedAt" timestamp DEFAULT null,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug"),
	CONSTRAINT "posts_state_check" CHECK ((
      (
      "posts"."status" = 'draft' AND 
      "posts"."publishedAt" IS NULL AND 
      "posts"."archivedAt" IS NULL
      ) OR (
       "posts"."status" = 'published' AND
        "posts"."publishedAt" IS NOT NULL AND 
        "posts"."archivedAt" IS NULL
        ) OR (
         "posts"."status" = 'archived' AND 
         "posts"."publishedAt" IS NULL AND 
         "posts"."archivedAt" IS NOT NULL
         )
      ) )
);
--> statement-breakpoint
CREATE TABLE "posts_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "posts_categories_name_unique" UNIQUE("name"),
	CONSTRAINT "posts_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "posts_slugs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"postId" uuid NOT NULL,
	"slug" text NOT NULL,
	"isCurrent" boolean DEFAULT true NOT NULL,
	"createAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" "role" DEFAULT 'user' NOT NULL,
	"banned" boolean DEFAULT false NOT NULL,
	"banReason" text,
	"banExpires" date DEFAULT null,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdBy" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_role_check" CHECK ("user"."role" IN ('admin', 'user', 'editor')),
	CONSTRAINT "user_ban_reason_check" CHECK (("user"."banned" = 'true' AND "user"."banReason" IS NOT NULL)
       OR
       ("user"."banned" = 'false' AND "user"."banReason" IS NULL))
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_seo" ADD CONSTRAINT "post_seo_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_categoryId_posts_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."posts_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_user_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts_slugs" ADD CONSTRAINT "posts_slugs_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;