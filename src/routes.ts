import { Hono } from "hono";
import auth from "./modules/auth/auth.routes";
import users from "./modules/users/users.routes";
import categories from "./modules/categories/categories.routes";
import transactions from "./modules/transactions/transactions.routes";
const routes = new Hono();

routes.route("/auth", auth);
routes.route("/users", users);
routes.route("/categories", categories);
routes.route("/transactions", transactions);
export default routes;
