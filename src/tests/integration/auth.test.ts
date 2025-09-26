import app from "@/app";
import redis from "@/config/redis";
import { AuthTest } from "./test.utils";
import { describe, it, expect, afterEach, beforeEach } from "bun:test";

describe("Auth Register + OTP Flow", () => {
  const testEmail = "test@example.com";

  beforeEach(async () => {
    await AuthTest.delete();
    await AuthTest.deleteKeys();
  });

  afterEach(async () => {
    await AuthTest.delete();
    await AuthTest.deleteKeys();
  });

  it("should reject registration with invalid input", async () => {
    const res = await app.request("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
      }),
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.errors).toBeDefined();
  });

  it("should reject registration with existing email", async () => {
    // buat user manual
    await AuthTest.create();

    const res = await app.request("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: testEmail,
        password: "password",
        confirmPassword: "password",
        name: "test-name",
      }),
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data).toBeDefined();
  });

  it("should success registration but reject verify with invalid OTP", async () => {
    // 1. register dulu
    const res1 = await app.request("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: testEmail,
        password: "password",
        confirmPassword: "password",
        name: "test-name",
      }),
    });
    expect(res1.status).toBe(201);

    // 2. verify pakai OTP salah
    const res2 = await app.request("/api/v1/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        email: testEmail,
        otp: "123456",
      }),
    });
    expect(res2.status).toBe(400);
  });

  it("should register new user and verify OTP successfully", async () => {
    const regRes = await app.request("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "test-1@example.com",
        password: "password",
        confirmPassword: "password",
        name: "test-name",
      }),
    });
    expect(regRes.status).toBe(201);

    // 1. ambil OTP dari Redis
    const otp = await redis.get(`otp:test-1@example.com`);
    expect(otp).toBeDefined();

    // 2. verify OTP
    const verRes = await app.request("/api/v1/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        email: "test-1@example.com",
        otp,
      }),
    });

    expect(verRes.status).toBe(201);
    const data = await verRes.json();
    expect(data).toBeDefined();
  });
});
