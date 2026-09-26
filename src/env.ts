/**
 * Server-side environment variables, read through getters so a missing value
 * fails at the point of use with a readable message instead of surfacing as
 * `undefined` deep inside the database driver or the auth config.
 *
 * Never import this from a client component.
 */

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }

  return value;
}

export const env = {
  get DATABASE_URL() {
    return required("DATABASE_URL");
  },
  get BETTER_AUTH_SECRET() {
    return required("BETTER_AUTH_SECRET");
  },
  get BETTER_AUTH_URL() {
    return process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
  },
};
