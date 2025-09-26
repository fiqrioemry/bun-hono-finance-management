import { Hono } from "hono";
import { protect } from "@/middlewares/auth";
import { validation } from "@/middlewares/validation";
import { AccountsController as ctrl } from "./accounts.controllers";
import {
  createAccountSchema,
  summaryParamsSchema,
  updateAccountSchema,
} from "./accounts.models";

const accounts = new Hono();

accounts.use(protect);

accounts.get("", ctrl.getAccounts);
accounts.post("", validation(createAccountSchema), ctrl.createAccount);
accounts.get("/summary", validation(summaryParamsSchema), ctrl.getSummary);
accounts.put("/:id", validation(updateAccountSchema), ctrl.updateAccount);

export default accounts;
