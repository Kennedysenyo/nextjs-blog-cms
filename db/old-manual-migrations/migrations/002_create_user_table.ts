import { sql } from "../db";

export const up = async () => {
  // User table
  await sql`
    CREATE TABLE IF NOT EXISTS "user" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
     "email" TEXT NOT NULL UNIQUE,
      "emailVerified" BOOLEAN NOT NULL DEFAULT false,
      "image" TEXT,
      "role" TEXT NOT NULL DEFAULT 'admin'
        CHECK ("role" IN ('super_admin', 'admin')),
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "createdBy" TEXT REFERENCES "user"(id),
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;

  // Session table
  await sql`
    CREATE TABLE IF NOT EXISTS "session" (
      "id" TEXT PRIMARY KEY,
      "expiresAt" TIMESTAMPTZ NOT NULL,
      "token" TEXT NOT NULL UNIQUE,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "ipAddress" TEXT,
      "userAgent" TEXT,
      "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
    );
  `;

  // Account table
  await sql`
    CREATE TABLE IF NOT EXISTS account (
      "id" TEXT PRIMARY KEY,
      "accountId" TEXT NOT NULL,
      "providerId" TEXT NOT NULL,
      "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      "accessToken" TEXT,
      "refreshToken" TEXT,
      "idToken" TEXT,
      "accessTokenExpiresAt" TIMESTAMPTZ,
      "refreshTokenExpiresAt" TIMESTAMPTZ,
      "scope" TEXT,
      "password" TEXT,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;

  // Verification table
  await sql`
    CREATE TABLE IF NOT EXISTS verification (
      "id" TEXT PRIMARY KEY,
      "identifier" TEXT NOT NULL,
      "value" TEXT NOT NULL,
      "expiresAt" TIMESTAMPTZ NOT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;

  // Indexes
  await sql`CREATE INDEX IF NOT EXISTS session_user_id_idx ON session("userId");`;
  await sql`CREATE INDEX IF NOT EXISTS account_user_id_idx ON account("userId");`;
  await sql`CREATE INDEX IF NOT EXISTS verification_identifier_idx ON verification("identifier");`;

  // Attach the trigger to auto-update `updated_at`

  await sql`
    DROP TRIGGER IF EXISTS user_updated_at ON "user";
  `;

  await sql`CREATE TRIGGER user_updated_at
    BEFORE UPDATE ON "user"
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();`;

  await sql`
    DROP TRIGGER IF EXISTS session_updated_at ON "session";
  `;
  await sql`CREATE TRIGGER session_updated_at
    BEFORE UPDATE ON session
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();`;

  await sql`
    DROP TRIGGER IF EXISTS account_updated_at ON "account";
  `;

  await sql`CREATE TRIGGER account_updated_at
    BEFORE UPDATE ON account
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();`;

  await sql`
    DROP TRIGGER IF EXISTS verification_updated_at ON "verification";
  `;

  await sql`CREATE TRIGGER verification_updated_at
    BEFORE UPDATE ON "verification"
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();`;
};
