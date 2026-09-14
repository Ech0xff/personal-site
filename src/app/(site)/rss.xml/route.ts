import { listPublicContent } from "#lib/server/content/public-content.service";
import { renderPostFeed } from "#lib/server/content/rss.helper";

export async function GET(request: Request): Promise<Response> {
  const origin = new URL(request.url).origin;
  const posts = await listPublicContent("posts");
  return new Response(renderPostFeed(posts, origin), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
