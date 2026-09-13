"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  createSessionToken,
  matchesAdminToken,
  SESSION_SECONDS,
} from "./session.helper";
import { SESSION_COOKIE } from "./session.service";

export async function login(_previous: { error: string }, form: FormData) {
  const result = z
    .string()
    .min(1, "Enter your token.")
    .safeParse(form.get("token"));
  const token = process.env.ADMIN_TOKEN;
  if (!token) return { error: "Admin login is not configured." };
  if (!result.success || !matchesAdminToken(result.data, token))
    return { error: "Invalid token." };
  (await cookies()).set(
    SESSION_COOKIE,
    await createSessionToken(token, new Date()),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_SECONDS,
    },
  );
  redirect("/dashboard/posts");
}
export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/auth");
}
