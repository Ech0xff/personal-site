"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { adminAction } from "../actions/action.service";
import { manageGuestbook } from "./guestbook.service";
export async function updateGuestbook(input: unknown) {
  return adminAction(async () => {
    const { id, operation } = z
      .object({ id: z.uuid(), operation: z.enum(["show", "hide", "delete"]) })
      .parse(input);
    await manageGuestbook(id, operation);
    revalidatePath("/dashboard/guestbook");
    revalidatePath("/");
    return null;
  });
}
