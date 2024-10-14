import { Hono } from "@hono/hono";
import { addUser, checkUser } from "../lib/users-repo.ts";
import { getCookie, setCookie } from "@hono/hono/cookie";
import { sign, verify } from "@hono/hono/jwt";

export const authRoutes = new Hono()
  .post("/sign-up", async (c) => {
    const body = await c.req.json();
    try {
      const res = await addUser(body.email, body.password);
      const { id, email, role } = res?.[0];
      return c.json({ ok: "true", data: { id, email, role } }, 200);
    } catch (e) {
      return c.json({ ok: "false", error: e }, 403);
    }
  })
  .post("/sign-in", async (c) => {
    const body = await c.req.json();

    if (!body.email || !body.password) {
      return c.json({ ok: "false", error: "bad request" }, 404);
    }

    //check if user exists
    const isValid = await checkUser(body.email, body.password);

    if (isValid) {
      const expiresAt = Math.floor(Date.now() / 1000) + 15 * 60; //15 minute

      const payload = {
        sub: body.email,
        exp: expiresAt,
      };

      const token = await sign(payload, Deno.env.get("JWT_SECRET") as string);

      const expires = new Date(expiresAt * 1000);

      setCookie(c, "__Session", token, {
        path: "/",
        secure: Deno.env.get("NODE_ENV") === "production",
        httpOnly: true,
        expires,
        sameSite: "None",
      });

      return c.json({ ok: "true", token }, 200);
    } else {
      return c.json(
        { ok: "false", error: "invalid username or password" },
        403
      );
    }
  })
  .get("/profile", async (c) => {
    const token = getCookie(c, "__Session");

    if (token) {
      try {
        const payload = await verify(
          token,
          Deno.env.get("JWT_SECRET") as string
        );
        return c.json(payload);
      } catch (e: any) {
        console.log(e?.name);
        return c.json({ ok: "false", message: "unauthorized" }, 401);
      }
    } else {
      console.log("here");
      return c.json({ ok: "false", message: "unauthorized" }, 401);
    }
  });
