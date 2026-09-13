import type { DisplayProgram, GuestbookEntry } from "./display-content.schema";

export const displayPrograms: readonly Readonly<{
  id: DisplayProgram;
  label: string;
}>[] = [
  { id: "terminal", label: "CLI" },
  { id: "stats", label: "Stats" },
  { id: "guestbook", label: "Guestbook" },
];
export const deskStatistics = [
  { label: "Posts", value: "24" },
  { label: "Thoughts", value: "137" },
] as const;
export const deskTotalVisits = 1284;
export const sampleGuestbook: readonly GuestbookEntry[] = [
  {
    id: "sample-muyu",
    name: "Muyu",
    email: "muyu258@icloud.com",
    githubUsername: "ech0xff",
    message: "Hello from my little corner of the web.",
    date: "2026-09-13T08:00:00.000Z",
  },
  {
    id: "sample-mira",
    name: "Mira",
    email: "mira@example.com",
    message: "A cozy little corner of the internet. Leaving a hello!",
    date: "2026-09-10T10:00:00.000Z",
  },
  {
    id: "sample-noah",
    name: "Noah",
    email: "",
    message: "Stayed for the music. Looking forward to your next post.",
    date: "2026-09-08T10:00:00.000Z",
  },
  {
    id: "sample-anonymous",
    name: "",
    email: "",
    message:
      "Found this desk on a rainy afternoon. The record is a lovely touch.",
    date: "2026-09-07T16:20:00.000Z",
  },
  {
    id: "sample-jules",
    name: "Jules",
    email: "jules@example.com",
    message: "Hello from another night owl. What are you reading lately?",
    date: "2026-09-06T22:10:00.000Z",
  },
  {
    id: "sample-robin",
    name: "Robin",
    email: "",
    message: "The little terminal feels like home.\nSee you around the web!",
    date: "2026-09-05T08:30:00.000Z",
  },
  {
    id: "sample-email",
    name: "",
    email: "hello@example.com",
    message: "One more song before I leave.",
    date: "2026-09-04T13:00:00.000Z",
  },
];
