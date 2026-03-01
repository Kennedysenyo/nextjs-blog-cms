import { account } from "./data/account";
import { postCategories } from "./data/post-categories";
import { postSeo } from "./data/post-seo";
import { posts } from "./data/posts";
import { session } from "./data/session";
import { user } from "./data/user";
import { db } from "./db";
import {
  accountTable,
  postsCategoriesTable,
  postSeoTable,
  postTable,
  userSessionTable,
  userTable,
} from "./schema";

async function main() {
  await db.transaction(async (tx) => {
    account;
    await tx.insert(userTable).values(user);
    await tx.insert(accountTable).values(account);
    await tx.insert(userSessionTable).values(session);
    await tx.insert(postsCategoriesTable).values(postCategories);
    await tx.insert(postTable).values(posts);
    await tx.insert(postSeoTable).values(postSeo);
  });
}

main();
