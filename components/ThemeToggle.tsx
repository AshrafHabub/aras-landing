"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("aras-theme", theme);
  } catch {
    /* private mode */
  }
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#0f1923" : "#f4f2ee");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={theme === "dark" ? "Zu Hell wechseln" : "Zu Dunkel wechseln"}
      onClick={() => {
        const next: Theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        applyTheme(next);
        setTheme(next);
      }}
    >
      <span className="theme-toggle__light">Hell</span>
      <span className="theme-toggle__dark">Dunkel</span>
    </button>
  );
}
