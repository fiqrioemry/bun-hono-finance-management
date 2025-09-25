import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  removeAccessTokenCookie,
  removeRefreshTokenCookie,
} from "@/utils/jwt";
import { Context } from "hono";
import { verify } from "hono/jwt";
import { getCookie } from "hono/cookie";
import { AuthServices } from "./auth.services";
import { errorResponse, successResponse } from "@/utils/http-response";
import {
  changeRequest,
  forgotRequest,
  loginRequest,
  registerRequest,
  resetRequest,
  verifyOtpRequest,
} from "./auth.models";

export class AuthControllers {
  // 1. register new user
  static register = async (c: Context) => {
    const request = (await c.req.json()) as registerRequest;

    // call auth services to handle business logic
    const message = await AuthServices.register(request);

    // return http response
    return successResponse(c, message);
  };

  //  2. verify token by email
  static verifyToken = async (c: Context) => {
    const request = (await c.req.json()) as verifyOtpRequest;

    // call auth services to handle business logic
    const response = await AuthServices.verifyToken(request);

    // set token in cookie
    setRefreshTokenCookie(c, response.token.refreshToken);
    setAccessTokenCookie(c, response.token.accessToken);

    return successResponse(c, "OTP Verified successfully", response.user);
  };

  //   3. login user
  static login = async (c: Context) => {
    const request = (await c.req.json()) as loginRequest;

    // call auth services to handle business logic
    const response = await AuthServices.login(request);

    // set token in cookie
    setRefreshTokenCookie(c, response.token.refreshToken);
    setAccessTokenCookie(c, response.token.accessToken);

    return successResponse(c, "Login successfully", response.user);
  };

  // 4.  logout user
  static logout = async (c: Context) => {
    const cookie = getCookie(c, "refreshToken");

    if (!cookie) {
      return errorResponse(c, "No refresh token found", 400);
    }

    // clear cookie from browser
    removeRefreshTokenCookie(c);
    removeAccessTokenCookie(c);

    return successResponse(c, "Logout successfully");
  };

  // 5. refresh session
  static refreshSession = async (c: Context) => {
    // check of cookie exists
    const refreshToken = getCookie(c, "refreshToken");

    // if no cookie, return error
    if (!refreshToken) {
      return errorResponse(c, "Unauthorized", 401);
    }

    // verify the token
    const user = await verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    if (!user) {
      return errorResponse(c, "Unauthorized", 401);
    }

    // set user to process on services
    c.set("user", user);

    // call auth services to handle business logic
    const response = await AuthServices.refreshSession(c);

    // replace old token with new token
    setRefreshTokenCookie(c, response.token.refreshToken);
    setAccessTokenCookie(c, response.token.accessToken);

    return successResponse(c, "Refresh session successfully", response.user);
  };

  // 6. get current session
  static async getSession(c: Context) {
    const user = c.get("user");

    // call auth services to handle business logic
    const response = await AuthServices.getSession(user?.userId);

    return successResponse(c, "Session fetched successfully", response);
  }

  // 7. forgot password
  static async forgotPassword(c: Context) {
    const { email } = (await c.req.json()) as forgotRequest;

    const message = await AuthServices.forgotPassword(email);

    return successResponse(c, message);
  }

  // 8. reset password
  static async resetPassword(c: Context) {
    const request = (await c.req.json()) as resetRequest;

    const message = await AuthServices.resetPassword(request);

    return successResponse(c, message);
  }

  // 9. change password
  static async changePassword(c: Context) {
    const user = c.get("user");
    const request = (await c.req.json()) as changeRequest;

    const message = await AuthServices.changePassword(user.userId, request);

    return successResponse(c, message);
  }
}
