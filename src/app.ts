import { Hono } from "hono";
import routes from "./routes";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { logging } from "./middlewares/logging";
import { rateLimit } from "./middlewares/limitter";
import { successResponse } from "./utils/http-response";
import { errorHandler, notFoundHandler } from "./middlewares/errors";

const app = new Hono();

// apply logging middleware
app.use("*", prettyJSON());
app.use(logging);

// setup cors configuration
app.use(
  "*",
  cors({
    origin: process.env.CLIENT_URL || "localhost",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "x-api-key"],
    credentials: true,
    maxAge: 86400,
  })
);

// apply rate limit globally
// ?? can be override in each route for extra protection with customization
app.use(rateLimit(120, 60));

// init route config
app.route("/api/v1", routes);

// assign some route for quick checking
app.get("/", (c) => {
  const timestamp = new Date().toISOString();
  return successResponse(c, "Welcome to Finance Management API", { timestamp });
});

app.get("/health", (c) => {
  const timestamp = new Date().toISOString();
  return successResponse(c, "Health check OK", { timestamp });
});

// add middleware for handling error and not found
app.onError(errorHandler);
app.notFound(notFoundHandler);

export default app;
