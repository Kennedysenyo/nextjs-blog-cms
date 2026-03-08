import { InferInsertModel } from "drizzle-orm";
import { userTable } from "../schema";

type UserType = InferInsertModel<typeof userTable>;

export const user: UserType[] = [
  {
    id: "W8rqu1pphWDsetczc2A5VIxN4m65yDFk",
    name: "Websendor Team",
    email: "kensenyocoding@gmail.com",
    emailVerified: true,
    image: null,
    role: "admin",
    banned: false,
    banReason: null,
    banExpires: null,
    isActive: true,
    createdBy: null,
    createdAt: new Date("2026-01-07 05:06:58.195+00"),
    updatedAt: new Date("2026-01-19 14:36:59.285199+00"),
  },
];
