import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema.ts";

const connection =
  "postgresql://neondb_owner:xTbekB2EDf6M@ep-young-hat-a5d5jdn0.us-east-2.aws.neon.tech/neondb";

export const connectionString = Deno.env.get("DATABASE_URL") || "";
export const client = neon(connectionString);
export const db = drizzle(client, { schema });
