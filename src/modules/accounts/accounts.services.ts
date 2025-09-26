import { z } from "zod";
import {
  accountsSchema,
  accountsResponse,
} from "@/modules/accounts/accounts.models";
import {
  summaryResponse,
  updateAccountRequest,
  createAccountRequest,
} from "./accounts.models";
import prisma from "@/config/database";
import { HTTPException } from "hono/http-exception";

export class AccountsServices {
  static async getAll(userId: string): Promise<accountsResponse[]> {
    // fetch accounts with total transactions count
    const results = await prisma.account.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // map accounts to include totalTransactions
    const accounts = results.map((account) => ({
      ...account,
      totalTransactions: account._count.transactions,
    }));

    return z.array(accountsSchema).parse(accounts);
  }

  static async create(
    userId: string,
    request: createAccountRequest
  ): Promise<accountsResponse> {
    const newAccount = await prisma.account.create({
      data: {
        userId,
        ...request,
      },
    });

    return accountsSchema.parse(newAccount);
  }

  static async update(
    userId: string,
    accountId: string,
    request: updateAccountRequest
  ): Promise<accountsResponse> {
    // check if belongs to user
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId,
      },
    });

    if (!account) {
      throw new HTTPException(404, { message: "Account not found" });
    }

    // update account
    const updatedAccount = await prisma.account.update({
      where: { id: accountId },
      data: { ...request },
    });

    return accountsSchema.parse(updatedAccount);
  }

  static async getSummary(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<summaryResponse> {
    const accounts = await this.getAll(userId);

    const totalBalance = await prisma.account.aggregate({
      where: { userId },
      _sum: { balance: true },
    });

    const totalIncome = await prisma.transaction.aggregate({
      where: {
        accountId: { in: accounts.map((acc) => acc.id) },
        type: "INCOME",
        ...(startDate &&
          endDate && { transactionDate: { gte: startDate, lte: endDate } }),
      },
      _sum: { amount: true },
    });

    const totalExpense = await prisma.transaction.aggregate({
      where: {
        accountId: { in: accounts.map((acc) => acc.id) },
        type: "EXPENSE",
        ...(startDate &&
          endDate && { transactionDate: { gte: startDate, lte: endDate } }),
      },
      _sum: { amount: true },
    });

    const stats = await prisma.transaction.groupBy({
      by: ["categoryId"],
      _sum: { amount: true },
      where: {
        account: { userId },
        ...(startDate &&
          endDate && { transactionDate: { gte: startDate, lte: endDate } }),
      },
    });

    const categoryIds = stats.map((s) => s.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    });
    const categoryMap = Object.fromEntries(
      categories.map((c) => [c.id, c.name])
    );

    const byCategory = stats.map((item) => ({
      category: categoryMap[item.categoryId] || "Uncategorized",
      total: item._sum.amount || 0,
    }));

    return {
      totalBalance: totalBalance._sum.balance || 0,
      totalIncome: totalIncome._sum.amount || 0,
      totalExpense: totalExpense._sum.amount || 0,
      byCategory,
    };
  }
}
