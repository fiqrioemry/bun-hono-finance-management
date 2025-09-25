import { Context } from "hono";
import { UsersServices } from "./users.services";
import { successResponse } from "@/utils/http-response";
import { UpdateProfileRequest } from "./users.models";

export class UsersControllers {
  // 1. get profile

  static async getProfile(c: Context) {
    const user = c.get("user");

    const response = await UsersServices.getProfile(user.userId);

    return successResponse(c, "Get profile successfully", response);
  }

  static async updateProfile(c: Context) {
    const user = c.get("user");
    const request = c.get("validatedData");

    const response = await UsersServices.updateProfile(user.userId, request);

    return successResponse(c, "Update profile successfully", response);
  }
}
