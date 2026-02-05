// Centralized management of all route paths
export const ROUTES = {
  // Public routes
  HOME: "/",
  POSTS: "/posts",
  POST: (id: string) => `/posts/${id}`,
  THOUGHTS: "/thoughts",
  EVENTS: "/events",

  // Auth routes
  AUTH: "/auth",

  // Dashboard routes
  DASHBOARD: {
    HOME: "/dashboard",
    POSTS: "/dashboard/posts",
    THOUGHTS: "/dashboard/thoughts",
    EVENT: "/dashboard/event",
    IMAGES: "/dashboard/images",
  },
} as const;
