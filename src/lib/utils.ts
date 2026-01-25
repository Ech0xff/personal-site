import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function gd(state: string, value: boolean, classes: string) {
  const prefix = `group-data-[${state}=${value}]:`;
  return classes
    .split(" ")
    .map((cls) => `${prefix}${cls}`)
    .join(" ");
}
