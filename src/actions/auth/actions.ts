"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const secretKey = formData.get("secretKey") as string;
  const validKey = process.env.DASHBOARD_SECRET_KEY;

  if (!validKey) {
    redirect("/auth?error=config");
  }

  if (secretKey !== validKey) {
    redirect("/auth?error=invalid");
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_session", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  redirect("/auth");
}
