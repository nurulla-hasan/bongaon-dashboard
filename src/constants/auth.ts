export const ACCESS_COOKIE_NAME = "accessToken";
export const REFRESH_COOKIE_NAME = "refreshToken";
export const USER_HOME = "/dashboard";

export const AUTH_ROUTES = [
  "/login",
  "/forgot-password",
  "/verify-reset-otp",
  "/reset-password",
] as const;

export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function isAdminRole(role?: string): boolean {
  return role === "ADMIN";
}
