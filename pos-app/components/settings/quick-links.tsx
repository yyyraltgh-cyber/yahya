"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/locale-context";
import type { TranslationKey } from "@/lib/i18n/translate";
import { Library, Trophy, Layers, BookOpen, BarChart3 } from "lucide-react";

/**
 * Fixes a real reachability gap: the mobile bottom nav's "More" tab links
 * directly to /settings (not an expandable menu — see sidebar.tsx's fixed
 * 5-slot mobileItems), so every "secondary" page (library, achievements,
 * areas, reviews, knowledge, statistics) was previously unreachable from
 * the phone UI entirely, even though it existed and worked once opened
 * directly by URL. This card, shown at the top of Settings — the one
 * secondary page every mobile user CAN reach — makes them tappable again.
 */
const LINKS: { href: string; labelKey: TranslationKey; icon: typeof Library }[] = [
  { href: "/library", labelKey: "nav.library", icon: Library },
  { href: "/achievements", labelKey: "nav.achievements", icon: Trophy },
  { href: "/areas", labelKey: "nav.areas", icon: Layers },
  { href: "/reviews", labelKey: "nav.reviews", icon: BookOpen },
  { href: "/knowledge", labelKey: "nav.knowledge", icon: BookOpen },
  { href: "/statistics", labelKey: "nav.statistics", icon: BarChart3 },
];

export function QuickLinksCard() {
  const { t } = useTranslation();
  return (
    <Card>
      <div className="grid grid-cols-3 gap-3">
        {LINKS.map(({ href, labelKey, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="focus-ring flex flex-col items-center gap-1 rounded-[var(--radius-md)] p-2 text-center transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-surface-hover)]"
          >
            <Icon size={20} className="text-[var(--color-primary)]" aria-hidden="true" />
            <span className="text-xs text-[var(--color-text-muted)]">{t(labelKey)}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
