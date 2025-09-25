import { Hono } from "hono";
import { protect } from "@/middlewares/auth";
import { validation } from "@/middlewares/validation";
import { AuthControllers as ctrl } from "@/modules/auth/auth.controllers";
import { loginSchema, registerSchema, verifyOtpSchema } from "./auth.models";

const auth = new Hono();

auth.post("/logout", ctrl.logout);
auth.post("/login", validation(loginSchema), ctrl.login);
auth.post("/register", validation(registerSchema), ctrl.register);
auth.post("/verify-otp", validation(verifyOtpSchema), ctrl.verifyToken);
auth.post("/refresh-token", ctrl.refreshSession);
auth.get("/get-session", protect, ctrl.getSession);
auth.post("/forgot-password", ctrl.forgotPassword);
auth.post("/reset-password", ctrl.resetPassword);

export default auth;
