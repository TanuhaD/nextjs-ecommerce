import zod from "zod";

const envSchema = zod.object({
  DATABASE_URL: zod.string().nonempty(),
  GOOGLE_CLIENT_ID: zod.string().nonempty(),
  GOOGLE_CLIENT_SECRET: zod.string().nonempty(),
  NEXTAUTH_URL: zod.string().nonempty(),
  BASE_URL: zod.string().nonempty(),
  NEXTAUTH_SECRET: zod.string().nonempty(),
  GITHUB_ID: zod.string().nonempty(),
  GITHUB_SECRET: zod.string().nonempty(),
  TELEGRAM_TOKEN: zod.string().nonempty(),
  TELEGRAM_CHAT_ID: zod.string().nonempty(),
});

export const env = envSchema.parse(process.env);
