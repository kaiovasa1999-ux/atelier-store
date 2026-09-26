import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// drizzle-kit runs outside Next.js, so it has to load the env files itself.
// Earlier paths win, matching Next's own precedence.
config({ path: [".env.local", ".env"], quiet: true });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  strict: true,
  verbose: true,
});
