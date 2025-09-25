import { Hono } from "hono";
import { validation } from "@/middlewares/validation";
import { createCategorySchema } from "./categories.validation";
import { CategoriesController as ctrl } from "./categories.controllers";

const categories = new Hono();

categories.get("", ctrl.getCategories);
categories.post("", validation(createCategorySchema), ctrl.createCategory);
categories.put("/:id", validation(createCategorySchema), ctrl.updateCategory);
categories.delete("/:id", ctrl.deleteCategory);

export default categories;
