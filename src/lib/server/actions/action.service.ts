import "server-only";
import { z } from "zod";

import type { ActionResult } from "#lib/shared/actions/action.type";

import { AdminAccessError, requireAdmin } from "../auth/session.service";

export class InputError extends Error {}
export async function adminAction<T>(
  operation: () => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    await requireAdmin();
    return { ok: true, data: await operation() };
  } catch (error) {
    if (error instanceof AdminAccessError)
      return { ok: false, error: error.message, unauthorized: true };
    if (error instanceof z.ZodError)
      return { ok: false, error: error.issues[0]?.message ?? "Invalid input." };
    if (error instanceof InputError) return { ok: false, error: error.message };
    console.error("Admin operation failed.", error);
    return { ok: false, error: "The operation failed. Please try again." };
  }
}
