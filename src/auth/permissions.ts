import { createAccessControl } from "better-auth/plugins";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statements = {
  ...defaultStatements,
  post: ["create", "update:any", "update:own", "delete", "publish", "archive"],
  category: ["create", "delete", "update"],
  user: ["create", "update:any", "update:own", "delete", "ban", "impersonate"],
  session: ["list", "revoke", "delete"],
} as const;

export type Resource = keyof typeof statements;
export type Action<R extends Resource> = (typeof statements)[R][number];

export const fullAc = createAccessControl(statements);

export const adminRole = fullAc.newRole({
  ...adminAc,
  post: ["create", "archive", "update:any", "publish", "delete"],
  category: ["create", "delete", "update"],
  user: ["create", "update:any", "ban", "delete", "impersonate"],
  session: ["delete", "list", "revoke"],
});

export const editorRole = fullAc.newRole({
  post: ["create", "update:any", "archive", "publish", "delete"],
  user: ["update:own"],
});

export const userRole = fullAc.newRole({
  post: ["create", "update:own"],
  user: ["update:own"],
});
