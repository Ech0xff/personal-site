"use client";

import { useEffect, useMemo, useState } from "react";

import { getT } from "@/lib/shared/i18n/tools";
import type { ContributionDay } from "@/types";

type Props = {
  locale?: string;
  posts: ContributionDay[];
  thoughts: ContributionDay[];
  events: ContributionDay[];
};

type CalendarCell = {
  date: Date;
  count: number;
  inRange: boolean;
};

type MonthLabel = {
  start: number;
  end: number;
  label: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const BASE_SIZE = "11px";
const LEGEND_CELL_SIZE = "0.875rem";

const CELL_LEVEL_CLASS = [
  "bg-zinc-200/80 dark:bg-zinc-800",
  "bg-emerald-200 dark:bg-emerald-950",
  "bg-emerald-300 dark:bg-emerald-800",
  "bg-emerald-400 dark:bg-emerald-700",
  "bg-emerald-500 dark:bg-emerald-500",
];

const getWeekdayLabels = (locale: string) =>
  locale.startsWith("zh")
    ? [
        { index: 1, label: "一" },
        { index: 3, label: "三" },
        { index: 5, label: "五" },
      ]
    : [
        { index: 1, label: "Mon" },
        { index: 3, label: "Wed" },
        { index: 5, label: "Fri" },
      ];

const formatDateKey = (date: Date) => date.toISOString().slice(0, 10);

const getLevel = (count: number) => {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count <= 4) return 3;
  return 4;
};

const multiplyLength = (base: string, factor: number) =>
  `calc(${base} * ${factor})`;

const mergeContributions = (
  posts: ContributionDay[],
  thoughts: ContributionDay[],
  events: ContributionDay[],
) => {
  const merged = new Map<string, number>();

  for (const item of [...posts, ...thoughts, ...events]) {
    merged.set(item.date, (merged.get(item.date) ?? 0) + item.count);
  }

  return merged;
};

const buildCalendarWeeks = (
  contributions: Map<string, number>,
  startDate: Date,
  endDate: Date,
) => {
  const rangeStart = new Date(startDate);
  rangeStart.setUTCDate(rangeStart.getUTCDate() - rangeStart.getUTCDay());

  const rangeEnd = new Date(endDate);
  rangeEnd.setUTCDate(rangeEnd.getUTCDate() + (6 - rangeEnd.getUTCDay()));

  const cells: CalendarCell[] = [];
  for (
    let time = rangeStart.getTime();
    time <= rangeEnd.getTime();
    time += DAY_MS
  ) {
    const date = new Date(time);
    const key = formatDateKey(date);
    cells.push({
      date,
      count: contributions.get(key) ?? 0,
      inRange: time >= startDate.getTime() && time <= endDate.getTime(),
    });
  }

  const weeks: CalendarCell[][] = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }

  return weeks;
};

const buildMonthLabels = (
  weeks: CalendarCell[][],
  locale: string,
): MonthLabel[] => {
  const formatter = new Intl.DateTimeFormat(locale, {
    month: "short",
    timeZone: "UTC",
  });
  const labels: MonthLabel[] = [];
  let previousMonth = -1;

  weeks.forEach((week, index) => {
    const firstInRange = week.find((day) => day.inRange);
    if (!firstInRange) return;

    const month = firstInRange.date.getUTCMonth();
    if (index === 0 || month !== previousMonth) {
      labels.push({
        start: index,
        end: weeks.length,
        label: formatter.format(firstInRange.date),
      });
      previousMonth = month;
    }
  });

  labels.forEach((item, index) => {
    item.end = labels[index + 1]?.start ?? weeks.length;
  });

  return labels;
};

const formatTooltipDate = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);

const getAvailableYears = (contributions: Map<string, number>) => {
  const years = new Set<number>();
  const currentYear = new Date().getUTCFullYear();

  years.add(currentYear);

  for (const date of contributions.keys()) {
    years.add(Number(date.slice(0, 4)));
  }

  return Array.from(years).sort((a, b) => b - a);
};

export default function ContributionCalendar({
  locale = "en-US",
  posts,
  thoughts,
  events,
}: Props) {
  const base = BASE_SIZE;
  const t = getT("IndexHome", locale);
  const merged = useMemo(
    () => mergeContributions(posts, thoughts, events),
    [events, posts, thoughts],
  );
  const availableYears = useMemo(() => getAvailableYears(merged), [merged]);
  const [selectedYear, setSelectedYear] = useState(availableYears[0] ?? 2026);

  const currentYearContributions = useMemo(
    () =>
      new Map(
        Array.from(merged.entries()).filter(([date]) =>
          date.startsWith(`${selectedYear}-`),
        ),
      ),
    [merged, selectedYear],
  );

  const yearStart = new Date(Date.UTC(selectedYear, 0, 1));
  const yearEnd = new Date(Date.UTC(selectedYear, 11, 31));
  const weeks = buildCalendarWeeks(
    currentYearContributions,
    yearStart,
    yearEnd,
  );
  const monthLabels = buildMonthLabels(weeks, locale);
  const weekdayLabels = getWeekdayLabels(locale);
  const extraTopSpace = multiplyLength(base, 3);
  const gap = multiplyLength(base, 0.3);
  const weekdayLabelWidth = multiplyLength(base, 4);
  const axisLabelFontSize = `clamp(${multiplyLength(base, 0.9)}, 0.56rem + 0.32vw, ${multiplyLength(base, 1.18)})`;
  const minWidth = `calc(${weekdayLabelWidth} + ${base} * ${weeks.length} + ${gap} * ${weeks.length})`;
  const calendarGridStyle = {
    gridTemplateColumns: `${weekdayLabelWidth} repeat(${weeks.length}, minmax(${base}, 1fr))`,
    columnGap: gap,
    rowGap: gap,
  };

  useEffect(() => {
    if (
      !availableYears.includes(selectedYear) &&
      availableYears[0] !== undefined
    ) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  if (weeks.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl p-4">
      <div
        className="max-w-full overflow-x-auto pb-1"
        style={{
          paddingTop: extraTopSpace,
          marginTop: `calc(${extraTopSpace} * -1)`,
        }}
      >
        <div className="w-full min-w-full" style={{ minWidth }}>
          <div className="grid items-start" style={calendarGridStyle}>
            <div aria-hidden="true" />
            {monthLabels.map((item) => (
              <div
                key={`${item.start}-${item.label}`}
                className="min-w-0 justify-self-start whitespace-nowrap font-semibold text-emerald-500 leading-none"
                style={{
                  gridColumn: `${item.start + 2} / ${item.end + 2}`,
                  gridRow: "1",
                  fontSize: axisLabelFontSize,
                }}
              >
                {item.label}
              </div>
            ))}

            {Array.from({ length: 7 }, (_, index) => {
              const label = weekdayLabels.find(
                (item) => item.index === index,
              )?.label;

              return (
                <div
                  key={index}
                  className="flex h-full items-center justify-end pr-1 font-semibold text-emerald-500 leading-none"
                  style={{
                    gridColumn: "1",
                    gridRow: `${index + 2}`,
                    fontSize: axisLabelFontSize,
                  }}
                >
                  {label ?? ""}
                </div>
              );
            })}

            {weeks.map((week, weekIndex) =>
              week.map((day, dayIndex) => {
                const level = getLevel(day.count);
                const dateLabel = formatTooltipDate(day.date, locale);

                return (
                  <div
                    key={formatDateKey(day.date)}
                    className="group/tooltip relative"
                    style={{
                      gridColumn: `${weekIndex + 2}`,
                      gridRow: `${dayIndex + 2}`,
                    }}
                  >
                    <div
                      title={`${dateLabel}: ${day.count}`}
                      className={[
                        "aspect-square w-full rounded-[3px]",
                        day.inRange
                          ? CELL_LEVEL_CLASS[level]
                          : "bg-transparent",
                      ].join(" ")}
                      style={{
                        borderRadius: multiplyLength(base, 0.3),
                      }}
                    />
                    {day.inRange && (
                      <div
                        className={[
                          "pointer-events-none invisible absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-2 py-1.5 text-white opacity-0 shadow-lg transition-all group-hover/tooltip:visible group-hover/tooltip:opacity-100 dark:bg-zinc-700",
                        ].join(" ")}
                        style={{
                          fontSize: multiplyLength(base, 0.95),
                        }}
                      >
                        {dateLabel}
                      </div>
                    )}
                  </div>
                );
              }),
            )}
          </div>
        </div>
      </div>

      <div
        className={[
          "mt-3 flex flex-wrap items-center justify-between gap-3 text-slate-500 dark:text-slate-400",
        ].join(" ")}
        style={{ fontSize: multiplyLength(base, 0.95) }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <div
            role="tablist"
            aria-label="Select contribution year"
            className="flex items-center rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800"
          >
            {availableYears.map((year) => (
              <button
                key={year}
                type="button"
                role="tab"
                aria-selected={year === selectedYear}
                onClick={() => setSelectedYear(year)}
                className={[
                  "rounded-md px-2 py-0.5 font-medium transition-all",
                  year === selectedYear
                    ? "bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300",
                ].join(" ")}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span>{t("stats.less")}</span>
          {CELL_LEVEL_CLASS.map((className, index) => (
            <div
              key={index}
              className={["rounded-[3px]", className].join(" ")}
              style={{
                height: LEGEND_CELL_SIZE,
                width: LEGEND_CELL_SIZE,
                borderRadius: "3px",
              }}
            />
          ))}
          <span>{t("stats.more")}</span>
        </div>
      </div>
    </div>
  );
}
