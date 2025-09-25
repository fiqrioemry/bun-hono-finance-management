export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["INCOME", "EXPENSE"]),
  userId: z.string().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["INCOME", "EXPENSE"]),
  userId: z.string().min(1, "userId is required"),
});

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: z.enum(["INCOME", "EXPENSE"]),
  userId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type updateCategoryRequest = z.infer<typeof updateCategorySchema>;
export type createCategoryRequest = z.infer<typeof createCategorySchema>;
export type categoryResponse = z.infer<typeof categorySchema>;

import { z } from "zod";
