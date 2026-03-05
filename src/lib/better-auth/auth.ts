import { sendEmail } from "@/actions/emails/email-verification";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { admin } from "better-auth/plugins";
import { adminRole, editorRole, fullAc, userRole } from "@/auth/permissions";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: url,
      });
    },
    autoSignInAfterVerification: true,
  },
  emailAndPassword: {
    enabled: true,
    sendOnSignUp: true,
    requireEmailVerification: true,
  },
  plugins: [
    nextCookies(),
    admin({
      ac: fullAc,
      roles: {
        admin: adminRole,
        editor: editorRole,
        user: userRole,
      },
      adminRoles: ["admin"],
      adminUserIds: ["W8rqu1pphWDsetczc2A5VIxN4m65yDFk"],
    }),
  ],
});
