"use client";

import Link from "next/link";
import { CheckSquare, FileText, Repeat, Calendar } from "lucide-react";
import { useTranslation } from "@/lib/i18n/locale-context";
import type { TranslationKey } from "@/lib/i18n/translate";
import { fadeDelay } from "@/lib/utils";

/**
 * Sprint 4 (Executive Override) — previously four bordered tiles in a
 * grid, visually identical in weight to the bento stat tiles above them.
 * Rebuilt as a minimal icon rail: plain circular icon buttons with a
 * label underneath, no card chrome at all — reads as a fast utility
 * strip (closer to a dock) rather than another set of cards competing
 * for the same attention as Focus/Bento. Same four destinations, same
 * plain-navigation behavior — no new "quick add" flow invented.
 */
const ACTIONS: { href: string; labelKey: TranslationKey; icon: typeof CheckSquare }[] = [
  { href: "/tasks", labelKey: "nav.tasks", icon: CheckSquare },
  { href: "/habits", labelKey: "nav.habits", icon: Repeat },
  { href: "/notes", labelKey: "nav.notes", icon: FileText },
  { href: "/calendar", labelKey: "nav.calendar", icon: Calendar },
];

export function QuickActions() {
  const { t } = useTranslation();

  return (
    <div className="animate-home-fade-up flex items-start justify-between gap-1" style={fadeDelay(240)}>
      {ACTIONS.map(({ href, labelKey, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="focus-ring group flex flex-1 flex-col items-center gap-1.5 rounded-[var(--radius-md)] py-2 text-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-primary)] transition-[transform,background-color] duration-[var(--duration-fast)] ease-out group-hover:-translate-y-0.5 group-hover:bg-[var(--color-surface-hover)] group-active:translate-y-0 group-active:scale-95">
            <Icon size={18} aria-hidden="true" />
          </div>
          <span className="text-[11px] font-medium text-[var(--color-text-muted)]">{t(labelKey)}</span>
        </Link>
      ))}
    </div>
  );
}
