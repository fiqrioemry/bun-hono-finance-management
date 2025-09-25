import { Context } from "hono";
import { verify } from "hono/jwt";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";

export async function protect(c: Context, next: () => Promise<void>) {
  const accessToken = getCookie(c, "accessToken");
  if (!accessToken) {
    throw new HTTPException(401, { message: "Unauthorized : token required" });
  }

  const decode = await verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);

  if (!decode) {
    throw new HTTPException(401, { message: "Unauthorized : Invalid token" });
  }

  c.set("user", decode);

  await next();
}
