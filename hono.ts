import { Hono, type Context } from "@hono/hono";

const app = new Hono();

app.get("/", (c: Context) => c.text("Hello Deno!"));

//Deno.serve(app.fetch);

Deno.serve({ port: +(Deno.env.get("PORT") || "3000") }, app.fetch);
