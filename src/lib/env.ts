import { z } from "zod"

const envSchema = z.object({
  API_DATABASE_URL: z.string(),
  API_PORT: z.coerce.number(),
  API_COOKIE_SECRET: z.string()
})

export const env = envSchema.parse(process.env)

