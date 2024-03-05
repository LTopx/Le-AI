import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// https://env.t3.gg/docs/nextjs

export const env = createEnv({
  server: {
    // UMAMI_SCRIPT_URL: z.string().optional(),
    // UMAMI_WEBSITE_ID: z.string().optional(),
    NEXT_OUTPUT: z.string().optional(),
  },
  client: {
    // NEXT_PUBLIC_AZURE_API_VERSION: z.string().optional(),
    // NEXT_PUBLIC_LE_AI_API_LINK: z.string().min(1),
  },
  experimental__runtimeEnv: {
    // NEXT_PUBLIC_AZURE_API_VERSION: process.env.NEXT_PUBLIC_AZURE_API_VERSION,
    // NEXT_PUBLIC_LE_AI_API_LINK: process.env.NEXT_PUBLIC_LE_AI_API_LINK,
  },
});
