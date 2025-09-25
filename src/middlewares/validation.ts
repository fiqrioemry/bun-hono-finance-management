import { ZodSchema } from "zod";
import type { Context, Next } from "hono";

export const validation = (schema: ZodSchema) => {
  return async (c: Context, next: Next) => {
    const method = c.req.method;
    const contentType = c.req.header("content-type") || "";

    let dataToValidate: any;

    if (method === "GET" || method === "DELETE") {
      dataToValidate = c.req.query();
    } else if (contentType.includes("application/json")) {
      dataToValidate = await c.req.json();
    } else if (contentType.includes("multipart/form-data")) {
      const form = await c.req.formData();
      const obj: Record<string, any> = Object.fromEntries(form.entries());

      // handle file upload
      const file = form.get("file");
      if (file instanceof File) {
        obj.file = file;
      }

      dataToValidate = obj;
    } else {
      dataToValidate = {};
    }

    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      throw result.error;
    }

    c.set("validatedData", result.data);
    await next();
  };
};
