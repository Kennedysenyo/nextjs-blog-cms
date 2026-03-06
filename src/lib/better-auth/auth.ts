import { sendEmail } from "@/actions/emails/email-verification";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

import { admin } from "better-auth/plugins";
import { adminRole, editorRole, fullAc, userRole } from "@/auth/permissions";
import { Pool } from "pg";

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error(
    "DATABASE_URL environment variable is required for better auth configurateion!",
  );
}

export const auth = betterAuth({
  database: new Pool({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false,
    },
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
