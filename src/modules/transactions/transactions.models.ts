import { z } from "zod";
import { categorySchema } from "../categories/categories.models";
import { accountsSchema } from "../accounts/accounts.models";

export const transactionParamsSchema = z.object({
  startDate: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : undefined),
    z.date().optional()
  ),
  endDate: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : undefined),
    z.date().optional()
  ),
  search: z.string().optional(),
  accountId: z.uuid().optional(),
  categoryId: z.uuid().optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  limit: z.preprocess(
    (val) => (val ? parseInt(val as string, 10) : 10),
    z.number()
  ),
  page: z.preprocess(
    (val) => (val ? parseInt(val as string, 10) : 1),
    z.number()
  ),
});

export const transactionSchema = z.object({
  id: z.uuid(),
  amount: z.number(),
  accountId: z.uuid(),
  categoryId: z.uuid(),
  type: z.enum(["INCOME", "EXPENSE"]),
  transactionTime: z.string(),
  description: z.string().nullable().optional(),
  merchantName: z.string().optional().nullable(),
  merchantLocation: z.string().optional().nullable(),
  initialBalance: z.number(),
  finalBalance: z.number(),
  category: categorySchema.optional(),
  account: accountsSchema.optional(),
  transactionDate: z.date(),
  createdAt: z.date(),
});

export const createTransactionSchema = z.object({
  amount: z.number().min(0, "Amount must be greater than or equal to 0"),
  accountId: z.uuid(),
  categoryId: z.uuid(),
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

export type transactionParams = z.infer<typeof transactionParamsSchema>;
export type transactionResponse = z.infer<typeof transactionSchema>;
export type createTransactionRequest = z.infer<typeof createTransactionSchema>;
