"use client";

import { useEffect } from "react";

export function SiteEffects() {
  useEffect(() => {
    const header = document.querySelector("[data-header]");
    const meta = document.querySelector('meta[name="theme-color"]');
    const previous = meta?.getAttribute("content");
    meta?.setAttribute("content", "#f4f2ee");

    const onScroll = () => {
      const y = Math.max(window.scrollY || 0, document.body.scrollTop || 0);
      header?.classList.toggle("is-scrolled", y > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (previous) meta?.setAttribute("content", previous);
    };
  }, []);

  return null;
}
