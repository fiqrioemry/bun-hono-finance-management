import { Context } from "hono";
import { successResponse } from "@/utils/http-response";
import { transactionParams } from "./transactions.validation";
import { TransactionsServices } from "./transactions.services";

export class TrasnsactionsController {
  // 1. get all transactions
  static async getTransactions(c: Context) {
    const user = c.get("user");
    const params = c.req.query() as transactionParams;

    // continue to service to handle business logic
    const response = await TransactionsServices.getAll(user.id, params);

    return successResponse(c, "Get transactions success", response);
  }
  // 2. create transaction
  static async createTransaction(c: Context) {
    const user = c.get("user");
    const request = await c.req.json();

    // continue to service to handle business logic
    const response = await TransactionsServices.create(user.id, request);

    return successResponse(c, "Create transaction success", response);
  }
}
