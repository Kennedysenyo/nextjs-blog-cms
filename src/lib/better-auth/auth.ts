import { sendEmail } from "@/actions/emails/email-verification";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
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
  plugins: [nextCookies()],
});
