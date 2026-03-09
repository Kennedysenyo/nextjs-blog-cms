import { Action, Resource } from "@/features/auth/permissions";
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

export const requireSelfOrPermission = async <
  R extends Resource,
  OwnA extends Action<R>,
  AnyA extends Action<R>,
>(
  targetedId: string,
  options: {
    resource: R;
    own: OwnA;
    any: AnyA;
  },
) => {
  const session = await requireSession();

  const checkPermissionAny = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permission: {
        [options.resource]: [options.any],
      } as PermissionQuery,
    },
  });

  if (checkPermissionAny.success) {
    return session;
  }

  const checkPermissionOwn = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permission: {
        [options.resource]: [options.own],
      } as PermissionQuery,
    },
  });

  if (!checkPermissionOwn.success || session.user.id !== targetedId) {
    throw new ForbiddenError("Forbidden");
  }

  return session;
};
