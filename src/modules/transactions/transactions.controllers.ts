import { Context } from "hono";
import { successResponse } from "@/utils/http-response";
import {
  createTransactionRequest,
  transactionParams,
} from "./transactions.models";
import { TransactionsServices } from "./transactions.services";

export class TransactionsController {
  // 1. get all transactions
  static async getTransactions(c: Context) {
    const user = c.get("user");
    const params = c.get("validatedData") as transactionParams;

    // continue to service to handle business logic
    const response = await TransactionsServices.getAll(user.userId, params);

    return successResponse(c, "Get transactions success", response);
  }
  // 2. create transaction
  static async createTransaction(c: Context) {
    const user = c.get("user");
    const request = c.get("validatedData") as createTransactionRequest;

    // continue to service to handle business logic
    const response = await TransactionsServices.create(user.userId, request);

    return successResponse(c, "Create transaction success", response, 201);
  }
}
