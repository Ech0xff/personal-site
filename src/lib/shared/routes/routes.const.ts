// Centralized management of all route paths
export const ROUTES = {
  // Public routes
  HOME: "/",
  POSTS: "/posts",
  POST: (id: string) => `/posts/${id}`,
  THOUGHTS: "/thoughts",

  // Auth routes
  AUTH: "/auth",

  // Dashboard routes
  DASHBOARD: {
    GUESTBOOK: "/dashboard/guestbook",
    FILES: "/dashboard/files",
    POSTS: "/dashboard/posts",
    THOUGHTS: "/dashboard/thoughts",
  },
} as const;
