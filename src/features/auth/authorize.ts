import { Action, Resource } from "@/auth/permissions";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

export class UnauthorizedError extends Error {}
export class ForbiddenError extends Error {}

type PermissionQuery = {
  [R in Resource]?: Action<R>[];
};

export const requireSession = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    throw new UnauthorizedError("Unauthorized");
  }

  return session;
};

export const requirePermission = async (permissions: PermissionQuery) => {
  const session = await requireSession();

  const check = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions,
    },
  });

  if (!check.success) {
    throw new ForbiddenError("Forbidden");
  }
  return session;
};
