PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_post_seo` (
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
	CONSTRAINT "post_seo_ogType_check" CHECK("__new_post_seo"."ogType" IN ('article','website','profile')),
	CONSTRAINT "post_seo_robots_check" CHECK("__new_post_seo"."robots" IN ('index, follow','noindex, follow','index, nofollow', 'noindex, nofollow')),
	CONSTRAINT "post_seo_twitterCard_check" CHECK("__new_post_seo"."twitterCard" IN ('summary', 'summary_large_image', 'app', 'player'))
);
--> statement-breakpoint
INSERT INTO `__new_post_seo`("postId", "metaTitle", "metaDescription", "canonicalUrl", "robots", "ogTitle", "ogDescription", "ogImage", "ogType", "twitterCard", "twitterTitle", "twitterDescription", "twitterImage", "keywords", "createdAt", "updatedAt") SELECT "postId", "metaTitle", "metaDescription", "canonicalUrl", "robots", "ogTitle", "ogDescription", "ogImage", "ogType", "twitterCard", "twitterTitle", "twitterDescription", "twitterImage", "keywords", "createdAt", "updatedAt" FROM `post_seo`;--> statement-breakpoint
DROP TABLE `post_seo`;--> statement-breakpoint
ALTER TABLE `__new_post_seo` RENAME TO `post_seo`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `post_seo_canonicalUrl_unique` ON `post_seo` (`canonicalUrl`);