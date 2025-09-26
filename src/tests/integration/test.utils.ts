import prisma from "@/config/database";
import redis from "@/config/redis";
import { hashPassword } from "@/utils/generate";

export class AuthTest {
  static async delete() {
    return await prisma.user.deleteMany({
      where: { name: "test-name" },
    });
  }

  static async create() {
    const hashedPassword = await hashPassword("rahasia");
    return await prisma.user.create({
      data: {
        email: "test@example.com",
        image: "https://i.pravatar.cc/150?u=test@example.com",
        hashedPassword,
        name: "test-name",
      },
    });
  }
  static async deleteKeys() {
    try {
      const keys = await redis.keys("verify:*");
      if (keys && keys.length > 0) {
        await Promise.all(keys.map((k) => redis.del(k)));
      }

      const otpKeys = await redis.keys("otp:*");
      if (otpKeys && otpKeys.length > 0) {
        await Promise.all(otpKeys.map((k) => redis.del(k)));
      }
    } catch (err) {
      console.error("Redis cleanup error:", err);
    }
  }
}
