"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Every route swap in Next.js App Router is instant by default — no
 * transition at all. This wraps AppShell's <main> content and re-keys on
 * pathname, so React unmounts/remounts the subtree on navigation and the
 * CSS entrance animation (.animate-page-in, see globals.css) plays every
 * time. Deliberately quick (duration-base, ~220ms) and a small
 * opacity+translateY — an acknowledgment that navigation happened, not a
 * second dramatic entrance stacked on top of whatever the destination
 * screen already animates internally (Home's own staggered sections, for
 * instance, are untouched by this — they still run their own timing).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-page-in">
      {children}
    </div>
  );
}
