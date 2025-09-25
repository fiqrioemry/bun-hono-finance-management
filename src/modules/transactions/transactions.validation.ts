import { z } from "zod";
import { categorySchema } from "../categories/categories.validation";

export const accountSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["BANK", "CASH", "E-WALLET", "INVESTMENT", "OTHER"]),
});

export const transactionParamsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
  accountId: z.string().uuid().optional(),
  limit: z.string().optional(),
  page: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
});

export const transactionSchema = z.object({
  id: z.string().uuid(),
  amount: z.number(),
  accountId: z.string().uuid(),
  categoryId: z.string().uuid(),
  type: z.enum(["INCOME", "EXPENSE"]),
  transactionTime: z.string(),
  description: z.string(),
  merchantName: z.string().nullable(),
  merchantLocation: z.string().nullable(),
  initialBalance: z.number(),
  finalBalance: z.number(),
  category: categorySchema,
  account: accountSchema,
  userId: z.string().uuid(),
  transactionDate: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export const createTransactionSchema = z.object({
  amount: z.number().min(0, "Amount must be greater than or equal to 0"),
  accountId: z.string().uuid(),
  categoryId: z.string().uuid(),
  type: z.enum(["INCOME", "EXPENSE"]),
  transactionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  transactionTime: z
    .string()
    .regex(
      /^([0-1]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/,
      "Invalid time format (HH:mm[:ss])"
    )
    .optional(),
  description: z.string().trim().max(500).optional(),
  merchantName: z.string().optional(),
  merchantLocation: z.string().optional(),
});

export type accountResponse = z.infer<typeof accountSchema>;
export type transactionParams = z.infer<typeof transactionParamsSchema>;
export type createAccountRequest = z.infer<typeof accountSchema>;
export type transactionResponse = z.infer<typeof transactionSchema>;
export type createTransactionRequest = z.infer<typeof createTransactionSchema>;
