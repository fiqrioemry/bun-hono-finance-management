import type {
  userResponse,
  authResponse,
  loginRequest,
  verifyOtpRequest,
  registerRequest,
  resetRequest,
  changeRequest,
} from "./auth.models";
import { userSchema } from "./auth.models";

import {
  generateOTP,
  hashPassword,
  generateAvatar,
  comparePassword,
  generateToken,
} from "@/utils/generate";
import { Context } from "hono";
import redis from "@/config/redis";
import prisma from "@/config/database";
import { HTTPException } from "hono/http-exception";
import { sendOtpEmail, sendResetLink } from "@/utils/mailer";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt";

export class AuthServices {
  // register new user
  static async register(res: registerRequest): Promise<string> {
    //   check if email exists
    const emailExists = await prisma.user.findUnique({
      where: { email: res.email },
    });

    // throw error if email exists
    if (emailExists) {
      throw new HTTPException(400, { message: "Email already exists" });
    }

    // hash password
    res.password = await hashPassword(res.password);

    // store user data in redis
    await redis.set(`verify:${res.email}`, JSON.stringify(res), "EX", 30 * 60);

    // generate OTP code
    const otpCode = await generateOTP();

    // store OTP in redis
    await redis.set(`otp:${res.email}`, otpCode, "EX", 10 * 60);

    await sendOtpEmail(res.email, otpCode);

    return "Registration successful. Please check your email ";
  }

  static async verifyToken(res: verifyOtpRequest): Promise<authResponse> {
    const { email, otp } = res;

    // verify user data and otp from redis
    const userData = await redis.get(`verify:${email}`);
    if (!userData) {
      throw new HTTPException(400, { message: "Invalid or expired token" });
    }

    // verify otp code
    const storedOtp = await redis.get(`otp:${email}`);
    if (otp !== storedOtp) {
      throw new HTTPException(400, { message: "Invalid or expired token" });
    }

    // create new user in database
    const parsedData = JSON.parse(userData) as registerRequest;
    const image = await generateAvatar(parsedData.name);
    const newUser = await prisma.user.create({
      data: {
        email: parsedData.email,
        name: parsedData.name,
        image: image,
        hashedPassword: parsedData.password,
      },
    });

    // delete redis keys
    await redis.del(`verify:${email}`);
    await redis.del(`otp:${email}`);

    // map payload for jwt claims
    const payload = { userId: newUser.id, email: newUser.email };

    // generate jwt token
    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    const parsedUser = userSchema.parse(newUser);

    return {
      user: parsedUser,
      token: {
        accessToken,
        refreshToken,
      },
    };
  }

  // login user
  static async login(data: loginRequest): Promise<authResponse> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new HTTPException(400, { message: "Invalid email or password" });
    }

    // check password from database
    const isPasswordValid = await comparePassword(
      data.password,
      user.hashedPassword
    );

    // throw error if password is invalid
    if (!isPasswordValid) {
      throw new HTTPException(400, { message: "Invalid email or password" });
    }

    // create data for jwt claims and generate token
    const payload = { userId: user.id, email: user.email };
    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    const parsedUser = userSchema.parse(user);

    // map response data
    return {
      user: parsedUser,
      token: {
        accessToken,
        refreshToken,
      },
    };
  }

  static async refreshSession(c: Context): Promise<authResponse> {
    const data = c.get("user");

    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }

    // create data for jwt claims and generate token
    const payload = { userId: user?.id, email: user?.email };
    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    const parsedUser = userSchema.parse(user);

    // map response data
    return {
      user: parsedUser,
      token: {
        accessToken,
        refreshToken,
      },
    };
  }

  static async getSession(id: string): Promise<userResponse> {
    // fetch user from database
    const user = await prisma.user.findUnique({ where: { id } });

    // throw error if user not found
    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }

    // parse to schema and return
    return userSchema.parse(user);
  }

  static async forgotPassword(email: string): Promise<string> {
    // check if email exists
    const user = await prisma.user.findUnique({ where: { email } });

    // if not found keep sending success response for security purpose
    if (!user) {
      return "forgot password link sent to your email";
    }

    // generate token
    const token = await generateToken(32);

    // save as keys and email as value (use for next reset password)
    await redis.set(`forgot:${token}`, email, "EX", 30 * 60);

    // set reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    // send email to user
    await sendResetLink(email, resetLink);

    // return success message
    return "forgot password link sent to your email";
  }

  // reset password
  static async resetPassword(request: resetRequest): Promise<string> {
    //get stored email from redis
    const storedEmail = await redis.get(`forgot:${request.token}`);
    if (!storedEmail) {
      throw new HTTPException(400, { message: "Invalid or expired token" });
    }

    // make sure that email really exists
    const user = await prisma.user.findUnique({
      where: { email: storedEmail },
    });

    // delete redis key
    await redis.del(`forgot:${request.token}`);

    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }

    // hash new password
    const newHashedPassword = await hashPassword(request.password);

    // update user password in database
    const updateUser = await prisma.user.update({
      where: { email: storedEmail },
      data: { hashedPassword: newHashedPassword },
    });

    // if update failed log to system
    if (!updateUser) {
      await redis.del(`forgot:${request.token}`);
      throw new HTTPException(500, { message: "Failed to reset password" });
    }

    return "Password reset successful";
  }

  static async changePassword(
    id: string,
    request: changeRequest
  ): Promise<string> {
    // make sure user really exists

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }

    // compare current password
    const isValidPassword = await comparePassword(
      request.currentPassword,
      user.hashedPassword
    );

    if (!isValidPassword) {
      throw new HTTPException(400, { message: "Invalid current password" });
    }

    // hash new password before save
    const newHashedPassword = await hashPassword(request.password);

    const updateUser = await prisma.user.update({
      where: { id },
      data: { hashedPassword: newHashedPassword },
    });

    // if update failed log to system
    if (!updateUser) {
      throw new HTTPException(500, { message: "Failed to change password" });
    }

    return "Password changed successfully";
  }
}
