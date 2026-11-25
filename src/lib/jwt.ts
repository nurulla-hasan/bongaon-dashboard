import jwt, { type JwtPayload } from "jsonwebtoken";
import type { UserRole } from "@/types";

export interface Session {
  id: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

let warnedMissingSecret = false;

function accessSecret(): string | null {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    if (!warnedMissingSecret) {
      warnedMissingSecret = true;
      console.warn(
        "[auth] JWT_ACCESS_SECRET is not set: every request is treated as signed out.",
      );
    }
    return null;
  }

  return secret;
}

/** Verifies an API-signed access token and returns its claims, or null. */
export function verifyAccessToken(token?: string): Session | null {
  const secret = accessSecret();

  if (!token || !secret) return null;

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;

    if (!payload.email || !payload.role) return null;

    return {
      id: String(payload.id ?? ""),
      email: payload.email as string,
      role: payload.role as UserRole,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}
