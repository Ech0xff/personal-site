import type { ContentSummary } from "#lib/shared/content/content.schema";

function escapeXml(value: string): string {
  return value
    .replace(
      // XML 1.0 excludes control characters and unpaired surrogates.
      // oxlint-disable-next-line no-control-regex
      /[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/gu,
      "",
    )
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function renderPostFeed(
  posts: readonly Pick<
    ContentSummary,
    "id" | "title" | "excerpt" | "published_at"
  >[],
  origin: string,
): string {
  const items = posts.slice(0, 20).map((post) => {
    const link = escapeXml(new URL(`/posts/${post.id}`, origin).href);
    // RSS descriptions contain HTML, escaped again for the outer XML document.
    const description = escapeXml(escapeXml(post.excerpt));
    return `<item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="false">urn:uuid:${post.id}</guid>
      <description>${description}</description>
      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>
    </item>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Little Nest</title>
    <link>${escapeXml(origin)}/posts</link>
    <description>Writings and articles about tech, life, and everything in between.</description>
    <atom:link href="${escapeXml(origin)}/rss.xml" rel="self" type="application/rss+xml" />
    ${items.join("\n")}
  </channel>
</rss>`;
}
