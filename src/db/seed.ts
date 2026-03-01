import { account } from "./data/account";
import { postCategories } from "./data/post-categories";
import { postSeo } from "./data/post-seo";
import { posts } from "./data/posts";
import { session } from "./data/session";
import { user } from "./data/user";
// import { db } from "./db";
import {
  accountTable,
  postsCategoriesTable,
  postSeoTable,
  postTable,
  userSessionTable,
  userTable,
} from "./schema";

import { env } from "@/env/server";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/libsql";
import Database from "better-sqlite3";

dotenv.config({ path: ".env.local" });

// const sqlite = new Database("./db/database.db");
export const db = drizzle(process.env.DB_FILE_NAME!);

async function main() {
  try {
    console.log("....Starting ");
    await db.transaction(async (tx) => {
      account;
      await tx.insert(userTable).values(user);
      await tx.insert(accountTable).values(account);
      await tx.insert(userSessionTable).values(session);
      await tx.insert(postsCategoriesTable).values(postCategories);
      await tx.insert(postTable).values(posts);
      await tx.insert(postSeoTable).values(postSeo);
    });

    console.log("...Data inserted successfully✅ ");
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }
    console.error(error as string);
  }
}

main();
