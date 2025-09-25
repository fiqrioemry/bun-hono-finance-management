import { Context, Next } from "hono";
import { logger } from "@/config/logger";

export const logging = async (c: Context, next: Next) => {
  const start = Date.now();
  try {
    await next();
    const ms = Date.now() - start;
    logger.info(
      {
        method: c.req.method,
        path: c.req.path,
        status: c.res.status,
        duration: `${ms}ms`,
      },
      "HTTP Request"
    );
  } catch (err: any) {
    const ms = Date.now() - start;
    logger.error(
      {
        method: c.req.method,
        path: c.req.path,
        status: 500,
        duration: `${ms}ms`,
        error: err.message,
        stack: err.stack,
      },
      "HTTP Error"
    );
    throw err;
  }
};
