import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { CACHE_TAGS, getCollectionTagByTable } from "@/lib/server/cache";

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

    const tags = new Set<string>();
    const collectionTag =
      table === "posts" || table === "thoughts" || table === "events"
        ? getCollectionTagByTable(table)
        : null;

    if (collectionTag) {
      tags.add(collectionTag);
      tags.add(CACHE_TAGS.summary);
    }

    switch (table) {
      case "posts":
        if (id) {
          tags.add(CACHE_TAGS.post(id));
        }
        break;
      case "thoughts":
        break;
      case "events":
        break;
      default:
        break;
    }

    tags.forEach((tag) => {
      revalidateTag(tag, "max");
    });

    return NextResponse.json({
      message: "Revalidation triggered",
      table,
      tags: Array.from(tags),
    });
  } catch {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 },
    );
  }
}
