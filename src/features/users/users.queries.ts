import { db } from "@/db/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { email } from "zod";

// export const fetchUserDetails = async(id: string) =>
//   {
//    try {
//      const [user] = await db.select({
//        name: userTable.name,

//     }).from(userTable).where(eq(userTable.id, id))
//    }
//  }
