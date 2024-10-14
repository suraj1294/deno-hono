import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema.ts";

export const connectionString = Deno.env.get("DATABASE_URL") || "";
export const client = neon(connectionString);
export const db = drizzle(client, { schema });
