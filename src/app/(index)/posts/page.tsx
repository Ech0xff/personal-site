"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

interface PostListItem {
  id: string;
  title: string;
  published_at?: string;
  created_at: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取文章列表
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();
        setPosts(data.data || []);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 计算文章总数
  const totalPosts = useMemo(() => posts.length, [posts]);

  // 按年份分组文章
  const groupedPosts = useMemo(() => {
    if (!posts.length) return {};

    const groups: Record<string, PostListItem[]> = {};

    posts.forEach((post) => {
      const dateStr = post.published_at || post.created_at;
      const date = new Date(dateStr);
      const year = date.getFullYear().toString();

      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(post);
    });

    // 对每个年份内的文章按日期降序排序
    Object.keys(groups).forEach((year) => {
      groups[year]?.sort((a, b) => {
        const dateA = a.published_at || a.created_at;
        const dateB = b.published_at || b.created_at;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
    });

    return groups;
  }, [posts]);

  // 年份降序排列
  const sortedYears = useMemo(
    () => Object.keys(groupedPosts).sort((a, b) => Number(b) - Number(a)),
    [groupedPosts]
  );

  // 格式化日期为 MM.DD 格式
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}.${day}`;
  };

  if (loading) {
    return (
      <div className="w-3xl mx-auto px-6 py-8">
        <div className="text-center py-20">
          <p className="text-body text-theme-text-mute">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-3xl mx-auto px-6 py-8">
      {/* 页面标题 */}
      <h1 className="page-title">文章</h1>
      <p className="page-subtitle">
        共 {totalPosts} 篇文章，按年份分组展示。
      </p>

      {/* 按年份分组的文章列表 */}
      {Object.keys(groupedPosts).length > 0 ? (
        <div className="space-y-12">
          {sortedYears.map((year) => (
            <section key={year}>
              {/* 年份标题 */}
              <h2 className="section-title flex items-center gap-2">
                {year}
                <span className="text-caption text-base font-normal">
                  ({groupedPosts[year]?.length})
                </span>
              </h2>

              {/* 该年份的文章列表 */}
              <div className="space-y-0">
                {groupedPosts[year]?.map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.id}`}
                    className="group flex items-center py-3 border-l-2 pl-6 transition-all duration-300 hover:border-l-accent border-l-theme-border hover:bg-theme-hover"
                  >
                    {/* 日期 */}
                    <span className="text-caption w-16 shrink-0 group-hover:text-theme-text-soft">
                      {formatDate(post.published_at || post.created_at)}
                    </span>

                    {/* 标题 */}
                    <span className="flex-1 mx-4 link group-hover:text-accent truncate">
                      {post.title}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        /* 无文章时的提示 */
        <div className="text-center py-20">
          <p className="text-body text-theme-text-mute">暂无文章，敬请期待...</p>
        </div>
      )}
    </div>
  );
}
