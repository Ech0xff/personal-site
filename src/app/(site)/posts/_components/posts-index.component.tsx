import * as stylex from "@stylexjs/stylex";
import { groupBy } from "es-toolkit";

import { listPublicContent } from "#lib/server/content/public-content.service";
import { formatTime } from "#lib/shared/utils/date.helper";

import { DeskLink } from "../../_components/layout/desk-navigation.component";
import { contentStyles } from "../../_components/layout/public-content.style";
import { RouteReady } from "../../_components/layout/route-ready.component";
import { foundation } from "../../_design/foundation.style";
import { postsStyles as styles } from "./posts-index.style";

export async function PostsIndex() {
  const items = await listPublicContent("posts");
  const characters = items.reduce(
    (total, item) => total + item.characterCount,
    0,
  );
  const years = Object.entries(
    groupBy(items, (item) => formatTime(item.published_at, "YYYY")),
  ).sort(([first], [second]) => Number(second) - Number(first));
  return (
    <RouteReady href="/posts">
      <section {...stylex.props(contentStyles.page, styles.page)}>
        <h1 tabIndex={-1} {...stylex.props(contentStyles.title, styles.title)}>
          Posts
        </h1>
        <p {...stylex.props(styles.summary)}>
          Writings and articles about tech, life, and everything in between.
          Total <strong {...stylex.props(styles.total)}>{items.length}</strong>{" "}
          posts, approx{" "}
          <strong {...stylex.props(styles.total)}>{characters}</strong>{" "}
          characters.
        </p>
        {items.length === 0 && (
          <p {...stylex.props(styles.summary)}>
            Nothing here yet. Check back soon.
          </p>
        )}
        <div {...stylex.props(styles.years)}>
          {years.map(([year, posts]) => (
            <section key={year} aria-labelledby={`year-${year}`}>
              <h2 id={`year-${year}`} {...stylex.props(styles.heading)}>
                {year}
                <span {...stylex.props(styles.count)}>({posts.length})</span>
              </h2>
              <ul {...stylex.props(styles.list)}>
                {posts.map((post) => (
                  <li key={post.id}>
                    <DeskLink
                      href={`/posts/${post.id}`}
                      title={post.title}
                      {...stylex.props(styles.row, foundation.focus)}
                    >
                      <span {...stylex.props(styles.link)}>{post.title}</span>
                      <time
                        dateTime={post.published_at}
                        {...stylex.props(styles.date)}
                      >
                        {formatTime(post.published_at)}
                      </time>
                    </DeskLink>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </RouteReady>
  );
}
