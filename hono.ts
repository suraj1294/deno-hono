import { Hono } from "@hono/hono";
import { logger } from "@hono/hono/logger";
import { cors } from "@hono/hono/cors";
//import { serveStatic } from "@hono/hono/deno";
import { authRoutes } from "./routes/auth-routes.ts";
import "jsr:@std/dotenv/load";

console.log(Deno.env.get("DATABASE_URL"));

const app = new Hono();

app.use("*", logger());

app.use(
  "*",
  cors({
    origin: JSON.stringify(Deno.env.get("CORS_ORIGIN") ?? [""]),
    credentials: true,
  })
);

const apiRoutes = app
  .basePath("/api")
  .get("/", (c) => c.text("Up and running! ✨"))
  .route("/auth", authRoutes);

// app.get("*", serveStatic({ root: "./client/build/client" }));
// app.get("*", serveStatic({ path: "./client/build/client/index.html" }));

app.onError((err, c) => {
  console.log(err);
  return c.json("internal server error", 500);
});

export type ApiRoutes = typeof apiRoutes;

Deno.serve({ port: +(Deno.env.get("PORT") || "3000") }, app.fetch);
