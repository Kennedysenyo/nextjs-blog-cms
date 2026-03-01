import { InferInsertModel } from "drizzle-orm";
import { userSessionTable } from "../schema";

type SessionType = InferInsertModel<typeof userSessionTable>;

export const session: SessionType[] = [
  {
    id: "YrZXGcYwWTwjz4U3t0U3Sx56fggXoZeF",
    expiresAt: new Date("2026-02-01 01:37:03.977+00"),
    token: "ACF3J6Zyqaqew9wQTpUx1tWCJFFfUuVe",
    createdAt: new Date("2026-01-17 08:35:51.137+00"),
    updatedAt: new Date("2026-01-25 01:37:04.018259+00"),
    ipAddress: "154.161.160.221",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
    userId: "W8rqu1pphWDsetczc2A5VIxN4m65yDFk",
  },
  {
    id: "bysWnPELBgrV56jGLB8T6K4FgSWMwT4D",
    expiresAt: new Date("2026-01-17 08:05:52.922+00"),
    token: "zraVZBhRa76437JmndIoGnIF3kjEcqu7",
    createdAt: new Date("2026-01-10 08:05:52.923+00"),
    updatedAt: new Date("2026-01-10 08:05:52.923+00"),
    ipAddress: "154.161.136.26",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
    userId: "W8rqu1pphWDsetczc2A5VIxN4m65yDFk",
  },
  {
    id: "gMrGOY77GkHTE05qCI8n7XKlmKEbIjSv",
    expiresAt: new Date("2026-02-11 14:14:48.796+00"),
    token: "fZvgTNnxkKCAOHdCLw9Vr9TkEFsLsyIn",
    createdAt: new Date("2026-02-02 23:13:30.455+00"),
    updatedAt: new Date("2026-02-04 14:14:48.934414+00"),
    ipAddress: "::ffff:127.0.0.1",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0",
    userId: "W8rqu1pphWDsetczc2A5VIxN4m65yDFk",
  },
  {
    id: "ivcUoHBgM2w9PloqpmcBYN6ZI4KyrptZ",
    expiresAt: new Date("2026-02-11 09:43:36.463+00"),
    token: "rJaFW9LiGUgCo0OXTWLpX7izk2ksEv3P",
    createdAt: new Date("2026-02-02 23:18:22.749+00"),
    updatedAt: new Date("2026-02-04 09:43:36.507574+00"),
    ipAddress: "154.161.143.236",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
    userId: "W8rqu1pphWDsetczc2A5VIxN4m65yDFk",
  },
  {
    id: "jhCRHXE0RGWK3bGKWEpMEeGvaIoDyowv",
    expiresAt: new Date("2026-03-08 06:44:42.825+00"),
    token: "XaZRKSl3296R7jR1e2zbCm9j9FzlqqOi",
    createdAt: new Date("2026-03-01 06:44:42.826+00"),
    updatedAt: new Date("2026-03-01 06:44:42.826+00"),
    ipAddress: "::ffff:127.0.0.1",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0",
    userId: "W8rqu1pphWDsetczc2A5VIxN4m65yDFk",
  },
  {
    id: "njWGa5Qo3BXgSM6ItQYR8X4hD0TbwnLM",
    expiresAt: new Date("2026-01-31 21:05:22.558+00"),
    token: "3ZxqEDBlvLV5deFUAN9jtMDTDGM9Ifwn",
    createdAt: new Date("2026-01-17 08:10:26.727+00"),
    updatedAt: new Date("2026-01-24 21:05:24.058749+00"),
    ipAddress: "::ffff:127.0.0.1",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0",
    userId: "W8rqu1pphWDsetczc2A5VIxN4m65yDFk",
  },
  {
    id: "zqe8PkpXgs2n4DDkYpYQN8waqH4EvXPG",
    expiresAt: new Date("2026-01-14 05:17:47.389+00"),
    token: "F8Ek0lJNhqRNljcgmIzbqmq34ZMhahqB",
    createdAt: new Date("2026-01-07 05:17:47.39+00"),
    updatedAt: new Date("2026-01-07 05:17:47.39+00"),
    ipAddress: "::ffff:127.0.0.1",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0",
    userId: "W8rqu1pphWDsetczc2A5VIxN4m65yDFk",
  },
];
