import { z } from "zod";
import {
  categorySchema,
  categoryResponse,
  updateCategoryRequest,
} from "./categories.validation";
import prisma from "@/config/database";
import { HTTPException } from "hono/http-exception";

// ? if logic goes more complex, consider to use clean architecture or DDD
// ? for this project, keep this simple or you can separate the prisma function to repositories

export class CategoriesServices {
  // 1. Get All
  static async getAll(userId: string): Promise<categoryResponse[]> {
    //  get all categories include default system
    const categories = await prisma.category.findMany({
      where: {
        OR: [{ userId: userId }, { userId: null }],
      },
      orderBy: { name: "asc" },
    });

    return z.array(categorySchema).parse(categories);
  }

  // 2. Create
  static async create(
    userId: string,
    request: z.infer<typeof categorySchema>
  ): Promise<categoryResponse> {
    const newCategory = await prisma.category.create({
      data: { ...request, userId },
    });

    return categorySchema.parse(newCategory);
  }

  //  3. Update
  static async update(
    id: string,
    userId: string,
    request: updateCategoryRequest
  ): Promise<categoryResponse> {
    // check if category exist
    const category = await prisma.category.findFirst({
      where: {
        id,
        userId: userId,
      },
    });

    // if not found, throw error
    if (!category)
      throw new HTTPException(404, { message: "Category not found" });

    // update category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { ...request, userId },
    });

    // return updated category
    return categorySchema.parse(updatedCategory);
  }

  // 4. Delete
  static async delete(id: string, userId: string): Promise<string> {
    // check category with transactions
    const category = await prisma.category.findFirst({
      where: {
        id,
        userId: userId,
      },
      include: {
        transactions: {
          select: { id: true },
        },
      },
    });

    // throw error if not found
    if (!category) {
      throw new HTTPException(404, { message: "Category not found" });
    }

    // disabled if category has transactions
    if (category.transactions.length > 0) {
      throw new HTTPException(400, {
        message: "Category has transactions and cannot be deleted",
      });
    }

    // delete category
    await prisma.category.delete({
      where: { id },
    });

    return "category deleted successfully";
  }
}
