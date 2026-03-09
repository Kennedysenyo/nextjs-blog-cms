import { InferInsertModel } from "drizzle-orm";
import { accountTable } from "../schema";

type AccountType = InferInsertModel<typeof accountTable>;

export const account: AccountType[] = [
  {
    id: "z2276Xi1JsfZgdAb1o573ReE5UHGYu2n",
    accountId: "W8rqu1pphWDsetczc2A5VIxN4m65yDFk",
    providerId: "credential",
    userId: "W8rqu1pphWDsetczc2A5VIxN4m65yDFk",
    accessToken: null,
    refreshToken: null,
    idToken: null,
    accessTokenExpiresAt: null,
    refreshTokenExpiresAt: null,
    scope: null,
    password:
      "41dfdf6d19921e8636b214b417121882:be0ea897aab913132160047d89cf1dfc9ece30ce48f66828b2aa6fe0028ea3c61ffa88cb991e13dd560d19fa1008d568ac49bc3f75e756c0fc3f19e63300b39d",
    createdAt: new Date("2026-01-07 05:06:58.422+00"),
    updatedAt: new Date("2026-01-07 05:06:58.422+00"),
  },
];
