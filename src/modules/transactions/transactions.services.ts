import {
  transactionSchema,
  transactionResponse,
  transactionParams,
  createTransactionRequest,
} from "./transactions.models";
import { z } from "zod";
import prisma from "@/config/database";
import { HTTPException } from "hono/http-exception";

// ? if logic goes more complex, consider to use clean architecture or DDD
// ? for this project, keep this simple or you can separate the prisma function to repositories

export class TransactionsServices {
  static async getAll(
    userId: string,
    params: transactionParams
  ): Promise<transactionResponse[]> {
    const {
      startDate,
      endDate,
      search,
      accountId,
      categoryId,
      limit,
      type,
      page,
    } = params;

    let where: any = {};

    if (startDate) {
      where.transactionDate = {
        ...where.transactionDate,
        gte: new Date(startDate),
      };
    }
    if (endDate) {
      where.transactionDate = {
        ...where.transactionDate,
        lte: new Date(endDate),
      };
    }

    if (search) {
      where.OR = [
        { description: { contains: search, mode: "insensitive" } },
        { merchantName: { contains: search, mode: "insensitive" } },
        { merchantLocation: { contains: search, mode: "insensitive" } },
      ];
    }

    if (accountId) {
      where.accountId = accountId;
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (type) {
      where.type = type;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true,
        account: true,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { transactionDate: "desc" },
    });

    return z.array(transactionSchema).parse(transactions);
  }

  static async create(
    userId: string,
    request: createTransactionRequest
  ): Promise<transactionResponse> {
    // check account belong to user
    const account = await prisma.account.findFirst({
      where: { userId, id: request.accountId },
    });

    if (!account) {
      throw new HTTPException(404, { message: "Account not found " });
    }

    // check valid category
    const category = await prisma.category.findUnique({
      where: { id: request.categoryId },
    });

    if (!category) {
      throw new HTTPException(404, { message: "Category not found" });
    }

    // accumulate final balance based on account
    const finalBalance =
      request.type === "INCOME"
        ? account.balance + request.amount
        : account.balance - request.amount;

    const defaultTime = new Date().toTimeString().split(" ")[0];

    // start transaction to handle rollback if failed
    const [newTransaction, updateAccount] = await prisma.$transaction([
      // create new transaction record
      prisma.transaction.create({
        data: {
          ...request,
          transactionTime: request.transactionTime || defaultTime,
          transactionDate: new Date(request.transactionDate),
          initialBalance: account.balance,
          finalBalance,
        },
      }),
      //   update account balance
      prisma.account.update({
        where: { id: account.id },
        data: { balance: finalBalance },
      }),
    ]);

    return transactionSchema.parse(newTransaction);
  }
}
