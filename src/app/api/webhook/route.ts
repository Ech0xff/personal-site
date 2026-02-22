import { NextRequest, NextResponse } from "next/server";

// TODO: refactor
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
        break;
      case "thoughts":
        break;
      case "events":
        break;
      default:
        break;
    }

    return NextResponse.json({ message: "Revalidation triggered" });
  } catch {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 },
    );
  }
}
