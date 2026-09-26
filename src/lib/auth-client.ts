"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Browser-side auth client. With no `baseURL` it talks to the route handler on
 * the current origin (`/api/auth/*`).
 */
export const authClient = createAuthClient();
