import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL as string);

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("redis error", (err) => {
  console.log("Redis error", err);
});

export default redis;
