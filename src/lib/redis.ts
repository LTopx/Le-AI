import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: (process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL as string) || "",
  token: (process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN as string) || "",
});
