"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  Calendar,
  Eye,
  FileText,
  MessageCircle,
  PenSquare,
  Plus,
} from "lucide-react";

import { getDashboardSummaryClient } from "@/lib/client/data";
import { BlogSummaryData } from "@/types";

import DashboardShell from "../components/ui/DashboardShell";

const quickActions = [
  {
    title: "New Post",
    description: "Create a new blog post",
    href: "/dashboard/posts",
    icon: PenSquare,
    color: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    title: "New Thought",
    description: "Share a quick thought",
    href: "/dashboard/thoughts",
    icon: MessageCircle,
    color: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    title: "New Event",
    description: "Add a timeline event",
    href: "/dashboard/event",
    icon: Plus,
    color: "bg-green-50 dark:bg-green-900/20",
  },
];

export default function DashboardPage() {
  const [summaryData, setSummaryData] = useState<BlogSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const data = await getDashboardSummaryClient(5);
        if (!isMounted) return;
        setSummaryData(data);
        setError(false);
      } catch {
        if (!isMounted) return;
        setError(true);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    {
      label: "Total Posts",
      value:
        (summaryData?.statistics.posts.show.count ?? 0) +
          (summaryData?.statistics.posts.hide.count ?? 0) || "—",
      icon: FileText,
    },
    {
      label: "Total Thoughts",
      value:
        (summaryData?.statistics.thoughts.show.count ?? 0) +
          (summaryData?.statistics.thoughts.hide.count ?? 0) || "—",
      icon: MessageCircle,
    },
    {
      label: "Total Events",
      value:
        (summaryData?.statistics.events.show.count ?? 0) +
          (summaryData?.statistics.events.hide.count ?? 0) || "—",
      icon: Calendar,
    },
    {
      label: "Total Characters",
      value:
        (
          (summaryData?.statistics.posts.show.characters ?? 0) +
          (summaryData?.statistics.posts.hide.characters ?? 0) +
          (summaryData?.statistics.thoughts.show.characters ?? 0) +
          (summaryData?.statistics.thoughts.hide.characters ?? 0) +
          (summaryData?.statistics.events.show.characters ?? 0) +
          (summaryData?.statistics.events.hide.characters ?? 0)
        ).toLocaleString() || "—",
      icon: Eye,
    },
  ];

  return (
    <DashboardShell title="Overview" loading={loading} error={error}>
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Welcome back!
        </h2>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
          Here&apos;s an overview of your content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center gap-3">
              <stat.icon className="h-6 w-6 shrink-0 text-zinc-500 dark:text-zinc-400" />
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className={`group rounded-xl border border-zinc-200 p-6 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-700 ${action.color}`}
            >
              <div className="flex items-center gap-4">
                <action.icon className="h-8 w-8 shrink-0 text-zinc-600 dark:text-zinc-300" />
                <div>
                  <h4 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
                    {action.title}
                  </h4>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Recent Activity
        </h3>
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-zinc-500 dark:text-zinc-400">
            No recent activity to show.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
