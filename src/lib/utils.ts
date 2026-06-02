import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names, resolving conflicts intelligently.
 *
 * Usage:
 *   cn("px-2 py-1", condition && "bg-blue-500", "px-4")
 *   // → "py-1 bg-blue-500 px-4"  (px-2 is overridden by px-4)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
