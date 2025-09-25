import { Context } from "hono";
import { successResponse } from "@/utils/http-response";
import { CategoriesServices } from "./transactions.services";

export class CategoriesController {
  // 1. get all categories
  static async getCategories(c: Context) {
    const user = c.get("user");

    // continue to service to handle business logic
    const response = await CategoriesServices.getAll(user.id);

    return successResponse(c, "Get categories success", response);
  }

  static async createCategory(c: Context) {
    const user = c.get("user");
    const request = await c.req.json();

    // continue to service to handle business logic
    const response = await CategoriesServices.create(user.id, request);

    return successResponse(c, "Create category success", response);
  }
  //2. update category
  static async updateCategory(c: Context) {
    const user = c.get("user");
    const id = c.req.param("id");
    const request = await c.req.json();

    // continue to service to handle business logic
    const response = await CategoriesServices.update(id, user.id, request);

    return successResponse(c, "Update category success", response);
  }

  //3. delete category
  static async deleteCategory(c: Context) {
    const user = c.get("user");
    const id = c.req.param("id");

    // continue to service to handle business logic
    const message = await CategoriesServices.delete(id, user.id);

    return successResponse(c, message);
  }
}
