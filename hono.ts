import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.text("Hello Deno!"));

//Deno.serve(app.fetch);

Deno.serve({ port: +(Deno.env.get("PORT") || "3000") }, app.fetch);
