import { CalendarDays, FileText, GitBranch, Lightbulb } from "lucide-react";

import Link from "@/components/ui/Link";
import { getT } from "@/lib/shared/i18n/tools";
import { formatTime } from "@/lib/shared/utils";
import type { RecentActivityItem } from "@/types";

type Props = {
  locale?: string;
  items: RecentActivityItem[];
};

type ActivityGroup = {
  date: string;
  items: RecentActivityItem[];
};

const getActivityDateKey = (publishedAt: string) =>
  new Date(publishedAt).toISOString().slice(0, 10);

const getActivityHref = (item: RecentActivityItem) => {
  switch (item.kind) {
    case "post":
      return `/posts/${item.id}`;
    case "thought":
      return "/thoughts";
    case "event":
      return "/events";
  }
};

const getActivityTypeIcon = (item: RecentActivityItem) => {
  switch (item.kind) {
    case "post":
      return FileText;
    case "thought":
      return Lightbulb;
    case "event":
      return CalendarDays;
  }
};

const groupRecentActivity = (items: RecentActivityItem[]) => {
  const groups = new Map<string, RecentActivityItem[]>();

  items.forEach((item) => {
    const key = getActivityDateKey(item.published_at);
    const current = groups.get(key) ?? [];
    current.push(item);
    groups.set(key, current);
  });

  return Array.from(groups.entries()).map(
    ([date, groupedItems]): ActivityGroup => ({
      date,
      items: groupedItems,
    }),
  );
};

export default function RecentActivityList({ locale = "en-US", items }: Props) {
  const t = getT("IndexHome", locale);
  const tCommon = getT("Common", locale);
  const groupedActivity = groupRecentActivity(items);

  return (
    <div className="scrollbar-visible max-h-[24rem] overflow-y-auto rounded-2xl pr-1">
      {groupedActivity.length === 0 && (
        <p className="px-3 py-2 text-slate-400 text-sm">
          {t("recentActivity.empty")}
        </p>
      )}
      <div className="divide-y divide-zinc-200/60 dark:divide-zinc-800">
        {groupedActivity.map((group) => {
          const recordText = locale.startsWith("zh")
            ? `${group.items.length}条记录`
            : `${group.items.length} ${
                group.items.length === 1 ? "record" : "records"
              }`;

          return (
            <div key={group.date} className="px-2 py-3 first:pt-1">
              <div className="mb-2 flex items-center gap-2 text-[0.78rem] text-slate-400 dark:text-slate-500">
                <GitBranch className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">
                  {formatTime(
                    group.date,
                    "MMM D, YYYY",
                    tCommon("unknownDate"),
                  )}
                </span>
                <span className="whitespace-nowrap">{recordText}</span>
              </div>

              <div className="space-y-2">
                {group.items.map((item) => {
                  const ActivityIcon = getActivityTypeIcon(item);
                  const href = getActivityHref(item);

                  return (
                    <div
                      key={`${item.kind}-${item.id}`}
                      className="flex items-start gap-2 text-slate-700 dark:text-slate-200"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={href}
                            className="block max-w-full truncate text-current transition-colors hover:text-emerald-500 dark:hover:text-emerald-400"
                          >
                            {item.title}
                          </Link>

                          {item.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[0.72rem] text-slate-500 dark:bg-zinc-900 dark:text-slate-400"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <ActivityIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
