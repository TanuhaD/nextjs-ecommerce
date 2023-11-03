import zod from "zod";

const envSchema = zod.object({
  DATABASE_URL: zod.string().nonempty(),
  GOOGLE_CLIENT_ID: zod.string().nonempty(),
  GOOGLE_CLIENT_SECRET: zod.string().nonempty(),
  NEXT_AUTH_URL: zod.string().nonempty(),
  NEXT_AUTH_SECRET: zod.string().nonempty(),
});

export const env = envSchema.parse(process.env);