PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user` (
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
	CONSTRAINT "user_role_check" CHECK("__new_user"."role" IN ('user', 'admin', 'editor')),
	CONSTRAINT "user_ban_reason_check" CHECK((
      "__new_user"."banned" = 'true' AND 
      "__new_user"."banReason" IS NOT NULL
      ) OR (
       "__new_user"."banned" = false AND 
       "__new_user"."banReason" IS NULL
       ))
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "name", "email", "emailVerified", "image", "role", "banned", "banReason", "banExpires", "isActive", "createdBy", "createdAt", "updatedAt") SELECT "id", "name", "email", "emailVerified", "image", "role", "banned", "banReason", "banExpires", "isActive", "createdBy", "createdAt", "updatedAt" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);