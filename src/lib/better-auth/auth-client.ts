import {
  adminRole,
  editorRole,
  fullAc,
  userRole,
} from "@/features/auth/permissions";
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const { signIn, signUp, signOut, useSession } = createAuthClient({
  plugins: [
    adminClient({
      ac: fullAc,
      roles: {
        admin: adminRole,
        editor: editorRole,
        user: userRole,
      },
    }),
  ],
});
