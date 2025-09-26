import { Context } from "hono";
import { summaryParams } from "./accounts.models";
import { AccountsServices } from "./accounts.services";
import { successResponse } from "@/utils/http-response";

export class AccountsController {
  static async getAccounts(c: Context) {
    const user = c.get("user");

    // continue to service to handle business logic
    const response = await AccountsServices.getAll(user.userId);

    return successResponse(c, "Get accounts success", response);
  }

  static async createAccount(c: Context) {
    const user = c.get("user");
    const request = await c.req.json();

    // continue to service to handle business logic
    const response = await AccountsServices.create(user.userId, request);

    return successResponse(c, "Account created successfully", response);
  }

  static async updateAccount(c: Context) {
    const accountId = c.req.param("id");
    const user = c.get("user");
    const request = await c.req.json();

    // continue to service to handle business logic
    const response = await AccountsServices.update(
      user.userId,
      accountId,
      request
    );

    return successResponse(c, "Account updated successfully", response);
  }

  static async getSummary(c: Context) {
    const user = c.get("user");
    const { startDate, endDate } = c.get("validatedData") as summaryParams;

    // continue to service to handle business logic
    const response = await AccountsServices.getSummary(
      user.userId,
      startDate,
      endDate
    );

    return successResponse(c, "Get account summary success", response);
  }
}
