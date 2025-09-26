import { z } from "zod";

export const accountsSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string(),
  type: z.enum(["CASH", "BANK", "E_WALLET", "INVESTMENT", "OTHER"]),
  balance: z.number(),
  totalTransactions: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createAccountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["CASH", "BANK", "E_WALLET", "INVESTMENT", "OTHER"]),
  balance: z.number().min(0, "Balance must be greater than or equal to 0"),
});

export const updateAccountSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  type: z.enum(["CASH", "BANK", "E_WALLET", "INVESTMENT", "OTHER"]).optional(),
  balance: z
    .number()
    .min(0, "Balance must be greater than or equal to 0")
    .optional(),
});

export const summaryParamsSchema = z.object({
  startDate: z.preprocess(
    (val) =>
      typeof val === "string" && val.length > 0 ? new Date(val) : undefined,
    z.date().optional()
  ),
  endDate: z.preprocess(
    (val) =>
      typeof val === "string" && val.length > 0 ? new Date(val) : undefined,
    z.date().optional()
  ),
});

export type summaryResponse = {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  byCategory: { category: string; total: number }[];
};

export type summaryParams = z.infer<typeof summaryParamsSchema>;
export type accountsResponse = z.infer<typeof accountsSchema>;
export type createAccountRequest = z.infer<typeof createAccountSchema>;
export type updateAccountRequest = z.infer<typeof updateAccountSchema>;
