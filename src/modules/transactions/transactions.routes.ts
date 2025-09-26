import { Hono } from "hono";
import {
  createTransactionSchema,
  transactionParamsSchema,
} from "./transactions.models";
import { protect } from "@/middlewares/auth";
import { validation } from "@/middlewares/validation";
import { TransactionsController as ctrl } from "./transactions.controllers";

const transactions = new Hono();

transactions.use(protect);

transactions.get("", validation(transactionParamsSchema), ctrl.getTransactions);
transactions.post(
  "",
  validation(createTransactionSchema),
  ctrl.createTransaction
);

export default transactions;
