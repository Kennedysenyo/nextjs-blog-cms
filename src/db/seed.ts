import dotenv from "dotenv";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import { account } from "./data/account";
import { postCategories } from "./data/post-categories";
import { postSeo } from "./data/post-seo";
import { posts } from "./data/posts";
import { session } from "./data/session";
import { user } from "./data/user";

import {
  accountTable,
  postsCategoriesTable,
  postSeoTable,
  postTable,
  userSessionTable,
  userTable,
} from "./schema";

dotenv.config({ path: ".env.local" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: {
    rejectUnauthorized: false,
  },
});

const db = drizzle(pool);

async function main() {
  try {
    console.log("....Starting");

    await db.transaction(async (tx) => {
      await tx.insert(userTable).values(user);
      await tx.insert(accountTable).values(account);
      await tx.insert(userSessionTable).values(session);
      await tx.insert(postsCategoriesTable).values(postCategories);
      await tx.insert(postTable).values(posts);
      await tx.insert(postSeoTable).values(postSeo);
    });

    console.log("...Data inserted successfully ✅");
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
}

main();
