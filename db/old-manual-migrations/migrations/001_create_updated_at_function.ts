import { sql } from "../db";

export const up = async () => {
  await sql`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW."updatedAt" = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `;
};
