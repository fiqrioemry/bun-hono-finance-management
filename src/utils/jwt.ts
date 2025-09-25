import { Context } from "hono";
import { sign } from "hono/jwt";
import { setCookie, deleteCookie } from "hono/cookie";

type Payload = {
  userId: string;
  email: string;
  exp?: number;
};

const ACCESS_EXPIRY = 15 * 60; // 15 minutes in seconds
const REFRESH_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

export async function generateAccessToken(payload: Payload): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + ACCESS_EXPIRY;
  const tokenPayload = { ...payload, exp };
  return await sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET || "");
}

export async function generateRefreshToken(payload: Payload): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + REFRESH_EXPIRY; // 7 days
  const tokenPayload = { ...payload, exp };
  return await sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET || "");
}

export function setAccessTokenCookie(c: Context, token: string) {
  setCookie(c, "accessToken", token, {
    httpOnly: true,
    path: "/",
    maxAge: ACCESS_EXPIRY,
  });
}

export function setRefreshTokenCookie(c: Context, token: string) {
  setCookie(c, "refreshToken", token, {
    httpOnly: true,
    path: "/",
    maxAge: REFRESH_EXPIRY,
  });
}

export function removeRefreshTokenCookie(c: Context) {
  deleteCookie(c, "refreshToken", { path: "/" });
}

export function removeAccessTokenCookie(c: Context) {
  deleteCookie(c, "accessToken", { path: "/" });
}
