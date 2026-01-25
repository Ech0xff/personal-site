import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function gd(state: string, value: boolean, classes: string) {
  const prefix = `group-data-[${state}=${value}]:`;
  return cn(
    classes
      .split(" ")
      .map((cls) => `${prefix}${cls}`)
      .join(" "),
  );
}

export function gc(className: string, classes: string) {
  const prefix = `group-[.${className}]:`;
  return cn(
    classes
      .split(/\s+/)
      .filter(Boolean)
      .map((cls) => `${prefix}${cls}`)
      .join(" "),
  );
}
