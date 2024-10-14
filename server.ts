import { Hono } from "hono";
import { Pool } from "@neondatabase/serverless";

const app = new Hono();

const pool = new Pool({ connectionString: Deno.env.get("DATABASE_URL") || "" });

app.get("/", (c) => c.text("Hello Deno!"));

app.get("/db", async (c) => {
  const client = await pool.connect();
  const res = await client.query("SELECT * FROM users");

  const rows = res.rows;

  //return rows;
  return c.json({ ok: "true", data: rows });
});

Deno.serve({ port: +(Deno.env.get("PORT") || "3000") }, app.fetch);
