import { hash, verify } from "@stdext/crypto/hash";
import { client, connectionString, db } from "./drizzle/db.ts";
import { users } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";
import { Pool } from "@neondatabase/serverless";

const pool = new Pool({ connectionString });

const getUsers = async () => {
  const res = await db.query.users.findMany();
  return res;
};

const addUser = async (email: string, password: string) => {
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

const checkUser = async (email: string, password: string) => {
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

const DeleUser = async (email: string) => {
  const res = await db.delete(users).where(eq(users.email, email)).returning();
  return res;
};

const getUsersRaw = async () => {
  const client = await pool.connect();
  const res = await client.query("SELECT * FROM users");

  const rows = res.rows;

  return rows;
};

//console.log(await addUser("suraj@test.com", "suraj1294"));

//console.log(await checkUser("suraj@test.com", "suraj1294f"));

//console.log(await DeleUser("suraj@test.com"));

console.log(await getUsersRaw());
