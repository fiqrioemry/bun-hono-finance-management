import { Context } from "hono";
import { ZodError } from "zod";
import { HTTPException } from "hono/http-exception";
import { errorResponse } from "@/utils/http-response";

export const errorHandler = (err: Error, c: Context) => {
  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        message: err.message,
        errors: [],
        code: "HTTP_EXCEPTION",
      },
      err.status
    );
  }

  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => ({
      field: issue.path.length > 0 ? `body.${issue.path.join(".")}` : "body",
      message: issue.message,
    }));

    return c.json(
      {
        success: false,
        message: "Validation error",
        errors,
        code: "VALIDATION_ERROR",
      },
      400
    );
  }

  return c.json(
    {
      success: false,
      message: "Internal Server Error",
      errors: [],
      code: "INTERNAL_SERVER_ERROR",
    },
    500
  );
};

export const notFoundHandler = (c: Context) => {
  return errorResponse(
    c,
    `Requested resource not found - [${c.req.method}] ${c.req.url}`,
    404,
    "NOT_FOUND"
  );
};
