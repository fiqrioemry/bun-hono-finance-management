import { errorResponse } from "@/utils/http-response";
import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

type FileType = "mixed" | "image" | "video" | "docs";

const allowedExtensions: Record<FileType, RegExp> = {
  mixed: /jpeg|jpg|png|webp|mp4|mkv|avi|mov|pdf|doc|docx/,
  image: /jpeg|jpg|png|webp/,
  video: /mp4|mkv|avi|mov/,
  docs: /pdf|doc|docx/,
};

export const uploader =
  (
    fieldName = "files",
    type: FileType = "mixed",
    maxSize = 5 * 1024 * 1024,
    maxCount = 5
  ) =>
  async (c: Context, next: Next) => {
    const form = await c.req.formData();
    const files = (form.getAll(fieldName) as File[]) || File;

    if (files.length > maxCount) {
      throw new HTTPException(400, {
        message: `Max ${maxCount} files allowed`,
      });
    }

    for (const file of files) {
      if (file.size > maxSize) {
        throw new HTTPException(400, {
          message: `File ${file.name} too large (max ${
            maxSize / 1024 / 1024
          }MB)`,
        });
      }

      const extRegex = allowedExtensions[type];
      const fileName = file.name.toLowerCase();
      const mimeType = file.type.toLowerCase();

      if (!extRegex.test(fileName) || !extRegex.test(mimeType)) {
        throw new HTTPException(400, {
          message: `File ${file.name} is not a valid ${type} file`,
        });
      }
    }

    await next();
  };
