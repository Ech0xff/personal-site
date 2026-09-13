import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { isValidSession } from "./session.helper";

export const SESSION_COOKIE = "admin_session";
export class AdminAccessError extends Error {
  constructor() {
    super("Your session has expired. Sign in again to continue.");
  }
}
export async function hasAdminSession() {
  return isValidSession(
    (await cookies()).get(SESSION_COOKIE)?.value,
    process.env.ADMIN_TOKEN,
    new Date(),
  );
}
export async function requireAdmin() {
  if (!(await hasAdminSession())) throw new AdminAccessError();
}
export async function requireAdminPage() {
  if (!(await hasAdminSession())) redirect("/auth");
}
