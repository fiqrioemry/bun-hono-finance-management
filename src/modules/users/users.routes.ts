import { Hono } from "hono";
import { protect } from "@/middlewares/auth";
import { uploader } from "@/middlewares/uploader";
import { updateProfileSchema } from "./users.models";
import { validation } from "@/middlewares/validation";
import { UsersControllers as ctrl } from "./users.controllers";

const users = new Hono();

users.use(protect);

users.get("/profile", ctrl.getProfile);

users.put(
  "/profile",
  validation(updateProfileSchema),
  uploader("file", "image", 1 * 1024 * 1024, 1),
  ctrl.updateProfile
);

export default users;
