import Link from "next/link";

import { REVALIDATE_CONFIG } from "@/lib/cache";

import { login } from "./actions";

export const revalidate = REVALIDATE_CONFIG.LIST;

const errorMessages: Record<string, string> = {
  config: "Server configuration error",
  invalid: "Invalid secret key",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? errorMessages[error] : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--theme-bg) p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Dashboard
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Enter your secret key to continue
            </p>
          </div>

          <form action={login} className="space-y-6">
            <div>
              <label
                htmlFor="secretKey"
                className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Secret Key
              </label>
              <input
                id="secretKey"
                name="secretKey"
                type="password"
                placeholder="Enter your secret key"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
                required
                autoFocus
              />
            </div>

            {errorMessage && (
              <>
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                  <p className="text-center text-sm text-red-600 dark:text-red-400">
                    {errorMessage}
                  </p>
                </div>
                <script
                  dangerouslySetInnerHTML={{
                    __html: `window.history.replaceState(null, '', window.location.pathname);`,
                  }}
                />
              </>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sign In
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="transition-colors hover:text-blue-500">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
