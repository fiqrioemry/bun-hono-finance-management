import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Name must be at least 2 characters" }),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email address" }),
  otp: z
    .string()
    .min(6, { message: "OTP is required" })
    .max(6, { message: "OTP must be 6 characters" }),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email address" }),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().uuid().length(64, { message: "Invalid token" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  image: z.string().url().nullable(),
  createdAt: z.date(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "current Password is Required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type token = {
  accessToken: string;
  refreshToken: string;
};

export type userResponse = z.infer<typeof userSchema>;
export type loginRequest = z.infer<typeof loginSchema>;
export type registerRequest = z.infer<typeof registerSchema>;
export type verifyOtpRequest = z.infer<typeof verifyOtpSchema>;
export type changeRequest = z.infer<typeof changePasswordSchema>;
export type forgotRequest = z.infer<typeof forgotPasswordSchema>;
export type resetRequest = z.infer<typeof resetPasswordSchema>;
export type authResponse = { user: userResponse; token: token };
