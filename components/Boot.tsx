"use client";

import { useLayoutEffect } from "react";

export function Boot() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    try {
      const saved = localStorage.getItem("aras-theme");
      if (saved === "dark" || saved === "light") root.dataset.theme = saved;
    } catch {
      /* private mode */
    }
  }, []);

  return null;
}
