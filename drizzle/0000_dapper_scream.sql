CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`userId` text NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`accessTokenExpiresAt` integer DEFAULT (unixepoch()),
	`refreshTokenExpiresAt` integer DEFAULT (unixepoch()),
	`scope` text,
	`password` text,
	`createdAt` integer DEFAULT (unixepoch()),
	`updatedAt` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `post_seo` (
	`postId` text PRIMARY KEY NOT NULL,
	`metaTitle` text,
	`metaDescription` text,
	`canonicalUrl` text,
	`robots` text DEFAULT 'index, follow' NOT NULL,
	`ogTitle` text,
	`ogDescription` text,
	`ogImage` text,
	`ogType` text DEFAULT 'article' NOT NULL,
	`twitterCard` text DEFAULT 'summary_large_image' NOT NULL,
	`twitterTitle` text,
	`twitterDescription` text,
	`twitterImage` text,
	`keywords` text,
	`createdAt` integer DEFAULT (unixepoch()),
	`updatedAt` integer DEFAULT (unixepoch()),
	CONSTRAINT "post_seo_ogType_check" CHECK("post_seo"."ogType" IN ('article','website','profile')),
	CONSTRAINT "post_seo_robots_check" CHECK("post_seo"."robots" IN ('index, follow','noindex, follow','index, nofollow', 'noindex, nofollow')),
	CONSTRAINT "post_seo_twitterCard_check" CHECK("post_seo"."twitterCard" IN ('summary', 'summary_large_image', 'app', 'player'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `post_seo_canonicalUrl_unique` ON `post_seo` (`canonicalUrl`);--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`contentMd` text NOT NULL,
	`excerpt` text,
	`featuredImage` text NOT NULL,
	`categoryId` text NOT NULL,
	`authorId` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`publishedAt` integer,
	`archivedAt` integer,
	`createdAt` integer DEFAULT (unixepoch()),
	`updatedAt` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`categoryId`) REFERENCES `posts_categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "posts_state_check" CHECK(
      (
        ("posts"."status" = 'draft'
          AND "posts"."publishedAt" IS NULL
          AND "posts"."archivedAt" IS NULL
        )
        OR
        ("posts"."status" = 'published'
          AND "posts"."publishedAt" IS NOT NULL
          AND "posts"."archivedAt" IS NULL
        )
        OR
        ("posts"."status" = 'archived'
          AND "posts"."archivedAt" IS NOT NULL
          AND "posts"."publishedAt" IS NULL
        )
      )
    )
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
CREATE TABLE `posts_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_categories_name_unique` ON `posts_categories` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `posts_categories_slug_unique` ON `posts_categories` (`slug`);--> statement-breakpoint
CREATE TABLE `posts_slugs` (
	`id` text PRIMARY KEY NOT NULL,
	`postId` text NOT NULL,
	`slug` text NOT NULL,
	`isCurrent` integer DEFAULT true NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expiresAt` integer DEFAULT (unixepoch()),
	`token` text NOT NULL,
	`impersonatedBy` text,
	`createdAt` integer DEFAULT (unixepoch()),
	`updatedAt` integer DEFAULT (unixepoch()),
	`ipAddress` text,
	`userAgent` text,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`emailVerified` integer DEFAULT false NOT NULL,
	`image` text,
	`role` text DEFAULT 'user' NOT NULL,
	`banned` integer DEFAULT false NOT NULL,
	`banReason` text,
	`banExpires` integer DEFAULT (unixepoch()),
	`isActive` integer DEFAULT true NOT NULL,
	`createdBy` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "user_role_check" CHECK("user"."role" IN ('user', 'admin', 'editor')),
	CONSTRAINT "user_ban_reason_check" CHECK("user"."banned" = 'true' AND "user"."banReason" IS NOT NULL)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` integer,
	`createdAt` integer DEFAULT (unixepoch()),
	`updatedAt` integer DEFAULT (unixepoch())
);
