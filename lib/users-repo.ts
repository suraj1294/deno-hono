import { db } from "../drizzle/db.ts";
import { users } from "../drizzle/schema.ts";
import { eq } from "drizzle-orm";
import { hash, verify } from "@stdext/crypto/hash";
export const addUser = async (email: string, password: string) => {
  const hashed = await hash("argon2", password);

  const res = await db
    .insert(users)
    .values({
      fullName: email,
      email: email,
      role: "user",
      password: hashed,
    })
    .returning();
  return res;
};

export const checkUser = async (email: string, password: string) => {
  const res = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .execute();

  if (res.length > 0) {
    const user = res[0];
    const hash = user.password;
    const isValid = await verify("argon2", password, hash);
    return isValid;
  }

  return false;
};
