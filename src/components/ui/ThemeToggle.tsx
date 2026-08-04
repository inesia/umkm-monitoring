"use client";

import { useTheme } from "@/lib/theme-context";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex items-center rounded-md p-0.5 w-12 h-7 border border-[var(--border-color)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-teal)] focus-visible:ring-offset-2 [--track:var(--card-bg)] [--thumb:var(--text-color)] bg-[var(--track)] hover:opacity-90"
    >
      <span
        className="flex items-center justify-center rounded-md h-6 w-6 bg-[var(--accent-teal)] text-white shadow-sm transition-transform duration-200 ease-out"
        style={{ transform: isDark ? "translateX(0)" : "translateX(20px)" }}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5" aria-hidden />
        ) : (
          <Sun className="w-3.5 h-3.5" aria-hidden />
        )}
      </span>
    </button>
  );
}
