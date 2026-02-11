"use client";

import { useState } from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import SvgGithub from "@/components/icons/Github";
import { useAuth } from "./hooks/useAuth";

const errorMessages: Record<string, string> = {
  config: "Server configuration error",
  invalid: "Invalid email or password",
  forbidden: "You do not have admin access",
  register: "Registration failed. Email may already be in use.",
  oauth: "GitHub login failed",
};

type Mode = "login" | "register";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorMessage = error ? errorMessages[error] : null;
  const [mode, setMode] = useState<Mode>("login");

  const { handleLogin: login, handleRegister: register, handleLoginWithOauth: loginWithGithub } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--theme-bg) p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              {mode === "login"
                ? "Sign in to your account"
                : "Sign up for a new account"}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="mb-6 flex rounded-lg bg-zinc-200 p-1 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                mode === "login"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                mode === "register"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form
            action={mode === "login" ? login : register}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
                required
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
                required
              />
            </div>

            {errorMessage && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-center text-sm text-red-600 dark:text-red-400">
                  {errorMessage}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mode === "login" ? "Sign In" : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
            <span className="text-sm text-zinc-400 dark:text-zinc-500">or</span>
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
          </div>

          {/* GitHub OAuth */}
          <form action={loginWithGithub}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3 font-medium text-zinc-900 transition-all duration-200 hover:bg-zinc-50 focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              <SvgGithub className="h-5 w-5" />
              Continue with GitHub
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="transition-colors hover:text-blue-500">
            &larr; Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
