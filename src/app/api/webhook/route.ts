import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { CACHE_TAGS, TABLE_CACHE_TAGS } from "#lib/server/cache";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const expectedToken = `Bearer ${process.env.WEBHOOK_SECRET}`;

  if (authHeader !== expectedToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const table = body?.table;
    const record = body?.record ?? body?.new;
    const oldRecord = body?.old_record;
    const id = record?.id ?? oldRecord?.id;

    const tags = new Set(TABLE_CACHE_TAGS[table] ?? []);

    if (table === "posts" && !id) tags.add(CACHE_TAGS.post(id));

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
