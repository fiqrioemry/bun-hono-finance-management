import redis from "@/config/redis";
import { getCookie } from "hono/cookie";
import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

export const rateLimit = (limit = 100, windowSec = 60) => {
  return async (c: Context, next: Next) => {
    const user = c.get("user");

    // set identifier with unique guest id if user not logged in
    let identifier = user?.id;
    identifier = getCookie(c, "guest_id");

    if (!identifier) {
      identifier = crypto.randomUUID();
      c.header("Set-Cookie", `guest_id=${identifier}; Path=/; HttpOnly`);
    }

    // set default limit for global route
    // ? each route can have its own limit by setting it in the route middleware
    const key = `ratelimit:${identifier}:${c.req.path}`;
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, windowSec);
    }

    if (current > limit) {
      throw new HTTPException(429, { message: "Too many requests" });
    }

    await next();
  };
};
