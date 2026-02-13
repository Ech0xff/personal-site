import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { CACHE_TAGS, revalidateTag } from "@/lib/server/services-cache";
import { ROUTES } from "@/lib/shared/routes";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const expectedToken = `Bearer ${process.env.WEBHOOK_SECRET}`;

  if (authHeader !== expectedToken)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const table = body?.table;
    const record = body?.record ?? body?.new;
    const oldRecord = body?.old_record;
    const id = record?.id ?? oldRecord?.id;

    const paths = new Set<string>();
    const tags = new Set<string>();

    switch (table) {
      case "posts":
        tags.add(CACHE_TAGS.POSTS);
        tags.add(CACHE_TAGS.SUMMARY);
        paths.add(ROUTES.POSTS);
        paths.add(ROUTES.HOME);
        if (id) paths.add(ROUTES.POST(id));
        break;
      case "thoughts":
        tags.add(CACHE_TAGS.THOUGHTS);
        tags.add(CACHE_TAGS.SUMMARY);
        paths.add(ROUTES.THOUGHTS);
        paths.add(ROUTES.HOME);
        break;
      case "events":
        tags.add(CACHE_TAGS.EVENTS);
        tags.add(CACHE_TAGS.SUMMARY);
        paths.add(ROUTES.EVENTS);
        paths.add(ROUTES.HOME);
        break;
      default:
        break;
    }

    tags.forEach((tag) => revalidateTag(tag));
    paths.forEach((path) => revalidatePath(path));

    return NextResponse.json({ message: "Revalidation triggered" });
  } catch {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 },
    );
  }
}
